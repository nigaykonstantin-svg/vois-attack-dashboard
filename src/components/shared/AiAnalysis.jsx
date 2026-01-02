import { useState } from 'react';

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
            const response = await fetch('/api/analyze-dossier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product,
                    mixitProduct,
                    notes,
                    screenshots
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка API');
            }

            const data = await response.json();
            setAnalysis(data.analysis);

            if (onAnalysisComplete) {
                onAnalysisComplete(data.analysis);
            }
        } catch (err) {
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
