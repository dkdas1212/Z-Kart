// scripts/buildItemSims.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/productModel.js';
import Interaction from '../models/Interaction.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
}

async function connect() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for building item sims');
}

function cosineBetween(mA, mB) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (const [u, wA] of mA.entries()) {
        normA += wA * wA;
    }
    for (const [u, wB] of mB.entries()) {
        normB += wB * wB;
    }
    for (const [u, wA] of mA.entries()) {
        if (mB.has(u)) {
            dot += wA * mB.get(u);
        }
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function run() {
    await connect();

    console.log('Loading interactions...');
    const allInteractions = await Interaction.find({}).lean();
    console.log(`Loaded ${allInteractions.length} interactions`);

    const prodUserMap = new Map();
    for (const it of allInteractions) {
        const pid = String(it.product);
        const uid = it.user ? String(it.user) : (`anon:${it.sessionId || 'unknown'}`);
        const w = it.weight || 1;
        if (!prodUserMap.has(pid)) prodUserMap.set(pid, new Map());
        const uMap = prodUserMap.get(pid);
        uMap.set(uid, (uMap.get(uid) || 0) + w);
    }

    const productIds = Array.from(prodUserMap.keys());
    console.log(`Found ${productIds.length} products with interactions`);

    const TOP_K = 100;

    const ItemSim = mongoose.model('ItemSim', new mongoose.Schema({
        productId: String,
        sims: [{ productId: String, score: Number }],
    }, { collection: 'item_similarities' }));

    await ItemSim.deleteMany({});
    console.log('Cleared existing item_similarities collection');

    for (let i = 0; i < productIds.length; i++) {
        const pidA = productIds[i];
        const mapA = prodUserMap.get(pidA);
        const sims = [];
        for (let j = 0; j < productIds.length; j++) {
            if (i === j) continue;
            const pidB = productIds[j];
            const mapB = prodUserMap.get(pidB);
            const score = cosineBetween(mapA, mapB);
            if (score > 0) sims.push({ productId: pidB, score });
        }
        sims.sort((a, b) => b.score - a.score);
        const top = sims.slice(0, TOP_K);
        const doc = new ItemSim({ productId: pidA, sims: top });
        try {
            await doc.save();
        } catch (err) {
            console.error('Error saving ItemSim for', pidA, err);
        }
        if (i % 50 === 0) {
            console.log(`Processed ${i + 1}/${productIds.length}`);
        }
    }

    console.log('Finished computing item similarities');
    process.exit(0);
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
