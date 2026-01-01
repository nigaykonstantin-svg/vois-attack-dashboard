import { useState } from 'react';
import { formatNumber } from '../../utils/formatters';

const ArsenalTab = ({
    weapons,
    getWeaponUsageCount,
    addWeapon,
    updateWeapon,
    deleteWeapon,
    teamMembers,
    weaponResponsibles,
    setWeaponResponsible,
    getWeaponResponsible
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingWeapon, setEditingWeapon] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    // Form state for add/edit
    const [formData, setFormData] = useState({
        name: '',
        icon: '🔧',
        color: '#FF6B6B',
        costMin: 50000,
        costMax: 200000,
        impact: 'medium'
    });

    const impactOptions = [
        { value: 'critical', label: 'CRITICAL', color: '#FF4757' },
        { value: 'high', label: 'HIGH', color: '#FFA502' },
        { value: 'medium', label: 'MEDIUM', color: '#2ED573' },
        { value: 'low', label: 'LOW', color: '#747D8C' },
        { value: 'variable', label: 'VARIABLE', color: '#9B59B6' },
    ];

    const iconOptions = ['🔧', '📊', '📈', '🎯', '💡', '🚀', '⚡', '🔥', '💎', '🎪', '📱', '💻', '🎨', '📣', '📢', '🎬', '📸', '✍️', '👥', '⭐', '👑', '🔍', '🔄'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingWeapon) {
            updateWeapon(editingWeapon.id, formData);
        } else {
            addWeapon(formData);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            icon: '🔧',
            color: '#FF6B6B',
            costMin: 50000,
            costMax: 200000,
            impact: 'medium'
        });
        setShowAddModal(false);
        setEditingWeapon(null);
    };

    const handleEdit = (weapon) => {
        if (!weapon.isCustom) return; // Can only edit custom weapons
        setFormData({
            name: weapon.name,
            icon: weapon.icon,
            color: weapon.color,
            costMin: weapon.costMin,
            costMax: weapon.costMax,
            impact: weapon.impact
        });
        setEditingWeapon(weapon);
        setShowAddModal(true);
    };

    const handleDelete = (weaponId) => {
        if (confirm('Удалить это оружие из арсенала?')) {
            deleteWeapon(weaponId);
        }
    };

    const getImpactColor = (impact) => {
        const option = impactOptions.find(o => o.value === impact);
        return option ? option.color : '#747D8C';
    };

    return (
        <div className="animate-slide-up">
            {/* Header with actions */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <h2 style={{ margin: 0, fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>
                    Арсенал маркетинговых инструментов ({weapons.length})
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        style={{
                            padding: '8px 16px',
                            background: showSettings ? 'rgba(78,205,196,0.2)' : 'rgba(255,255,255,0.05)',
                            border: showSettings ? '1px solid rgba(78,205,196,0.4)' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: showSettings ? '#4ECDC4' : 'rgba(255,255,255,0.7)',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        ⚙️ Ответственные
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        ➕ Добавить оружие
                    </button>
                </div>
            </div>

            {/* Settings Panel - Responsible assignment */}
            {showSettings && (
                <div style={{
                    background: 'rgba(78,205,196,0.05)',
                    border: '1px solid rgba(78,205,196,0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#4ECDC4' }}>
                        👤 Назначение ответственных
                    </h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                        Выберите ответственного для каждого инструмента. Изменения сохраняются автоматически.
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '10px'
                    }}>
                        {weapons.map(weapon => {
                            const responsible = getWeaponResponsible(weapon.id);
                            return (
                                <div key={weapon.id} style={{
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <span style={{ fontSize: '20px' }}>{weapon.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                                            {weapon.name}
                                        </div>
                                        <select
                                            value={weaponResponsibles[weapon.id] || ''}
                                            onChange={(e) => setWeaponResponsible(weapon.id, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '6px 8px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '11px'
                                            }}
                                        >
                                            <option value="">— Не назначен —</option>
                                            {teamMembers.map(member => (
                                                <option key={member.id} value={member.id}>
                                                    {member.name} ({member.role})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Weapons Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                {weapons.map(weapon => {
                    const usedCount = getWeaponUsageCount(weapon.id);
                    const responsible = getWeaponResponsible(weapon.id);

                    return (
                        <div key={weapon.id} style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            padding: '16px',
                            borderTop: `3px solid ${weapon.color}`,
                            position: 'relative'
                        }}>
                            {/* Custom badge & actions */}
                            {weapon.isCustom && (
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    display: 'flex',
                                    gap: '4px'
                                }}>
                                    <button
                                        onClick={() => handleEdit(weapon)}
                                        style={{
                                            padding: '4px 8px',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: 'rgba(255,255,255,0.6)',
                                            fontSize: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(weapon.id)}
                                        style={{
                                            padding: '4px 8px',
                                            background: 'rgba(255,71,87,0.2)',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#FF4757',
                                            fontSize: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <span style={{ fontSize: '24px' }}>{weapon.icon}</span>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{weapon.name}</h3>
                                    <span style={{
                                        fontSize: '9px', padding: '2px 6px',
                                        background: getImpactColor(weapon.impact),
                                        borderRadius: '4px'
                                    }}>
                                        {weapon.impact.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Responsible person */}
                            {responsible && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginBottom: '10px',
                                    padding: '6px 10px',
                                    background: 'rgba(78,205,196,0.1)',
                                    borderRadius: '6px',
                                    fontSize: '11px'
                                }}>
                                    <span style={{ color: '#4ECDC4' }}>👤</span>
                                    <span style={{ color: '#4ECDC4', fontWeight: '600' }}>{responsible.name}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>({responsible.role})</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>₽{formatNumber(weapon.costMin)} – {formatNumber(weapon.costMax)}</span>
                                <span style={{ color: '#4ECDC4' }}>{usedCount} целей</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '16px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '450px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
                            {editingWeapon ? '✏️ Редактировать оружие' : '➕ Новое оружие'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* Name */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                                    Название
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Например: TikTok реклама"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            {/* Icon & Color */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                                        Иконка
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '4px',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        maxHeight: '80px',
                                        overflowY: 'auto'
                                    }}>
                                        {iconOptions.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon })}
                                                style={{
                                                    padding: '4px 6px',
                                                    background: formData.icon === icon ? 'rgba(255,107,107,0.3)' : 'transparent',
                                                    border: formData.icon === icon ? '1px solid #FF6B6B' : '1px solid transparent',
                                                    borderRadius: '4px',
                                                    fontSize: '16px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                                        Цвет
                                    </label>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Cost range */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                                        Мин. стоимость (₽)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.costMin}
                                        onChange={(e) => setFormData({ ...formData, costMin: parseInt(e.target.value) || 0 })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                                        Макс. стоимость (₽)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.costMax}
                                        onChange={(e) => setFormData({ ...formData, costMax: parseInt(e.target.value) || 0 })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Impact */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                                    Уровень влияния
                                </label>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {impactOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, impact: opt.value })}
                                            style={{
                                                padding: '6px 12px',
                                                background: formData.impact === opt.value ? opt.color : 'rgba(255,255,255,0.05)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                opacity: formData.impact === opt.value ? 1 : 0.6
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '13px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 24px',
                                        background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingWeapon ? 'Сохранить' : 'Добавить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArsenalTab;
