import { formatNumber } from '../../utils/formatters';

const Header = ({
    productsCount,
    filterMonth,
    setFilterMonth,
    totalVoisRevenue,
    totalBudget,
    activeTargets,
    onLogout
}) => {
    const months = [
        { id: 'all', label: 'Все' },
        { id: 'november', label: 'Ноябрь' },
        { id: 'december', label: 'Декабрь' },
    ];

    return (
        <header style={{
            padding: '16px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(10,10,15,0.95)',
            backdropFilter: 'blur(20px)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                    width: '42px',
                    height: '42px',
                    background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                }}>⚔️</div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                        MIXIT <span style={{ color: '#FF6B6B' }}>WAR ROOM</span>
                    </h1>
                    <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
                        {productsCount} ЦЕЛЕЙ VOIS • НОЯБРЬ-ДЕКАБРЬ 2025
                    </p>
                </div>
            </div>

            {/* Right side: filters and stats */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                {/* Month filter */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                    {months.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setFilterMonth(m.id)}
                            className="btn"
                            style={{
                                padding: '6px 12px',
                                background: filterMonth === m.id ? 'rgba(255,107,107,0.2)' : 'transparent',
                                borderRadius: '6px',
                                color: filterMonth === m.id ? '#fff' : 'rgba(255,255,255,0.5)',
                                fontSize: '11px',
                                fontWeight: '600'
                            }}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Выручка VOIS</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B6B' }} className="font-mono">
                        ₽{formatNumber(totalVoisRevenue)}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Бюджет атаки</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#4ECDC4' }} className="font-mono">
                        ₽{formatNumber(totalBudget)}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Атакуем</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFD93D' }} className="font-mono">
                        {activeTargets}/{productsCount}
                    </div>
                </div>

                {/* Logout button */}
                {onLogout && (
                    <button
                        onClick={onLogout}
                        style={{
                            padding: '8px 12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        title="Выйти"
                    >
                        🚪 Выйти
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
