import { formatNumber } from '../../utils/formatters';
import StatCard from '../shared/StatCard';

const EconomicsTab = ({
    voisProducts,
    weapons,
    totalBudget,
    activeTargets,
    totalVoisRevenue,
    getTargetWeapons,
    budgets,
    getProductData
}) => {
    const avgBudgetPerTarget = Math.round(totalBudget / (activeTargets || 1));

    return (
        <div className="animate-slide-up">
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <StatCard label="Общий бюджет" value={`₽${formatNumber(totalBudget)}`} color="#FF6B6B" />
                <StatCard label="Целей атакуем" value={activeTargets} color="#4ECDC4" />
                <StatCard label="Выручка VOIS" value={`₽${formatNumber(totalVoisRevenue)}`} color="#FFD93D" />
                <StatCard label="Ср. бюджет/цель" value={`₽${formatNumber(avgBudgetPerTarget)}`} color="#6C5CE7" />
            </div>

            {/* Budget table */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <th style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Товар</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Выручка VOIS</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Бюджет</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Инструменты</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voisProducts.filter(p => getTargetWeapons(p.id).length > 0 || budgets[p.id]).map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '10px 12px' }}>
                                    <a href={p.wbUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4ECDC4', fontSize: '10px' }}>{p.sku}</a>
                                    <div style={{ fontSize: '11px' }}>{p.name}</div>
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#FF6B6B' }} className="font-mono">
                                    ₽{formatNumber(getProductData(p).revenue)}
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600' }} className="font-mono">
                                    {budgets[p.id] ? `₽${formatNumber(parseInt(budgets[p.id]))}` : '—'}
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                    {getTargetWeapons(p.id).map(wId => weapons.find(w => w.id === wId)?.icon).join(' ') || '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EconomicsTab;
