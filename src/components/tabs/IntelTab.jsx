import { formatNumber, formatReviews } from '../../utils/formatters';
import PnlSimulator from '../shared/PnlSimulator';

const IntelTab = ({ voisProducts, getProductData, filterMonth }) => {
    const topByRevenue = [...voisProducts]
        .sort((a, b) => getProductData(b).revenue - getProductData(a).revenue)
        .slice(0, 5);

    const topByReviews = [...voisProducts]
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 5);

    // Calculate funnel data for selected month
    const getFunnelData = (product) => {
        if (filterMonth === 'november') {
            return {
                views: product.novemberViews || 0,
                cart: product.novemberCart || 0,
                orders: product.novemberOrders || 0,
                crCart: product.novemberCrCart || 0,
                crOrder: product.novemberCrOrder || 0
            };
        }
        // Default to December (has actual data)
        return {
            views: product.decemberViews || 0,
            cart: product.decemberCart || 0,
            orders: product.decemberOrders || 0,
            crCart: product.decemberCrCart || 0,
            crOrder: product.decemberCrOrder || 0
        };
    };

    // Calculate aggregate funnel metrics
    const aggregateFunnel = voisProducts.reduce((acc, p) => {
        const fd = getFunnelData(p);
        return {
            views: acc.views + fd.views,
            cart: acc.cart + fd.cart,
            orders: acc.orders + (filterMonth === 'november' ? p.novemberOrders : p.decemberOrders),
        };
    }, { views: 0, cart: 0, orders: 0 });

    const avgCrCart = aggregateFunnel.views > 0
        ? (aggregateFunnel.cart / aggregateFunnel.views * 100).toFixed(1)
        : 0;
    const avgCrOrder = aggregateFunnel.cart > 0
        ? (aggregateFunnel.orders / aggregateFunnel.cart * 100).toFixed(1)
        : 0;

    // Top by CR (cart to order) - December only
    const topByCR = filterMonth !== 'november'
        ? [...voisProducts]
            .filter(p => p.decemberCrOrder > 0)
            .sort((a, b) => b.decemberCrOrder - a.decemberCrOrder)
            .slice(0, 5)
        : [];

    // Worst CR (opportunities)
    const worstByCR = filterMonth !== 'november'
        ? [...voisProducts]
            .filter(p => p.decemberCrOrder > 0)
            .sort((a, b) => a.decemberCrOrder - b.decemberCrOrder)
            .slice(0, 5)
        : [];

    return (
        <div className="animate-slide-up">
            {/* Sales Funnel Section */}
            <div style={{
                background: 'rgba(102,126,234,0.08)',
                border: '1px solid rgba(102,126,234,0.2)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
            }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#667eea' }}>
                    📊 Воронка продаж VOIS • {filterMonth === 'november' ? 'Ноябрь' : filterMonth === 'december' ? 'Декабрь' : 'Все время'}
                </h3>

                {filterMonth === 'november' ? (
                    <div style={{
                        padding: '20px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.5)'
                    }}>
                        ⚠️ Данные по просмотрам за ноябрь отсутствуют. Переключитесь на Декабрь для анализа воронки.
                    </div>
                ) : (
                    <>
                        {/* Funnel visualization */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            marginBottom: '20px'
                        }}>
                            {/* Views */}
                            <div style={{
                                textAlign: 'center',
                                padding: '16px 24px',
                                background: 'rgba(102,126,234,0.15)',
                                borderRadius: '10px',
                                minWidth: '140px'
                            }}>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                                    👁️ ПРОСМОТРЫ
                                </div>
                                <div style={{ fontSize: '22px', fontWeight: '700', color: '#667eea' }} className="font-mono">
                                    {formatNumber(aggregateFunnel.views)}
                                </div>
                            </div>

                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px' }}>→</div>

                            {/* CR to Cart */}
                            <div style={{
                                textAlign: 'center',
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '6px'
                            }}>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>CR</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#4ECDC4' }}>{avgCrCart}%</div>
                            </div>

                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px' }}>→</div>

                            {/* Cart */}
                            <div style={{
                                textAlign: 'center',
                                padding: '16px 24px',
                                background: 'rgba(255,215,61,0.15)',
                                borderRadius: '10px',
                                minWidth: '140px'
                            }}>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                                    🛒 КОРЗИНА
                                </div>
                                <div style={{ fontSize: '22px', fontWeight: '700', color: '#FFD93D' }} className="font-mono">
                                    {formatNumber(aggregateFunnel.cart)}
                                </div>
                            </div>

                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px' }}>→</div>

                            {/* CR to Order */}
                            <div style={{
                                textAlign: 'center',
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '6px'
                            }}>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>CR</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#4ECDC4' }}>{avgCrOrder}%</div>
                            </div>

                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px' }}>→</div>

                            {/* Orders */}
                            <div style={{
                                textAlign: 'center',
                                padding: '16px 24px',
                                background: 'rgba(46,213,115,0.15)',
                                borderRadius: '10px',
                                minWidth: '140px'
                            }}>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                                    ✅ ЗАКАЗЫ
                                </div>
                                <div style={{ fontSize: '22px', fontWeight: '700', color: '#2ED573' }} className="font-mono">
                                    {formatNumber(aggregateFunnel.orders)}
                                </div>
                            </div>
                        </div>

                        {/* CR Analysis */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {/* Best CR */}
                            <div style={{
                                background: 'rgba(46,213,115,0.1)',
                                borderRadius: '8px',
                                padding: '14px'
                            }}>
                                <h4 style={{ margin: '0 0 10px', fontSize: '12px', color: '#2ED573' }}>
                                    🏆 Топ-5 по CR корзина→заказ
                                </h4>
                                {topByCR.map((p, i) => (
                                    <div key={p.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '6px 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        fontSize: '11px'
                                    }}>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                                            {p.name.slice(0, 30)}...
                                        </span>
                                        <span style={{ color: '#2ED573', fontWeight: '600' }}>
                                            {(p.decemberCrOrder * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Worst CR - Opportunities */}
                            <div style={{
                                background: 'rgba(255,107,107,0.1)',
                                borderRadius: '8px',
                                padding: '14px'
                            }}>
                                <h4 style={{ margin: '0 0 10px', fontSize: '12px', color: '#FF6B6B' }}>
                                    🎯 Низкий CR - возможности для атаки
                                </h4>
                                {worstByCR.map((p, i) => (
                                    <div key={p.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '6px 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        fontSize: '11px'
                                    }}>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                                            {p.name.slice(0, 30)}...
                                        </span>
                                        <span style={{ color: '#FF6B6B', fontWeight: '600' }}>
                                            {(p.decemberCrOrder * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

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
                    <li>Низкий CR корзина→заказ у подарочных наборов (7%) — можно перехватить аудиторию.</li>
                    <li>Нет сильного амбассадора уровня Елены Назаровой.</li>
                    <li>Рост декабрь vs ноябрь в среднем +35% — сезонный фактор.</li>
                </ul>
            </div>

            {/* P&L Simulator */}
            <PnlSimulator
                voisProducts={voisProducts}
                filterMonth={filterMonth}
                getProductData={getProductData}
            />
        </div>
    );
};

export default IntelTab;
