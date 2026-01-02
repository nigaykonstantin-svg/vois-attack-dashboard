// Conversion Funnel visualization component
// Shows: Views → Cart → Orders with CR rates
// Uses December data by default (November has no view data)

import { formatNumber } from '../../utils/formatters';

const ConversionFunnel = ({ product, compact = false }) => {
    if (!product) return null;

    // Use December data (November has no views data)
    const views = product.decemberViews || 0;
    const cart = product.decemberCart || 0;
    const orders = product.decemberOrders || 0;
    const crCart = product.decemberCrCart || 0; // CR views → cart
    const crOrder = product.decemberCrOrder || 0; // CR cart → orders

    // Format percentages
    const crCartPct = (crCart * 100).toFixed(0);
    const crOrderPct = (crOrder * 100).toFixed(0);

    // Compact version for ProductCard
    if (compact) {
        // If no December data, show a message
        if (views === 0) {
            return (
                <div style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '6px',
                    fontStyle: 'italic'
                }}>
                    Данные воронки за декабрь...
                </div>
            );
        }

        return (
            <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '6px'
            }}>
                <span title="Просмотры (декабрь)">
                    👁️ {formatNumber(views)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                <span title="CR просмотры → корзина">
                    🛒 <span style={{ color: crCart >= 0.12 ? '#4ade80' : crCart >= 0.08 ? '#fbbf24' : '#f87171' }}>{crCartPct}%</span>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                <span title="CR корзина → заказ">
                    ✅ <span style={{ color: crOrder >= 0.55 ? '#4ade80' : crOrder >= 0.40 ? '#fbbf24' : '#f87171' }}>{crOrderPct}%</span>
                </span>
            </div>
        );
    }

    // Full version for AttackPanel
    const stages = [
        {
            label: 'Показы',
            value: formatNumber(views),
            rate: null,
            color: '#667eea',
            width: 100
        },
        {
            label: 'Корзина',
            value: formatNumber(cart),
            rate: crCartPct,
            rateLabel: 'CTR',
            color: '#FFD93D',
            width: 70
        },
        {
            label: 'Заказы',
            value: formatNumber(orders),
            rate: crOrderPct,
            rateLabel: 'CR',
            color: '#22c55e',
            width: 45
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
                <span style={{
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.3)',
                    marginLeft: 'auto'
                }}>
                    декабрь 2025
                </span>
            </div>

            {views === 0 ? (
                <div style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    padding: '10px'
                }}>
                    Нет данных по просмотрам
                </div>
            ) : (
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
                                    color: parseInt(stage.rate) >= 50 ? '#4ade80' : parseInt(stage.rate) >= 20 ? '#fbbf24' : '#f87171',
                                    minWidth: '50px'
                                }}>
                                    {stage.rateLabel}: {stage.rate}%
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConversionFunnel;
