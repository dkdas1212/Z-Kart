// src/components/RecommendationCarousel.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RecommendationCarousel({ userId }) {
    const [recs, setRecs] = useState([]);

    useEffect(() => {
        if (!userId) return;
        (async () => {
            try {
                const { data } = await axios.get(`/api/recommend/${userId}?k=8`);
                setRecs(data.recommendations || []);
            } catch (err) {
                console.error('Failed to load recs', err);
            }
        })();
    }, [userId]);

    if (!recs || recs.length === 0) return null;

    return (
        <div className="recommendations">
            <h3>Recommended for you</h3>
            <div className="rec-row" style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
                {recs.map(p => (
                    <div key={p._id} className="rec-card" style={{ width: 140, border: '1px solid #eee', padding: 8, borderRadius: 6 }}>
                        <a href={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img src={p.image} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }} />
                            <div style={{ marginTop: 8, fontSize: 14 }}>{p.name}</div>
                            <div style={{ fontWeight: 600 }}>₹{p.price}</div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
