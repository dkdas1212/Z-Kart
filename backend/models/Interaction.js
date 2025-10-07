// models/Interaction.js
import mongoose from 'mongoose';

const interactionSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        eventType: { type: String, enum: ['view', 'add_to_cart', 'purchase'], required: true },
        weight: { type: Number, required: true, default: 1 },
        sessionId: { type: String, required: false },
    },
    { timestamps: true }
);

const Interaction = mongoose.model('Interaction', interactionSchema);
export default Interaction;
