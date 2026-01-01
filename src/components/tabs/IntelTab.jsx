import { formatNumber, formatReviews } from '../../utils/formatters';

const IntelTab = ({ voisProducts, getProductData }) => {
    const topByRevenue = [...voisProducts]
        .sort((a, b) => getProductData(b).revenue - getProductData(a).revenue)
        .slice(0, 5);

    const topByReviews = [...voisProducts]
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 5);

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Top by revenue */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '14px' }}>📊 Топ-5 по выручке</h3>
                    {topByRevenue.map((p, i) => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <div>
                                <span style={{ color: '#FFD93D', marginRight: '8px' }}>#{i + 1}</span>
                                <span style={{ fontSize: '12px' }}>{p.name.slice(0, 35)}...</span>
                            </div>
                            <span style={{ color: '#FF6B6B', fontSize: '12px' }} className="font-mono">₽{formatNumber(getProductData(p).revenue)}</span>
                        </div>
                    ))}
                </div>

                {/* Top by reviews */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '14px' }}>⭐ Топ-5 по отзывам</h3>
                    {topByReviews.map((p, i) => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <div>
                                <span style={{ color: '#FFD93D', marginRight: '8px' }}>#{i + 1}</span>
                                <span style={{ fontSize: '12px' }}>{p.name.slice(0, 35)}...</span>
                            </div>
                            <span style={{ color: '#4ECDC4', fontSize: '12px' }}>{formatReviews(p.reviews)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vulnerabilities */}
            <div style={{ marginTop: '20px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '12px', padding: '16px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#FF6B6B' }}>🎯 Ключевые уязвимости VOIS</h3>
                <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '12px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)' }}>
                    <li>Маски для волос = 35% выручки. Критическая зависимость от одной линейки.</li>
                    <li>Патчи с 336K отзывов — якорный продукт, но выкуп 97% говорит о лояльности.</li>
                    <li>Наборы имеют низкий выкуп (82%) — уязвимая точка.</li>
                    <li>Нет сильного амбассадора уровня Елены Назаровой.</li>
                    <li>Рост декабрь vs ноябрь в среднем +35% — сезонный фактор.</li>
                </ul>
            </div>
        </div>
    );
};

export default IntelTab;
