import { useState, useRef } from 'react';
import { formatNumber, formatReviews } from '../../utils/formatters';

const ProductDossier = ({
    product,
    mixitProducts,
    dossier,
    onClose,
    onLinkMixit,
    onAddScreenshot,
    onDeleteScreenshot,
    onAddNote,
    onUpdateNote,
    onDeleteNote,
    onExport
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [noteText, setNoteText] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editNoteText, setEditNoteText] = useState('');
    const [screenshotCaption, setScreenshotCaption] = useState('');
    const fileInputRef = useRef(null);

    const linkedMixit = dossier.mixitId
        ? mixitProducts.find(m => m.id === dossier.mixitId)
        : null;

    const tabs = [
        { id: 'overview', label: '📋 Обзор', icon: '📋' },
        { id: 'screenshots', label: '📸 Скриншоты', icon: '📸', count: dossier.screenshots?.length || 0 },
        { id: 'notes', label: '📝 Заметки', icon: '📝', count: dossier.notes?.length || 0 },
        { id: 'battlecard', label: '⚔️ Battle Card', icon: '⚔️' },
    ];

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            onAddScreenshot(event.target.result, screenshotCaption);
            setScreenshotCaption('');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onAddScreenshot(event.target.result, '');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddNote = () => {
        if (noteText.trim()) {
            onAddNote(noteText.trim());
            setNoteText('');
        }
    };

    const handleSaveNote = (noteId) => {
        if (editNoteText.trim()) {
            onUpdateNote(noteId, editNoteText.trim());
            setEditingNoteId(null);
            setEditNoteText('');
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                background: '#1a1a2e',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                }}>
                    <div>
                        <div style={{ fontSize: '10px', color: '#FF6B6B', fontWeight: '600', marginBottom: '4px' }}>
                            📁 ДОСЬЕ ТОВАРА
                        </div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{product.name}</h2>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            <span>SKU: {product.sku}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                            <span>•</span>
                            <span style={{ color: '#FFD93D' }}>★ {product.rating}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={onExport}
                            style={{
                                padding: '8px 12px',
                                background: 'rgba(78,205,196,0.15)',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#4ECDC4',
                                fontSize: '11px',
                                cursor: 'pointer'
                            }}
                        >
                            📥 Экспорт
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '4px',
                    padding: '12px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: 'rgba(255,255,255,0.01)'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '8px 16px',
                                background: activeTab === tab.id ? 'rgba(255,107,107,0.12)' : 'transparent',
                                border: activeTab === tab.id ? '1px solid rgba(255,107,107,0.25)' : '1px solid transparent',
                                borderRadius: '6px',
                                color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span style={{
                                    background: 'rgba(255,107,107,0.3)',
                                    padding: '2px 6px',
                                    borderRadius: '10px',
                                    fontSize: '10px'
                                }}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* Link MIXIT Product */}
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '10px',
                                padding: '16px',
                                marginBottom: '16px'
                            }}>
                                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
                                    🎯 Наш товар-конкурент (MIXIT)
                                </label>
                                <select
                                    value={dossier.mixitId || ''}
                                    onChange={(e) => onLinkMixit(e.target.value || null)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="">— Выберите товар MIXIT —</option>
                                    {mixitProducts
                                        .filter(m => m.category === product.category)
                                        .map(m => (
                                            <option key={m.id} value={m.id}>{m.name} (₽{m.price})</option>
                                        ))
                                    }
                                    <optgroup label="Другие категории">
                                        {mixitProducts
                                            .filter(m => m.category !== product.category)
                                            .map(m => (
                                                <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
                                            ))
                                        }
                                    </optgroup>
                                </select>
                            </div>

                            {/* Quick Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                <div style={{ background: 'rgba(255,107,107,0.1)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>ЦЕНА VOIS</div>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B6B' }}>₽{product.price}</div>
                                </div>
                                <div style={{ background: 'rgba(78,205,196,0.1)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>ЦЕНА MIXIT</div>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#4ECDC4' }}>
                                        {linkedMixit ? `₽${linkedMixit.discountPrice || linkedMixit.price || '—'}` : '—'}
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(255,215,61,0.1)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>ОТЗЫВЫ VOIS</div>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFD93D' }}>{formatReviews(product.reviews)}</div>
                                </div>
                                <div style={{ background: 'rgba(139,92,246,0.1)', borderRadius: '8px', padding: '14px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>ЗАКАЗЫ MIXIT</div>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#8b5cf6' }}>
                                        {linkedMixit ? (linkedMixit.orderCount || linkedMixit.reviews ? formatNumber(linkedMixit.orderCount || linkedMixit.reviews) : '—') : '—'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCREENSHOTS TAB */}
                    {activeTab === 'screenshots' && (
                        <div>
                            {/* Upload Zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: '2px dashed rgba(255,107,107,0.3)',
                                    borderRadius: '12px',
                                    padding: '30px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '20px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                    Перетащите изображение или кликните для загрузки
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Gallery */}
                            {dossier.screenshots?.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                    {dossier.screenshots.map(ss => (
                                        <div key={ss.id} style={{
                                            position: 'relative',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            background: 'rgba(0,0,0,0.3)'
                                        }}>
                                            <img
                                                src={ss.data}
                                                alt={ss.caption || 'Screenshot'}
                                                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                            />
                                            <button
                                                onClick={() => onDeleteScreenshot(ss.id)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: 'rgba(255,71,87,0.9)',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    color: '#fff',
                                                    padding: '4px 8px',
                                                    fontSize: '10px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                🗑️
                                            </button>
                                            <div style={{ padding: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
                                                {formatDate(ss.date)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                                    Нет загруженных скриншотов
                                </div>
                            )}
                        </div>
                    )}

                    {/* NOTES TAB */}
                    {activeTab === 'notes' && (
                        <div>
                            {/* Add Note */}
                            <div style={{ marginBottom: '20px' }}>
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Добавить заметку, комментарий или поправку..."
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '13px',
                                        resize: 'vertical',
                                        minHeight: '80px'
                                    }}
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={!noteText.trim()}
                                    style={{
                                        marginTop: '8px',
                                        padding: '10px 20px',
                                        background: noteText.trim() ? 'linear-gradient(135deg, #FF6B6B, #FF8E53)' : 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: noteText.trim() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    ➕ Добавить заметку
                                </button>
                            </div>

                            {/* Notes List */}
                            {dossier.notes?.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {dossier.notes.slice().reverse().map(note => (
                                        <div key={note.id} style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '8px',
                                            padding: '14px'
                                        }}>
                                            {editingNoteId === note.id ? (
                                                <div>
                                                    <textarea
                                                        value={editNoteText}
                                                        onChange={(e) => setEditNoteText(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px',
                                                            background: 'rgba(0,0,0,0.3)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            borderRadius: '6px',
                                                            color: '#fff',
                                                            fontSize: '13px',
                                                            minHeight: '60px'
                                                        }}
                                                    />
                                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                        <button onClick={() => handleSaveNote(note.id)} style={{ padding: '6px 12px', background: '#2ED573', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '11px', cursor: 'pointer' }}>
                                                            ✓ Сохранить
                                                        </button>
                                                        <button onClick={() => setEditingNoteId(null)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'rgba(255,255,255,0.6)', fontSize: '11px', cursor: 'pointer' }}>
                                                            ✕ Отмена
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                                        {note.text}
                                                    </p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                                                            {note.author} • {formatDate(note.date)}
                                                            {note.updatedAt && ' (изменено)'}
                                                        </span>
                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                            <button
                                                                onClick={() => { setEditingNoteId(note.id); setEditNoteText(note.text); }}
                                                                style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'rgba(255,255,255,0.5)', fontSize: '10px', cursor: 'pointer' }}
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                onClick={() => onDeleteNote(note.id)}
                                                                style={{ padding: '4px 8px', background: 'rgba(255,71,87,0.2)', border: 'none', borderRadius: '4px', color: '#FF4757', fontSize: '10px', cursor: 'pointer' }}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                                    Нет заметок
                                </div>
                            )}
                        </div>
                    )}

                    {/* BATTLE CARD TAB */}
                    {activeTab === 'battlecard' && (
                        <div>
                            {linkedMixit ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '16px' }}>
                                    {/* VOIS Column */}
                                    <div style={{
                                        background: 'rgba(255,107,107,0.08)',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        border: '1px solid rgba(255,107,107,0.2)'
                                    }}>
                                        <div style={{ fontSize: '12px', color: '#FF6B6B', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
                                            VOIS
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', textAlign: 'center', marginBottom: '16px' }}>
                                            {product.name}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Цена</span>
                                                <span style={{ fontWeight: '600' }}>₽{product.price}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Рейтинг</span>
                                                <span style={{ fontWeight: '600', color: '#FFD93D' }}>★ {product.rating}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Отзывы</span>
                                                <span style={{ fontWeight: '600' }}>{formatReviews(product.reviews)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Позиция</span>
                                                <span style={{ fontWeight: '600' }}>#{product.avgPosition}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Выкуп</span>
                                                <span style={{ fontWeight: '600' }}>{(product.buyoutRate * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* VS */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            fontWeight: '700'
                                        }}>
                                            VS
                                        </div>
                                    </div>

                                    {/* MIXIT Column */}
                                    <div style={{
                                        background: 'rgba(78,205,196,0.08)',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        border: '1px solid rgba(78,205,196,0.2)'
                                    }}>
                                        <div style={{ fontSize: '12px', color: '#4ECDC4', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
                                            MIXIT
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', textAlign: 'center', marginBottom: '16px' }}>
                                            {linkedMixit.name}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Цена</span>
                                                <span style={{ fontWeight: '600', color: (linkedMixit.discountPrice || linkedMixit.price) < product.price ? '#2ED573' : '#FF4757' }}>
                                                    ₽{linkedMixit.discountPrice || linkedMixit.price}
                                                    <span style={{ fontSize: '10px', marginLeft: '4px' }}>
                                                        ({(linkedMixit.discountPrice || linkedMixit.price) < product.price ? '-' : '+'}{Math.abs((linkedMixit.discountPrice || linkedMixit.price) - product.price)}₽)
                                                    </span>
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Рейтинг</span>
                                                <span style={{ fontWeight: '600', color: '#FFD93D' }}>★ {linkedMixit.rating || '—'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Заказы (30д)</span>
                                                <span style={{ fontWeight: '600', color: '#8b5cf6' }}>
                                                    {linkedMixit.orderCount ? formatNumber(linkedMixit.orderCount) : (linkedMixit.reviews ? formatReviews(linkedMixit.reviews) : '—')}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Выручка (30д)</span>
                                                <span style={{ fontWeight: '600', color: '#4ECDC4' }}>
                                                    {linkedMixit.totalRevenue ? `₽${formatNumber(linkedMixit.totalRevenue)}` : '—'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Скидка WB</span>
                                                <span style={{ fontWeight: '600' }}>{linkedMixit.discountPercent ? `${linkedMixit.discountPercent}%` : '—'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚔️</div>
                                    <p>Выберите товар MIXIT во вкладке "Обзор" для сравнения</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDossier;
