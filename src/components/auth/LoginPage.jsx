import { useState } from 'react';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simple auth check
        setTimeout(() => {
            if (username === 'admin' && password === 'qwerty123') {
                localStorage.setItem('warroom_auth', 'true');
                localStorage.setItem('warroom_user', username);
                onLogin();
            } else {
                setError('Неверный логин или пароль');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: '#fff',
            padding: '20px'
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                backdropFilter: 'blur(10px)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '12px'
                    }}>⚔️</div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        MIXIT WAR ROOM
                    </h1>
                    <p style={{
                        margin: '8px 0 0',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}>
                        Tactical Dashboard
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.5)',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Логин
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.5)',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Пароль
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(255,71,87,0.1)',
                            border: '1px solid rgba(255,71,87,0.3)',
                            borderRadius: '8px',
                            color: '#FF4757',
                            fontSize: '12px',
                            marginBottom: '16px',
                            textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !username || !password}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: (isLoading || !username || !password)
                                ? 'rgba(255,255,255,0.1)'
                                : 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: (isLoading || !username || !password) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoading ? '⏳ Входим...' : '🔐 Войти'}
                    </button>
                </form>

                {/* Footer */}
                <p style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.3)'
                }}>
                    MIXIT © 2025 • Только для внутреннего использования
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
