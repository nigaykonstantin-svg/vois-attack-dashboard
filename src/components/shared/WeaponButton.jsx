const WeaponButton = ({ weapon, isActive, onClick }) => {
    return (
        <button
            className="btn"
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                background: isActive ? `${weapon.color}18` : 'rgba(255,255,255,0.02)',
                border: isActive ? `1px solid ${weapon.color}` : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '6px',
                color: '#fff',
                textAlign: 'left'
            }}
        >
            <span style={{ fontSize: '16px' }}>{weapon.icon}</span>
            <span style={{ flex: 1, fontSize: '11px', fontWeight: '500' }}>{weapon.name}</span>
            {isActive && <span style={{ color: '#4ECDC4', fontSize: '14px' }}>✓</span>}
        </button>
    );
};

export default WeaponButton;
