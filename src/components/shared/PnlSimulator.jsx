import { useState, useMemo } from 'react';
import { formatNumber } from '../../utils/formatters';

// Default P&L cost structure (based on typical cosmetics brand)
const DEFAULT_COSTS = {
    logistics: 0.8,        // Транспортная логистика
    cogs: 32.0,           // КП (Себестоимость продукции)
    marketing: 1.5,       // Реклама, маркетинг, PR
    payroll: 5.9,         // ФОТ
    rent: 0.3,            // Аренда и содержание
    it: 0.7,              // ИТ-расходы
    other: 1.0,           // Прочие операционные расходы
    wbCommission: 15.0,   // Комиссия WB (примерная)
};

const PnlSimulator = ({ voisProducts, filterMonth, getProductData }) => {
    // P&L percentage sliders
    const [costs, setCosts] = useState(DEFAULT_COSTS);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Calculate total revenue based on filter
    const totalRevenue = useMemo(() => {
        return voisProducts.reduce((sum, p) => sum + getProductData(p).revenue, 0);
    }, [voisProducts, filterMonth]);

    const updateCost = (key, value) => {
        setCosts(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
    };

    // Calculate P&L for given revenue
    const calculatePnl = (revenue) => {
        const logisticsCost = revenue * (costs.logistics / 100);
        const cogsCost = revenue * (costs.cogs / 100);
        const grossProfit = revenue - cogsCost - logisticsCost;

        const marketingCost = revenue * (costs.marketing / 100);
        const payrollCost = revenue * (costs.payroll / 100);
        const rentCost = revenue * (costs.rent / 100);
        const itCost = revenue * (costs.it / 100);
        const otherCost = revenue * (costs.other / 100);
        const wbCommission = revenue * (costs.wbCommission / 100);

        const totalOpex = marketingCost + payrollCost + rentCost + itCost + otherCost + wbCommission;
        const ebitda = grossProfit - totalOpex;
        const ebitdaMargin = (ebitda / revenue) * 100;

        return {
            revenue,
            logisticsCost,
            cogsCost,
            grossProfit,
            grossMargin: (grossProfit / revenue) * 100,
            marketingCost,
            payrollCost,
            rentCost,
            itCost,
            otherCost,
            wbCommission,
            totalOpex,
            ebitda,
            ebitdaMargin
        };
    };

    const pnl = calculatePnl(totalRevenue);
    const productPnl = selectedProduct ? calculatePnl(getProductData(selectedProduct).revenue) : null;

    const costItems = [
        { key: 'logistics', label: 'Транспортная логистика', icon: '🚚' },
        { key: 'cogs', label: 'Себестоимость (КП)', icon: '📦' },
        { key: 'wbCommission', label: 'Комиссия WB', icon: '🏪' },
        { key: 'marketing', label: 'Маркетинг, реклама', icon: '📢' },
        { key: 'payroll', label: 'ФОТ', icon: '👥' },
        { key: 'rent', label: 'Аренда', icon: '🏢' },
        { key: 'it', label: 'ИТ-расходы', icon: '💻' },
        { key: 'other', label: 'Прочие расходы', icon: '📋' },
    ];

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px'
        }}>
            <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                💰 P&L Симулятор VOIS
                <span style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 'normal'
                }}>
                    (моделирование прибыльности)
                </span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left: Cost sliders */}
                <div>
                    <div style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '12px'
                    }}>
                        ⚙️ Настройка структуры затрат (% от выручки)
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {costItems.map(item => (
                            <div key={item.key} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '8px'
                            }}>
                                <span style={{ fontSize: '14px', width: '24px' }}>{item.icon}</span>
                                <span style={{
                                    flex: 1,
                                    fontSize: '11px',
                                    color: 'rgba(255,255,255,0.7)'
                                }}>
                                    {item.label}
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max={item.key === 'cogs' ? 60 : item.key === 'wbCommission' ? 30 : 20}
                                    step="0.1"
                                    value={costs[item.key]}
                                    onChange={(e) => updateCost(item.key, e.target.value)}
                                    style={{
                                        width: '80px',
                                        accentColor: '#FF6B6B'
                                    }}
                                />
                                <span style={{
                                    width: '50px',
                                    textAlign: 'right',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#4ECDC4'
                                }} className="font-mono">
                                    {costs[item.key].toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Reset button */}
                    <button
                        onClick={() => setCosts(DEFAULT_COSTS)}
                        style={{
                            marginTop: '12px',
                            padding: '8px 16px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '11px',
                            cursor: 'pointer'
                        }}
                    >
                        ↺ Сбросить к стандартным
                    </button>
                </div>

                {/* Right: P&L Results */}
                <div>
                    <div style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '12px'
                    }}>
                        📊 Расчетный P&L VOIS ({filterMonth === 'november' ? 'Ноябрь' : filterMonth === 'december' ? 'Декабрь' : 'Ноябрь-Декабрь'})
                    </div>

                    {/* Revenue */}
                    <div style={{
                        padding: '12px',
                        background: 'linear-gradient(135deg, rgba(78,205,196,0.15), rgba(78,205,196,0.05))',
                        borderRadius: '8px',
                        marginBottom: '8px'
                    }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>ВЫРУЧКА</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#4ECDC4' }} className="font-mono">
                            ₽{formatNumber(pnl.revenue)}
                        </div>
                    </div>

                    {/* Costs breakdown */}
                    <div style={{
                        padding: '12px',
                        background: 'rgba(255,71,87,0.1)',
                        borderRadius: '8px',
                        marginBottom: '8px'
                    }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>ЗАТРАТЫ</div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Логистика:</span>
                                <span style={{ color: '#FF6B6B' }}>-₽{formatNumber(pnl.logisticsCost)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>КП:</span>
                                <span style={{ color: '#FF6B6B' }}>-₽{formatNumber(pnl.cogsCost)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Комиссия WB:</span>
                                <span style={{ color: '#FF6B6B' }}>-₽{formatNumber(pnl.wbCommission)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Маркетинг:</span>
                                <span style={{ color: '#FF6B6B' }}>-₽{formatNumber(pnl.marketingCost)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>ФОТ:</span>
                                <span style={{ color: '#FF6B6B' }}>-₽{formatNumber(pnl.payrollCost)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Прочее:</span>
                                <span style={{ color: '#FF6B6B' }}>-₽{formatNumber(pnl.rentCost + pnl.itCost + pnl.otherCost)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Gross Profit */}
                    <div style={{
                        padding: '12px',
                        background: 'rgba(255,215,61,0.1)',
                        borderRadius: '8px',
                        marginBottom: '8px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>ВАЛОВАЯ ПРИБЫЛЬ</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFD93D' }} className="font-mono">
                                    ₽{formatNumber(pnl.grossProfit)}
                                </div>
                            </div>
                            <div style={{
                                padding: '4px 10px',
                                background: 'rgba(255,215,61,0.2)',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#FFD93D'
                            }}>
                                {pnl.grossMargin.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    {/* EBITDA */}
                    <div style={{
                        padding: '16px',
                        background: pnl.ebitda > 0
                            ? 'linear-gradient(135deg, rgba(46,213,115,0.2), rgba(46,213,115,0.05))'
                            : 'linear-gradient(135deg, rgba(255,71,87,0.2), rgba(255,71,87,0.05))',
                        borderRadius: '8px',
                        border: pnl.ebitda > 0
                            ? '1px solid rgba(46,213,115,0.3)'
                            : '1px solid rgba(255,71,87,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>EBITDA (Операц. прибыль)</div>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: pnl.ebitda > 0 ? '#2ED573' : '#FF4757'
                                }} className="font-mono">
                                    ₽{formatNumber(pnl.ebitda)}
                                </div>
                            </div>
                            <div style={{
                                padding: '8px 16px',
                                background: pnl.ebitda > 0 ? 'rgba(46,213,115,0.3)' : 'rgba(255,71,87,0.3)',
                                borderRadius: '8px',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: pnl.ebitda > 0 ? '#2ED573' : '#FF4757'
                            }}>
                                {pnl.ebitdaMargin.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Per-product selector */}
            <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px'
            }}>
                <div style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '10px'
                }}>
                    🎯 Симуляция по отдельному товару
                </div>

                <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                        const product = voisProducts.find(p => p.id === parseInt(e.target.value));
                        setSelectedProduct(product || null);
                    }}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                        marginBottom: '12px'
                    }}
                >
                    <option value="">— Выберите товар —</option>
                    {voisProducts.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name} (₽{formatNumber(getProductData(p).revenue)})
                        </option>
                    ))}
                </select>

                {productPnl && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '10px'
                    }}>
                        <div style={{
                            padding: '10px',
                            background: 'rgba(78,205,196,0.1)',
                            borderRadius: '6px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>Выручка</div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#4ECDC4' }}>
                                ₽{formatNumber(productPnl.revenue)}
                            </div>
                        </div>
                        <div style={{
                            padding: '10px',
                            background: 'rgba(255,71,87,0.1)',
                            borderRadius: '6px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>Затраты</div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#FF6B6B' }}>
                                ₽{formatNumber(productPnl.revenue - productPnl.ebitda)}
                            </div>
                        </div>
                        <div style={{
                            padding: '10px',
                            background: productPnl.ebitda > 0 ? 'rgba(46,213,115,0.1)' : 'rgba(255,71,87,0.1)',
                            borderRadius: '6px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>EBITDA</div>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                color: productPnl.ebitda > 0 ? '#2ED573' : '#FF4757'
                            }}>
                                ₽{formatNumber(productPnl.ebitda)}
                            </div>
                        </div>
                        <div style={{
                            padding: '10px',
                            background: productPnl.ebitda > 0 ? 'rgba(46,213,115,0.1)' : 'rgba(255,71,87,0.1)',
                            borderRadius: '6px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>Маржа</div>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                color: productPnl.ebitda > 0 ? '#2ED573' : '#FF4757'
                            }}>
                                {productPnl.ebitdaMargin.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PnlSimulator;
