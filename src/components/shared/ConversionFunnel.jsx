// Conversion Funnel visualization component
// Shows: Impressions → CTR → Add to Cart Rate → Order Rate

const ConversionFunnel = ({ product, compact = false }) => {
    if (!product) return null;

    const {
        totalImpressions = 0,
        totalClicks = 0,
        totalCartAdds = 0,
        ctr = 0,
        addToCartRate = 0,
        orderRate = 0
    } = product;

    const totalOrders = (product.novemberOrders || 0) + (product.decemberOrders || 0);

    // Compact version for ProductCard
    if (compact) {
        return (
            <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '6px'
            }}>
                <span title="CTR (Клики / Показы)">
                    CTR: <span style={{ color: ctr >= 5 ? '#4ade80' : ctr >= 2 ? '#fbbf24' : '#f87171' }}>{ctr}%</span>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                <span title="В корзину / Клики">
                    Cart: <span style={{ color: addToCartRate >= 20 ? '#4ade80' : addToCartRate >= 10 ? '#fbbf24' : '#f87171' }}>{addToCartRate}%</span>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                <span title="Заказы / В корзину">
                    Order: <span style={{ color: orderRate >= 50 ? '#4ade80' : orderRate >= 30 ? '#fbbf24' : '#f87171' }}>{orderRate}%</span>
                </span>
            </div>
        );
    }

    // Full version for AttackPanel
    const stages = [
        {
            label: 'Показы',
            value: totalImpressions.toLocaleString('ru-RU'),
            rate: null,
            color: '#6366f1',
            width: 100
        },
        {
            label: 'Клики',
            value: totalClicks.toLocaleString('ru-RU'),
            rate: ctr,
            rateLabel: 'CTR',
            color: '#8b5cf6',
            width: 80
        },
        {
            label: 'В корзину',
            value: totalCartAdds.toLocaleString('ru-RU'),
            rate: addToCartRate,
            rateLabel: 'CR',
            color: '#a855f7',
            width: 60
        },
        {
            label: 'Заказы',
            value: totalOrders.toLocaleString('ru-RU'),
            rate: orderRate,
            rateLabel: 'CR',
            color: '#22c55e',
            width: 40
        },
    ];

    return (
        <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '12px'
        }}>
            <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                <span>📊</span>
                <span>Воронка конверсии</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stages.map((stage, idx) => (
                    <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Funnel bar */}
                        <div style={{
                            width: `${stage.width}%`,
                            background: `linear-gradient(90deg, ${stage.color}, ${stage.color}88)`,
                            borderRadius: '4px',
                            padding: '6px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                        }}>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)' }}>
                                {stage.label}
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#fff' }}>
                                {stage.value}
                            </span>
                        </div>

                        {/* Conversion rate */}
                        {stage.rate !== null && (
                            <span style={{
                                fontSize: '10px',
                                color: stage.rate >= 20 ? '#4ade80' : stage.rate >= 5 ? '#fbbf24' : '#f87171',
                                minWidth: '50px'
                            }}>
                                {stage.rateLabel}: {stage.rate}%
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversionFunnel;
