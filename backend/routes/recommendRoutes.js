// routes/recommendRoutes.js
import express from 'express';
import Product from '../models/productModel.js';
import Interaction from '../models/Interaction.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * GET /api/recommend/:userId?k=10
 */
router.get('/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const k = Number(req.query.k) || 10;
  const RECENT_N = 10;

  // 1) recent interactions
  let interactions = [];
  try {
    interactions = await Interaction.find({ user: mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(RECENT_N)
      .lean();
  } catch (e) {
    interactions = [];
  }

  const recentProductIds = [...new Set(interactions.map(i => String(i.product)))];

  if (recentProductIds.length === 0) {
    // fallback: top-rated / top-reviewed
    const fallback = await Product.find({}).sort({ rating: -1, numReviews: -1 }).limit(k).lean();
    return res.json({ userId, recommendations: fallback });
  }

  // 2) Item similarities collection model
  const ItemSim = mongoose.model('ItemSim', new mongoose.Schema({
    productId: String,
    sims: [{ productId: String, score: Number }],
  }, { collection: 'item_similarities' }));

  // 3) load similarity docs for recent items
  const simsDocs = await ItemSim.find({ productId: { $in: recentProductIds } }).lean();

  // 4) aggregate scores
  const scoreMap = new Map();
  for (const doc of simsDocs) {
    for (const s of doc.sims || []) {
      const pid = String(s.productId);
      if (recentProductIds.includes(pid)) continue;
      scoreMap.set(pid, (scoreMap.get(pid) || 0) + (s.score || 0));
    }
  }

  const candidates = Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(e => e[0]);

  // 5) filter and fetch product objects
  const filteredCandidates = [];
  for (const pid of candidates) {
    if (recentProductIds.includes(pid)) continue;
    try {
      const p = await Product.findById(pid).lean();
      if (!p) continue;
      if (p.countInStock && p.countInStock <= 0) continue;
      filteredCandidates.push(p);
      if (filteredCandidates.length >= k) break;
    } catch (e) {
      continue;
    }
  }

  // 6) fallback fill
  if (filteredCandidates.length < k) {
    const need = k - filteredCandidates.length;
    const excludeIds = recentProductIds.concat(filteredCandidates.map(p => String(p._id)));
    const fill = await Product.find({ _id: { $nin: excludeIds } })
      .sort({ rating: -1, numReviews: -1 })
      .limit(need).lean();
    filteredCandidates.push(...fill);
  }

  res.json({ userId, recommendations: filteredCandidates.slice(0, k) });
}));

export default router;
