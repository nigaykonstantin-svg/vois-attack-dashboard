// Hook to fetch data from Google Sheets
// Specifically fetches from the third sheet (gid=304318457)

import { useState, useEffect } from 'react';

const SHEET_ID = '1yBp4xrjVmvJE9ZIF5A0kCOJpEHoIdDO0k7Ex3rBaf0M';
const SHEET_GID = '304318457'; // Third sheet (Vois)

// Build CSV export URL for specific sheet
const buildSheetUrl = (sheetId, gid) => {
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
};

// Parse CSV string to array of objects
const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, idx) => {
            row[header] = values[idx] || '';
        });
        data.push(row);
    }

    return data;
};

// Parse a single CSV line handling quoted values
const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());
    return values;
};

// Convert Russian decimal format (comma) to number
const parseRussianNumber = (str) => {
    if (!str || str === '') return 0;
    // Replace comma with dot and remove spaces
    const cleaned = str.toString().replace(/\s/g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};

// Parse date in M/D/YYYY format
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month - 1, day);
};

// Transform raw sheet data to product format
const transformToProducts = (rawData) => {
    // Group by SKU and aggregate
    const productMap = new Map();

    rawData.forEach(row => {
        const sku = row['Артикул'];
        if (!sku) return;

        const date = parseDate(row['Дата']);
        const month = date ? date.getMonth() + 1 : null; // 1-12
        const year = date ? date.getFullYear() : null;

        // Determine if November or December 2025
        const isNovember = month === 11 && year === 2025;
        const isDecember = month === 12 && year === 2025;

        if (!productMap.has(sku)) {
            productMap.set(sku, {
                sku,
                category: row['Предмет'] || 'Неизвестно',
                price: parseRussianNumber(row['Средняя цена']),
                avgPosition: parseRussianNumber(row['Средняя позиция']),
                buyoutRate: parseRussianNumber(row['%выкупа']),
                novemberOrders: 0,
                novemberRevenue: 0,
                decemberOrders: 0,
                decemberRevenue: 0,
                totalClicks: 0,
                totalCartAdds: 0,
                dataPoints: 0,
                positionSum: 0,
                buyoutSum: 0,
                priceSum: 0,
            });
        }

        const product = productMap.get(sku);
        const orders = parseRussianNumber(row['Заказано, шт']);
        const revenue = parseRussianNumber(row['Заказано, руб']);
        const clicks = parseRussianNumber(row['Клики']);
        const cartAdds = parseRussianNumber(row['В корзину']);
        const position = parseRussianNumber(row['Средняя позиция']);
        const buyout = parseRussianNumber(row['%выкупа']);
        const price = parseRussianNumber(row['Средняя цена']);

        if (isNovember) {
            product.novemberOrders += orders;
            product.novemberRevenue += revenue;
        } else if (isDecember) {
            product.decemberOrders += orders;
            product.decemberRevenue += revenue;
        }

        product.totalClicks += clicks;
        product.totalCartAdds += cartAdds;

        // Track for averaging
        if (position > 0) {
            product.positionSum += position;
            product.dataPoints++;
        }
        if (buyout > 0) {
            product.buyoutSum += buyout;
        }
        if (price > 0) {
            product.priceSum += price;
        }
    });

    // Convert map to array and calculate averages
    const products = Array.from(productMap.values()).map((product, index) => {
        const avgPosition = product.dataPoints > 0
            ? Math.round(product.positionSum / product.dataPoints)
            : product.avgPosition;

        const avgBuyout = product.dataPoints > 0
            ? (product.buyoutSum / product.dataPoints).toFixed(2)
            : product.buyoutRate;

        const avgPrice = product.dataPoints > 0
            ? Math.round(product.priceSum / product.dataPoints)
            : product.price;

        // Calculate priority based on revenue
        const totalRevenue = product.novemberRevenue + product.decemberRevenue;
        let priority = 'low';
        if (totalRevenue > 100000000) priority = 'critical';
        else if (totalRevenue > 50000000) priority = 'high';
        else if (totalRevenue > 20000000) priority = 'medium';

        return {
            id: index + 1,
            sku: product.sku,
            name: `${product.category} (${product.sku})`, // Will be enriched from name lookup
            category: product.category,
            wbUrl: `https://www.wildberries.ru/catalog/${product.sku}/detail.aspx`,
            rating: 4.8, // Default, would need API to get actual
            reviews: 0, // Default, would need API to get actual
            price: avgPrice,
            novemberOrders: product.novemberOrders,
            novemberRevenue: product.novemberRevenue,
            decemberOrders: product.decemberOrders,
            decemberRevenue: product.decemberRevenue,
            avgPosition: avgPosition,
            buyoutRate: parseFloat(avgBuyout),
            ourProduct: null,
            ourSku: null,
            priority,
        };
    });

    // Sort by total revenue descending
    return products.sort((a, b) =>
        (b.novemberRevenue + b.decemberRevenue) - (a.novemberRevenue + a.decemberRevenue)
    );
};

export const useGoogleSheets = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = buildSheetUrl(SHEET_ID, SHEET_GID);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const csvText = await response.text();
            const rawData = parseCSV(csvText);
            const transformedProducts = transformToProducts(rawData);

            setProducts(transformedProducts);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching Google Sheets data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        products,
        loading,
        error,
        lastUpdated,
        refetch: fetchData,
    };
};

export default useGoogleSheets;
