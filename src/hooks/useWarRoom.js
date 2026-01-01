import { useState, useMemo } from 'react';
import { voisProducts } from '../data/voisProducts';
import { weapons } from '../data/weapons';

export const useWarRoom = () => {
    // UI State
    const [activeTab, setActiveTab] = useState('battlefield');
    const [selectedTarget, setSelectedTarget] = useState(null);

    // Attack assignments
    const [weaponAssignments, setWeaponAssignments] = useState({});
    const [budgets, setBudgets] = useState({});

    // Filters
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const [sortBy, setSortBy] = useState('revenue');

    // Derived: categories list
    const categories = useMemo(() =>
        ['all', ...new Set(voisProducts.map(p => p.category))],
        []
    );

    // Get product data based on month filter
    const getProductData = (product) => {
        if (filterMonth === 'november') {
            return { orders: product.novemberOrders, revenue: product.novemberRevenue };
        } else if (filterMonth === 'december') {
            return { orders: product.decemberOrders, revenue: product.decemberRevenue };
        }
        return {
            orders: product.novemberOrders + product.decemberOrders,
            revenue: product.novemberRevenue + product.decemberRevenue
        };
    };

    // Calculate month-over-month growth
    const getGrowth = (product) => {
        if (product.novemberRevenue === 0) return 0;
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

        // Computed
        totalBudget,
        activeTargets,
        totalVoisRevenue,

        // Helpers
        getProductData,
        getGrowth,
    };
};
