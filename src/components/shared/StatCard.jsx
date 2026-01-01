const StatCard = ({ label, value, color }) => {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '10px',
            padding: '14px'
        }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color }} className="font-mono">{value}</div>
        </div>
    );
};

export default StatCard;
