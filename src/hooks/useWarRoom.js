import { useState, useMemo, useEffect } from 'react';
import { voisProducts as staticVoisProducts } from '../data/voisProducts';
import { weapons as defaultWeapons } from '../data/weapons';
import { useMixitProducts } from './useMixitProducts';
import { useGoogleSheets } from './useGoogleSheets';
import { mixitProducts as staticMixitProducts } from '../data/mixitProducts';

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
    // Fetch VOIS products from Google Sheets
    const {
        products: sheetProducts,
        loading,
        error,
        lastUpdated,
        refetch
    } = useGoogleSheets();

    // Use Google Sheets data enriched with static fallbacks for reviews/rating
    const voisProducts = useMemo(() => {
        if (sheetProducts.length > 0) {
            // Merge with static data to get reviews/rating that may be missing in Google Sheets
            return sheetProducts.map(sheetProduct => {
                // Find matching static product by SKU
                const staticProduct = staticVoisProducts.find(
                    sp => sp.sku === sheetProduct.sku || sp.sku === String(sheetProduct.sku)
                );

                // If sheet product has no reviews/rating, use static data
                return {
                    ...sheetProduct,
                    reviews: sheetProduct.reviews > 0 ? sheetProduct.reviews : (staticProduct?.reviews || 0),
                    rating: sheetProduct.rating > 0 ? sheetProduct.rating : (staticProduct?.rating || 4.8),
                    ourProduct: staticProduct?.ourProduct || null,
                    ourSku: staticProduct?.ourSku || null,
                    // Keep decemberViews from static if missing in sheet
                    decemberViews: sheetProduct.decemberViews || staticProduct?.decemberViews || 0,
                };
            });
        }
        return staticVoisProducts;
    }, [sheetProducts]);

    // Fetch live MIXIT products from WB API
    const {
        products: liveMixitProducts,
        loading: mixitLoading,
        error: mixitError,
        refetch: refetchMixit
    } = useMixitProducts();

    // Merge live MIXIT products with static fallback
    const mixitProducts = useMemo(() => {
        if (liveMixitProducts.length > 0) {
            return liveMixitProducts;
        }
        return staticMixitProducts;
    }, [liveMixitProducts]);

    // UI State
    const [activeTab, setActiveTab] = useState('battlefield');
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [dossierProductId, setDossierProductId] = useState(null); // For dossier modal

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

    // Product Dossiers: { productId: { mixitId, screenshots: [], notes: [] } }
    const [productDossiers, setProductDossiers] = useState(() =>
        loadFromStorage('warroom_dossiers', {})
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
    }, [filterCategory, sortBy, filterMonth, voisProducts]);

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

    // === PRODUCT DOSSIER MANAGEMENT ===

    // Persist dossiers to localStorage
    useEffect(() => {
        localStorage.setItem('warroom_dossiers', JSON.stringify(productDossiers));
    }, [productDossiers]);

    // Get dossier for a product
    const getDossier = (productId) => {
        return productDossiers[productId] || { mixitId: null, screenshots: [], notes: [] };
    };

    // Link MIXIT product to VOIS product
    const linkMixitProduct = (productId, mixitId) => {
        setProductDossiers(prev => ({
            ...prev,
            [productId]: {
                ...getDossier(productId),
                mixitId
            }
        }));
    };

    // Get linked MIXIT product
    const getLinkedMixitProduct = (productId) => {
        const dossier = getDossier(productId);
        return dossier.mixitId ? mixitProducts.find(m => m.id === dossier.mixitId) : null;
    };

    // Add screenshot to dossier
    const addScreenshot = (productId, imageData, caption = '') => {
        const newScreenshot = {
            id: `ss_${Date.now()}`,
            data: imageData,
            caption,
            date: new Date().toISOString()
        };
        setProductDossiers(prev => ({
            ...prev,
            [productId]: {
                ...getDossier(productId),
                screenshots: [...(getDossier(productId).screenshots || []), newScreenshot]
            }
        }));
        return newScreenshot;
    };

    // Delete screenshot
    const deleteScreenshot = (productId, screenshotId) => {
        setProductDossiers(prev => ({
            ...prev,
            [productId]: {
                ...getDossier(productId),
                screenshots: getDossier(productId).screenshots.filter(s => s.id !== screenshotId)
            }
        }));
    };

    // Add note to dossier
    const addNote = (productId, text, author = 'admin') => {
        const newNote = {
            id: `note_${Date.now()}`,
            text,
            author,
            date: new Date().toISOString()
        };
        setProductDossiers(prev => ({
            ...prev,
            [productId]: {
                ...getDossier(productId),
                notes: [...(getDossier(productId).notes || []), newNote]
            }
        }));
        return newNote;
    };

    // Update note
    const updateNote = (productId, noteId, newText) => {
        setProductDossiers(prev => ({
            ...prev,
            [productId]: {
                ...getDossier(productId),
                notes: getDossier(productId).notes.map(n =>
                    n.id === noteId ? { ...n, text: newText, updatedAt: new Date().toISOString() } : n
                )
            }
        }));
    };

    // Delete note
    const deleteNote = (productId, noteId) => {
        setProductDossiers(prev => ({
            ...prev,
            [productId]: {
                ...getDossier(productId),
                notes: getDossier(productId).notes.filter(n => n.id !== noteId)
            }
        }));
    };

    // Export dossiers as JSON
    const exportDossiers = () => {
        const dataStr = JSON.stringify(productDossiers, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warroom_dossiers_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Import dossiers from JSON
    const importDossiers = (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            setProductDossiers(data);
            return true;
        } catch {
            return false;
        }
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
        mixitProducts,

        // UI State
        activeTab,
        setActiveTab,
        selectedTarget,
        setSelectedTarget,
        dossierProductId,
        setDossierProductId,

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

        // Dossier Management
        productDossiers,
        getDossier,
        linkMixitProduct,
        getLinkedMixitProduct,
        addScreenshot,
        deleteScreenshot,
        addNote,
        updateNote,
        deleteNote,
        exportDossiers,
        importDossiers,

        // Computed
        totalBudget,
        activeTargets,
        totalVoisRevenue,

        // MIXIT Live Data
        mixitLoading,
        mixitError,
        refetchMixit,

        // Helpers
        getProductData,
        getGrowth,
    };
};
