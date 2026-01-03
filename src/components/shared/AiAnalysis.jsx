import { useState } from 'react';

// Gemini API key
const GEMINI_API_KEY = 'AIzaSyAg8mUR06vS8Pgp2U2Xh82DzrVc-NFDmk0';

const AiAnalysis = ({
    product,
    mixitProduct,
    notes,
    screenshots,
    onAnalysisComplete
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);

    const runAnalysis = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // DEBUG: Log what data we're receiving
            console.log('🔍 AI Analysis - Product Data:', {
                sku: product.sku,
                name: product.name,
                novemberOrders: product.novemberOrders,
                novemberRevenue: product.novemberRevenue,
                decemberOrders: product.decemberOrders,
                decemberRevenue: product.decemberRevenue,
                totalImpressions: product.totalImpressions,
                totalClicks: product.totalClicks,
                ctr: product.ctr,
                reviews: product.reviews,
                fullProduct: product
            });
            // Build prompt
            const systemPrompt = `Ты опытный маркетинговый аналитик бренда MIXIT (российская косметика).
Проанализируй конкурента VOIS и дай тактические рекомендации.

ФОРМАТ:
## 🔍 Анализ конкурента
## 🎯 Точки атаки  
## 💡 Рекомендации для MIXIT
## ⚔️ Тактика атаки
## 📊 Приоритет (Высокий/Средний/Низкий)

Анализируй данные воронки конверсии особенно внимательно! Будь конкретен.`;

            // Build comprehensive product info with all Google Sheets data
            let info = `=== ДАННЫЕ КОНКУРЕНТА VOIS (из Google Sheets — актуальные!) ===

ТОВАР: ${product.name}
SKU/Артикул: ${product.sku}
Категория: ${product.category}
Средняя цена: ${product.price?.toLocaleString() || 'N/A'} ₽

=== ПРОДАЖИ ИЗ ТАБЛИЦЫ ===
Заказов (Ноябрь): ${product.novemberOrders?.toLocaleString() || 0} шт
Выручка (Ноябрь): ${product.novemberRevenue?.toLocaleString() || 0} ₽
Заказов (Декабрь): ${product.decemberOrders?.toLocaleString() || 0} шт
Выручка (Декабрь): ${product.decemberRevenue?.toLocaleString() || 0} ₽
ИТОГО выручка за 2 месяца: ${((product.novemberRevenue || 0) + (product.decemberRevenue || 0))?.toLocaleString()} ₽
Рост дек/нояб: ${product.novemberRevenue > 0 ? (((product.decemberRevenue - product.novemberRevenue) / product.novemberRevenue) * 100).toFixed(0) : 'N/A'}%

=== ВОРОНКА КОНВЕРСИИ (данные с 6 декабря) ===
Показы: ${product.totalImpressions?.toLocaleString() || 0}
Клики: ${product.totalClicks?.toLocaleString() || 0}
CTR (клики/показы): ${product.ctr || 0}%
Добавлено в корзину: ${product.totalCartAdds?.toLocaleString() || 0}
Конверсия клик→корзина: ${product.addToCartRate || 0}%
Конверсия корзина→заказ: ${product.orderRate || 0}%

=== ПОЗИЦИЯ И ВЫКУП ===
Средняя позиция в выдаче WB: #${product.avgPosition || 'N/A'}
Процент выкупа: ${product.buyoutRate ? (product.buyoutRate > 1 ? product.buyoutRate.toFixed(0) : (product.buyoutRate * 100).toFixed(0)) : 'N/A'}%`;

            if (mixitProduct) {
                info += `

=== НАШ АНАЛОГ (MIXIT) ===
Название: ${mixitProduct.name}
Цена: ${mixitProduct.discountPrice || mixitProduct.price} ₽
Рейтинг: ${mixitProduct.rating}★
Заказов (30д): ${mixitProduct.orderCount?.toLocaleString() || 'N/A'}
Выручка (30д): ${mixitProduct.totalRevenue?.toLocaleString() || 'N/A'} ₽`;
            }

            if (notes?.length > 0) {
                info += `

=== ЗАМЕТКИ КОМАНДЫ ===
${notes.map(n => `• ${n.text}`).join('\n')}`;
            }

            const contentParts = [{ text: info }];

            // Add screenshots
            if (screenshots?.length > 0) {
                for (const ss of screenshots.slice(0, 2)) {
                    if (ss.data?.startsWith('data:image')) {
                        const [header, base64Data] = ss.data.split(',');
                        const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/png';
                        contentParts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
                    }
                }
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        contents: [{ parts: contentParts }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
                    })
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || 'Gemini API error');
            }

            const data = await response.json();
            const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось получить анализ';

            setAnalysis(analysisText);
            if (onAnalysisComplete) onAnalysisComplete(analysisText);

        } catch (err) {
            console.error('AI Analysis error:', err);
            setError(err.message || 'Не удалось выполнить анализ');
        } finally {
            setIsLoading(false);
        }
    };

    // Parse markdown-like analysis into sections
    const parseAnalysis = (text) => {
        if (!text) return [];

        const sections = [];
        const lines = text.split('\n');
        let currentSection = null;

        for (const line of lines) {
            if (line.startsWith('## ')) {
                if (currentSection) sections.push(currentSection);
                currentSection = {
                    title: line.replace('## ', ''),
                    content: []
                };
            } else if (currentSection) {
                currentSection.content.push(line);
            }
        }
        if (currentSection) sections.push(currentSection);

        return sections;
    };

    const sections = analysis ? parseAnalysis(analysis) : [];

    return (
        <div style={{
            background: 'rgba(102,126,234,0.05)',
            border: '1px solid rgba(102,126,234,0.2)',
            borderRadius: '12px',
            padding: '16px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    🤖 AI Анализ конкурента
                    <span style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.4)',
                        fontWeight: 'normal'
                    }}>
                        Powered by Gemini
                    </span>
                </h3>

                <button
                    onClick={runAnalysis}
                    disabled={isLoading}
                    style={{
                        padding: '8px 16px',
                        background: isLoading
                            ? 'rgba(102,126,234,0.3)'
                            : 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: isLoading ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    {isLoading ? (
                        <>
                            <span style={{
                                width: '12px',
                                height: '12px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTop: '2px solid #fff',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            Анализирую...
                        </>
                    ) : analysis ? (
                        <>🔄 Обновить анализ</>
                    ) : (
                        <>✨ Запустить анализ</>
                    )}
                </button>
            </div>

            {/* Info about what will be analyzed */}
            {!analysis && !isLoading && (
                <div style={{
                    padding: '12px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.6)'
                }}>
                    <p style={{ margin: '0 0 8px 0' }}>AI проанализирует:</p>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Данные товара VOIS (цена, рейтинг, отзывы, выручка)</li>
                        {mixitProduct && <li>Связанный товар MIXIT для сравнения</li>}
                        {screenshots?.length > 0 && (
                            <li>{screenshots.length} скриншот(ов) карточки товара</li>
                        )}
                        {notes?.length > 0 && (
                            <li>{notes.length} заметок команды</li>
                        )}
                    </ul>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.6)'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        margin: '0 auto 16px',
                        border: '3px solid rgba(102,126,234,0.2)',
                        borderTop: '3px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ margin: 0, fontSize: '12px' }}>
                        Gemini анализирует конкурента...
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                        Это может занять 10-20 секунд
                    </p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div style={{
                    padding: '12px',
                    background: 'rgba(255,71,87,0.1)',
                    border: '1px solid rgba(255,71,87,0.3)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FF4757'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Analysis results */}
            {analysis && !isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sections.map((section, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: '12px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '8px',
                                borderLeft: `3px solid ${section.title.includes('Точки атаки') ? '#FF6B6B' :
                                    section.title.includes('Рекомендации') ? '#4ECDC4' :
                                        section.title.includes('Тактика') ? '#FFD93D' :
                                            section.title.includes('приоритета') ? '#2ED573' :
                                                '#667eea'
                                    }`
                            }}
                        >
                            <h4 style={{
                                margin: '0 0 8px 0',
                                fontSize: '12px',
                                color: '#fff'
                            }}>
                                {section.title}
                            </h4>
                            <div style={{
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.8)',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {section.content.join('\n').trim()}
                            </div>
                        </div>
                    ))}

                    {/* Raw text fallback if parsing didn't work */}
                    {sections.length === 0 && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {analysis}
                        </div>
                    )}
                </div>
            )}

            {/* Keyframe animation for spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AiAnalysis;
