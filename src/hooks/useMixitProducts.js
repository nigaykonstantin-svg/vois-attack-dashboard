// Hook to fetch MIXIT products from Wildberries Statistics API
// Uses orders data to extract product information with prices

import { useState, useEffect, useCallback } from 'react';

const WB_API_TOKEN = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjUwOTA0djEiLCJ0eXAiOiJKV1QifQ.eyJhY2MiOjMsImVudCI6MSwiZXhwIjoxNzgyMTc0NzMwLCJmb3IiOiJzZWxmIiwiaWQiOiIwMTliNDYwYi1iMTU1LTcwZWUtOTQ4ZC1iN2RlMTcxNzQ4NmIiLCJpaWQiOjE4OTc2OTg2OSwib2lkIjo0NTM1NCwicyI6MzYsInNpZCI6IjFkMjEyMmIxLWFjMmItNWYwZC05MjkzLWVhNGU0OGE3NzMyNCIsInQiOmZhbHNlLCJ1aWQiOjE4OTc2OTg2OX0.PTBcXbR50-avPTq-soB2Mhj-y10sGScBteVXnODXpyasHucmrUSGBA-O-FeFwFk7y4YY3nPlnnUuoo-jB51SwQ';

const WB_STATISTICS_API = 'https://statistics-api.wildberries.ru/api/v1/supplier';

export const useMixitProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch orders from last 30 days
            const dateFrom = new Date();
            dateFrom.setDate(dateFrom.getDate() - 30);
            const dateStr = dateFrom.toISOString().split('T')[0];

            const response = await fetch(
                `${WB_STATISTICS_API}/orders?dateFrom=${dateStr}`,
                {
                    headers: {
                        'Authorization': WB_API_TOKEN
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const orders = await response.json();

            // Extract unique products from orders
            const productMap = new Map();

            orders.forEach(order => {
                const nmId = order.nmId;
                if (!productMap.has(nmId)) {
                    productMap.set(nmId, {
                        id: `mixit_${nmId}`,
                        sku: order.supplierArticle,
                        nmId: nmId,
                        barcode: order.barcode,
                        name: `${order.subject} (${order.supplierArticle})`,
                        category: order.subject,
                        brand: order.brand,
                        price: order.totalPrice, // Full price before discounts
                        discountPrice: order.priceWithDisc, // Price with discount
                        finalPrice: order.finishedPrice, // Final price after SPP
                        discountPercent: order.discountPercent,
                        spp: order.spp,
                        orderCount: 1,
                        totalRevenue: order.finishedPrice,
                        wbUrl: `https://www.wildberries.ru/catalog/${nmId}/detail.aspx`
                    });
                } else {
                    const existing = productMap.get(nmId);
                    existing.orderCount++;
                    existing.totalRevenue += order.finishedPrice;
                    // Update price to latest
                    existing.price = order.totalPrice;
                    existing.discountPrice = order.priceWithDisc;
                    existing.finalPrice = order.finishedPrice;
                }
            });

            // Convert to array and sort by order count
            const productList = Array.from(productMap.values())
                .sort((a, b) => b.orderCount - a.orderCount);

            setProducts(productList);
            setLastUpdated(new Date());
            setLoading(false);

            // Cache in localStorage
            localStorage.setItem('mixit_products_cache', JSON.stringify({
                products: productList,
                timestamp: new Date().toISOString()
            }));

            return productList;
        } catch (err) {
            console.error('Error fetching MIXIT products:', err);
            setError(err.message);
            setLoading(false);

            // Try to load from cache
            const cached = localStorage.getItem('mixit_products_cache');
            if (cached) {
                const { products: cachedProducts, timestamp } = JSON.parse(cached);
                setProducts(cachedProducts);
                setLastUpdated(new Date(timestamp));
            }

            return [];
        }
    };

    // Load from cache on mount, then fetch fresh data
    useEffect(() => {
        const cached = localStorage.getItem('mixit_products_cache');
        if (cached) {
            const { products: cachedProducts, timestamp } = JSON.parse(cached);
            setProducts(cachedProducts);
            setLastUpdated(new Date(timestamp));
            setLoading(false);
        }

        // Always fetch fresh data
        fetchOrders();
    }, []);

    const refetch = useCallback(() => {
        return fetchOrders();
    }, []);

    // Get products by category
    const getByCategory = useCallback((category) => {
        return products.filter(p =>
            p.category.toLowerCase().includes(category.toLowerCase())
        );
    }, [products]);

    // Search products
    const search = useCallback((query) => {
        const q = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
    }, [products]);

    return {
        products,
        loading,
        error,
        lastUpdated,
        refetch,
        getByCategory,
        search,
        totalProducts: products.length
    };
};
