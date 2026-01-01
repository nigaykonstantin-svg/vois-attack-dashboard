import { formatNumber } from '../../utils/formatters';

const ArsenalTab = ({ weapons, getWeaponUsageCount }) => {
    return (
        <div className="animate-slide-up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                {weapons.map(weapon => {
                    const usedCount = getWeaponUsageCount(weapon.id);
                    return (
                        <div key={weapon.id} style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            padding: '16px',
                            borderTop: `3px solid ${weapon.color}`
                        }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <span style={{ fontSize: '24px' }}>{weapon.icon}</span>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{weapon.name}</h3>
                                    <span style={{
                                        fontSize: '9px', padding: '2px 6px',
                                        background: weapon.impact === 'critical' ? '#FF4757' : weapon.impact === 'high' ? '#FFA502' : '#2ED573',
                                        borderRadius: '4px'
                                    }}>
                                        {weapon.impact.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>₽{formatNumber(weapon.costMin)} – {formatNumber(weapon.costMax)}</span>
                                <span style={{ color: '#4ECDC4' }}>{usedCount} целей</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ArsenalTab;
