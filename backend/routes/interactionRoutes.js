// routes/interactionRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import Interaction from '../models/Interaction.js';

const router = express.Router();

// POST /api/interactions/log
// body: { productId, eventType }
router.post('/log', asyncHandler(async (req, res) => {
    const { productId, eventType } = req.body;
    const userId = req.user ? req.user._id : null;
    const weightMap = { view: 1, add_to_cart: 3, purchase: 6 };
    const weight = weightMap[eventType] || 1;
    const doc = new Interaction({
        user: userId,
        product: productId,
        eventType,
        weight,
        sessionId: req.sessionID || null,
    });
    await doc.save();
    res.json({ success: true });
}));

export default router;
