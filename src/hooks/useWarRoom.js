import { useState, useMemo, useEffect } from 'react';
import { voisProducts } from '../data/voisProducts';
import { weapons as defaultWeapons } from '../data/weapons';

// Default team members
const DEFAULT_TEAM = [
    { id: 'konstantin', name: 'Константин', role: 'Руководитель' },
    { id: 'maria', name: 'Мария', role: 'Маркетолог' },
    { id: 'alexey', name: 'Алексей', role: 'Аналитик' },
    { id: 'elena', name: 'Елена', role: 'SMM' },
];

// Load from localStorage or use defaults
const loadFromStorage = (key, defaultValue) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch {
        return defaultValue;
    }
};

export const useWarRoom = () => {
    // UI State
    const [activeTab, setActiveTab] = useState('battlefield');
    const [selectedTarget, setSelectedTarget] = useState(null);

    // Team members (can be customized)
    const [teamMembers, setTeamMembers] = useState(() =>
        loadFromStorage('warroom_team', DEFAULT_TEAM)
    );

    // Custom weapons (merged with default)
    const [customWeapons, setCustomWeapons] = useState(() =>
        loadFromStorage('warroom_custom_weapons', [])
    );

    // Weapon -> Responsible person mapping
    const [weaponResponsibles, setWeaponResponsibles] = useState(() =>
        loadFromStorage('warroom_responsibles', {})
    );

    // Attack assignments
    const [weaponAssignments, setWeaponAssignments] = useState({});
    const [budgets, setBudgets] = useState({});

    // Filters
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const [sortBy, setSortBy] = useState('revenue');

    // Combine default + custom weapons
    const weapons = useMemo(() => {
        return [...defaultWeapons, ...customWeapons];
    }, [customWeapons]);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('warroom_team', JSON.stringify(teamMembers));
    }, [teamMembers]);

    useEffect(() => {
        localStorage.setItem('warroom_custom_weapons', JSON.stringify(customWeapons));
    }, [customWeapons]);

    useEffect(() => {
        localStorage.setItem('warroom_responsibles', JSON.stringify(weaponResponsibles));
    }, [weaponResponsibles]);

    // Derived: categories list
    const categories = useMemo(() =>
        ['all', ...new Set(voisProducts.map(p => p.category))],
        []
    );

    // Get product data based on month filter
    const getProductData = (product) => {
        if (!product) return { orders: 0, revenue: 0 };
        if (filterMonth === 'november') {
            return { orders: product.novemberOrders || 0, revenue: product.novemberRevenue || 0 };
        } else if (filterMonth === 'december') {
            return { orders: product.decemberOrders || 0, revenue: product.decemberRevenue || 0 };
        }
        return {
            orders: (product.novemberOrders || 0) + (product.decemberOrders || 0),
            revenue: (product.novemberRevenue || 0) + (product.decemberRevenue || 0)
        };
    };

    // Calculate month-over-month growth
    const getGrowth = (product) => {
        if (!product || !product.novemberRevenue || product.novemberRevenue === 0) return 0;
        return ((product.decemberRevenue - product.novemberRevenue) / product.novemberRevenue * 100).toFixed(0);
    };

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        let products = filterCategory === 'all'
            ? voisProducts
            : voisProducts.filter(p => p.category === filterCategory);

        return [...products].sort((a, b) => {
            const aData = getProductData(a);
            const bData = getProductData(b);
            if (sortBy === 'revenue') return bData.revenue - aData.revenue;
            if (sortBy === 'orders') return bData.orders - aData.orders;
            if (sortBy === 'position') return a.avgPosition - b.avgPosition;
            if (sortBy === 'reviews') return b.reviews - a.reviews;
            return 0;
        });
    }, [filterCategory, sortBy, filterMonth]);

    // Weapon assignment actions
    const toggleWeapon = (targetId, weaponId) => {
        setWeaponAssignments(prev => {
            const current = prev[targetId] || [];
            if (current.includes(weaponId)) {
                return { ...prev, [targetId]: current.filter(w => w !== weaponId) };
            }
            return { ...prev, [targetId]: [...current, weaponId] };
        });
    };

    const getTargetWeapons = (targetId) => weaponAssignments[targetId] || [];

    // Budget update
    const updateBudget = (targetId, value) => {
        setBudgets(prev => ({ ...prev, [targetId]: value }));
    };

    // === WEAPON MANAGEMENT ===
    const addWeapon = (weapon) => {
        const newWeapon = {
            ...weapon,
            id: weapon.id || `custom_${Date.now()}`,
            isCustom: true
        };
        setCustomWeapons(prev => [...prev, newWeapon]);
        return newWeapon;
    };

    const updateWeapon = (weaponId, updates) => {
        setCustomWeapons(prev =>
            prev.map(w => w.id === weaponId ? { ...w, ...updates } : w)
        );
    };

    const deleteWeapon = (weaponId) => {
        setCustomWeapons(prev => prev.filter(w => w.id !== weaponId));
        // Also remove from responsibles
        setWeaponResponsibles(prev => {
            const { [weaponId]: _, ...rest } = prev;
            return rest;
        });
    };

    // === RESPONSIBLE MANAGEMENT ===
    const setWeaponResponsible = (weaponId, memberId) => {
        setWeaponResponsibles(prev => ({
            ...prev,
            [weaponId]: memberId
        }));
    };

    const getWeaponResponsible = (weaponId) => {
        const memberId = weaponResponsibles[weaponId];
        return teamMembers.find(m => m.id === memberId) || null;
    };

    // === TEAM MANAGEMENT ===
    const addTeamMember = (member) => {
        const newMember = {
            ...member,
            id: member.id || `member_${Date.now()}`
        };
        setTeamMembers(prev => [...prev, newMember]);
        return newMember;
    };

    const updateTeamMember = (memberId, updates) => {
        setTeamMembers(prev =>
            prev.map(m => m.id === memberId ? { ...m, ...updates } : m)
        );
    };

    const deleteTeamMember = (memberId) => {
        setTeamMembers(prev => prev.filter(m => m.id !== memberId));
        // Remove from responsibles
        setWeaponResponsibles(prev => {
            const updated = {};
            for (const [weaponId, responsible] of Object.entries(prev)) {
                if (responsible !== memberId) {
                    updated[weaponId] = responsible;
                }
            }
            return updated;
        });
    };

    // Computed metrics
    const totalBudget = Object.values(budgets).reduce((a, b) => a + (parseInt(b) || 0), 0);

    const activeTargets = Object.keys(weaponAssignments).filter(
        k => weaponAssignments[k]?.length > 0
    ).length;

    const totalVoisRevenue = useMemo(() => {
        return filteredProducts.reduce((sum, p) => sum + getProductData(p).revenue, 0);
    }, [filteredProducts, filterMonth]);

    // Get weapon usage count
    const getWeaponUsageCount = (weaponId) => {
        return Object.values(weaponAssignments).filter(ws => ws.includes(weaponId)).length;
    };

    return {
        // Data
        voisProducts,
        weapons,
        filteredProducts,
        categories,
        teamMembers,

        // UI State
        activeTab,
        setActiveTab,
        selectedTarget,
        setSelectedTarget,

        // Filters
        filterCategory,
        setFilterCategory,
        filterMonth,
        setFilterMonth,
        sortBy,
        setSortBy,

        // Assignments
        weaponAssignments,
        budgets,
        toggleWeapon,
        getTargetWeapons,
        updateBudget,
        getWeaponUsageCount,

        // Weapon Management
        addWeapon,
        updateWeapon,
        deleteWeapon,

        // Responsible Management
        weaponResponsibles,
        setWeaponResponsible,
        getWeaponResponsible,

        // Team Management
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,

        // Computed
        totalBudget,
        activeTargets,
        totalVoisRevenue,

        // Helpers
        getProductData,
        getGrowth,
    };
};
