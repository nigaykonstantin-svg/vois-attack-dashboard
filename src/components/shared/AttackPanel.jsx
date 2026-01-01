import { formatNumber, formatReviews } from '../../utils/formatters';
import WeaponButton from './WeaponButton';
import ConversionFunnel from './ConversionFunnel';

const AttackPanel = ({
    target,
    weapons,
    targetWeapons,
    budget,
    onClose,
    onToggleWeapon,
    onBudgetChange,
    getProductData
}) => {
    const data = getProductData(target);

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,107,107,0.2)',
            borderRadius: '12px',
            padding: '16px',
            position: 'sticky',
            top: '90px',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto'
        }} className="animate-slide-up">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#FF6B6B', fontWeight: '600', marginBottom: '2px' }}>АТАКА</div>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{target.name}</h3>
                </div>
                <button
                    onClick={onClose}
                    className="btn"
                    style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', width: '26px', height: '26px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}
                >×</button>
            </div>

            {/* WB Link */}
            <a
                href={target.wbUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'block',
                    padding: '10px',
                    background: 'rgba(78,205,196,0.1)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '11px',
                    color: '#4ECDC4'
                }}
            >
                🔗 Открыть на Wildberries → SKU {target.sku}
            </a>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,107,107,0.08)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>ВЫРУЧКА</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#FF6B6B' }}>₽{formatNumber(data.revenue)}</div>
                </div>
                <div style={{ padding: '10px', background: 'rgba(255,215,61,0.08)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>ОТЗЫВОВ</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFD93D' }}>{formatReviews(target.reviews)}</div>
                </div>
            </div>

            {/* Conversion Funnel (full) */}
            <ConversionFunnel product={target} compact={false} />

            {/* Budget */}
            <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '4px' }}>БЮДЖЕТ</label>
                <input
                    type="number"
                    value={budget || ''}
                    onChange={(e) => onBudgetChange(e.target.value)}
                    placeholder="0"
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '700'
                    }}
                    className="font-mono"
                />
            </div>

            {/* Weapons */}
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>ИНСТРУМЕНТЫ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {weapons.map(weapon => (
                    <WeaponButton
                        key={weapon.id}
                        weapon={weapon}
                        isActive={targetWeapons.includes(weapon.id)}
                        onClick={() => onToggleWeapon(weapon.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AttackPanel;
