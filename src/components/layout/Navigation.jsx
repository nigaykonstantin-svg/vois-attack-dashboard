const tabs = [
    { id: 'battlefield', label: '🎯 Поле боя' },
    { id: 'arsenal', label: '⚔️ Арсенал' },
    { id: 'economics', label: '💰 Бюджеты' },
    { id: 'intel', label: '🔍 Разведка' },
];

const Navigation = ({ activeTab, setActiveTab }) => {
    return (
        <nav style={{
            display: 'flex',
            gap: '4px',
            padding: '10px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(255,255,255,0.01)'
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="btn"
                    style={{
                        padding: '8px 16px',
                        background: activeTab === tab.id ? 'rgba(255,107,107,0.12)' : 'transparent',
                        border: activeTab === tab.id ? '1px solid rgba(255,107,107,0.25)' : '1px solid transparent',
                        borderRadius: '6px',
                        color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                        fontSize: '12px',
                        fontWeight: '600'
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default Navigation;
