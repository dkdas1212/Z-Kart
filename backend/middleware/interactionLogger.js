// middleware/interactionLogger.js
import Interaction from 'Interaction.js';

const EVENT_WEIGHTS = {
    view: 1,
    add_to_cart: 3,
    purchase: 6,
};

export async function logInteraction({ userId, productId, eventType, sessionId = null }) {
    try {
        const weight = EVENT_WEIGHTS[eventType] || 1;
        const doc = new Interaction({
            user: userId || null,
            product: productId,
            eventType,
            weight,
            sessionId,
        });
        await doc.save();
    } catch (err) {
        console.error('Interaction log error:', err);
    }
}

// Express middleware factory (optional usage)
export function interactionMiddleware(eventType) {
    return async (req, res, next) => {
        try {
            const userId = req.user ? req.user._id : null;
            const productId = req.params.id || req.body.productId || req.query.productId;
            if (productId) {
                await logInteraction({ userId, productId, eventType, sessionId: req.sessionID });
            }
        } catch (e) {
            console.error('interaction middleware error', e);
        }
        next();
    };
}
