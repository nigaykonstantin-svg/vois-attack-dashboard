import { formatNumber, formatReviews, getPriorityColor } from '../../utils/formatters';
import ConversionFunnel from './ConversionFunnel';

const ProductCard = ({
    product,
    data,
    growth,
    assignedWeapons,
    weapons,
    isSelected,
    onClick,
    budget,
    onOpenDossier
}) => {
    return (
        <div
            className="card"
            onClick={onClick}
            style={{
                background: isSelected
                    ? 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,107,107,0.03))'
                    : 'rgba(255,255,255,0.02)',
                border: isSelected
                    ? '1px solid rgba(255,107,107,0.35)'
                    : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '10px',
                padding: '14px',
                position: 'relative'
            }}
        >
            {/* Priority badge + Dossier button */}
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                {onOpenDossier && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onOpenDossier(product.id); }}
                        style={{
                            padding: '3px 6px',
                            background: 'rgba(102,126,234,0.2)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#667eea',
                            fontSize: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                        }}
                        title="Открыть досье"
                    >
                        📁
                    </button>
                )}
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getPriorityColor(product.priority),
                    boxShadow: `0 0 8px ${getPriorityColor(product.priority)}`
                }} />
            </div>

            {/* Header */}
            <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <a
                        href={product.wbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: '10px', color: '#4ECDC4' }}
                        className="font-mono"
                    >
                        {product.sku}
                    </a>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>•</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>#{product.avgPosition}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '600', lineHeight: '1.3', paddingRight: '20px' }}>
                    {product.name}
                </h3>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                    {product.category}
                </div>
            </div>

            {/* Rating & Reviews */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                fontSize: '11px'
            }}>
                <span style={{ color: '#FFD93D' }}>★ {product.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {formatReviews(product.reviews)} отзывов
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>₽{product.price}</span>
            </div>

            {/* Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '6px',
                padding: '10px',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: '8px',
                marginBottom: '10px'
            }}>
                <div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>ВЫРУЧКА</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#FF6B6B' }} className="font-mono">
                        ₽{formatNumber(data.revenue)}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>ЗАКАЗОВ</div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }} className="font-mono">
                        {formatNumber(data.orders)}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>РОСТ</div>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: growth > 0 ? '#2ED573' : '#FF4757'
                    }} className="font-mono">
                        {growth > 0 ? '+' : ''}{growth}%
                    </div>
                </div>
            </div>

            {/* Conversion Funnel (compact) */}
            <ConversionFunnel product={product} compact={true} />

            {/* Our product */}
            <div style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.45)',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span>→ {product.ourProduct}</span>
                <span style={{ color: `${product.buyoutRate >= 0.95 ? '#2ED573' : product.buyoutRate >= 0.90 ? '#FFA502' : '#FF4757'}` }}>
                    {(product.buyoutRate * 100).toFixed(0)}% выкуп
                </span>
            </div>

            {/* Assigned weapons */}
            {assignedWeapons.length > 0 && (
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {assignedWeapons.map(wId => {
                        const w = weapons.find(x => x.id === wId);
                        return <span key={wId} style={{ fontSize: '12px' }}>{w?.icon}</span>;
                    })}
                    {budget && (
                        <span style={{
                            padding: '2px 6px',
                            background: 'rgba(78,205,196,0.15)',
                            borderRadius: '4px',
                            fontSize: '9px',
                            color: '#4ECDC4'
                        }} className="font-mono">
                            ₽{formatNumber(parseInt(budget))}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductCard;
