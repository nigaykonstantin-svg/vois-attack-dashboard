// Vercel API Route for Gemini AI Analysis
// POST /api/analyze-dossier

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    try {
        const { product, mixitProduct, notes, screenshots } = req.body;

        // Build the prompt
        const systemPrompt = `Ты опытный маркетинговый аналитик бренда MIXIT (российская косметика).
Твоя задача — проанализировать конкурента VOIS и дать тактические рекомендации для "атаки" на его позиции.

ФОРМАТ ОТВЕТА (строго придерживайся):

## 🔍 Анализ конкурента
[Краткий анализ сильных и слабых сторон товара VOIS]

## 🎯 Точки атаки
[Конкретные уязвимости, которые можно использовать]

## 💡 Рекомендации для MIXIT
[Что сделать с нашим товаром-аналогом, чтобы выиграть]

## ⚔️ Тактика маркетинговой атаки
[Конкретные шаги: реклама, контент, отзывы, инфлюенсеры]

## 📊 Оценка приоритета
[Высокий/Средний/Низкий — стоит ли вкладывать ресурсы в эту атаку]

Будь конкретен и практичен. Избегай общих фраз.`;

        // Build content parts
        const contentParts = [];

        // Product data
        let productInfo = `ТОВАР КОНКУРЕНТА (VOIS):
- Название: ${product.name}
- SKU: ${product.sku}
- Цена: ${product.price} ₽
- Рейтинг: ${product.rating} ⭐
- Отзывов: ${product.reviews?.toLocaleString() || 'N/A'}
- Категория: ${product.category}
- Выкуп: ${((product.buyoutRate || 0) * 100).toFixed(0)}%
- Позиция в выдаче: #${product.avgPosition || 'N/A'}
- Выручка (Ноябрь): ${product.novemberRevenue?.toLocaleString() || 'N/A'} ₽
- Выручка (Декабрь): ${product.decemberRevenue?.toLocaleString() || 'N/A'} ₽`;

        if (mixitProduct) {
            productInfo += `

НАШ ТОВАР-АНАЛОГ (MIXIT):
- Название: ${mixitProduct.name}
- SKU: ${mixitProduct.sku}
- Цена: ${mixitProduct.price} ₽
- Рейтинг: ${mixitProduct.rating} ⭐
- Отзывов: ${mixitProduct.reviews?.toLocaleString() || 'N/A'}`;
        } else {
            productInfo += `

НАШ ТОВАР-АНАЛОГ: Не указан (предложи, какой из MIXIT мог бы конкурировать)`;
        }

        if (notes && notes.length > 0) {
            productInfo += `

ЗАМЕТКИ КОМАНДЫ:
${notes.map(n => `- ${n.text} (${new Date(n.date).toLocaleDateString('ru-RU')})`).join('\n')}`;
        }

        contentParts.push({ text: productInfo });

        // Add screenshots if available (Gemini Vision)
        if (screenshots && screenshots.length > 0) {
            for (const ss of screenshots.slice(0, 3)) { // Max 3 images
                if (ss.data && ss.data.startsWith('data:image')) {
                    // Extract base64 data
                    const [header, base64Data] = ss.data.split(',');
                    const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/png';

                    contentParts.push({
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Data
                        }
                    });

                    if (ss.caption) {
                        contentParts.push({ text: `Подпись к скриншоту: ${ss.caption}` });
                    }
                }
            }
        }

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents: [{
                        parts: contentParts
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            return res.status(500).json({ error: 'Gemini API error', details: errorData });
        }

        const data = await response.json();
        const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось получить анализ';

        return res.status(200).json({
            success: true,
            analysis: analysisText,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({
            error: 'Analysis failed',
            message: error.message
        });
    }
}
