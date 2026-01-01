import { useState } from 'react'

// Список пользователей для входа
const USERS = [
    { login: 'admin', password: 'qwerty123', name: 'Администратор' },
    // Можно добавить больше пользователей здесь:
    // { login: 'manager', password: 'manager123', name: 'Менеджер' },
]

export default function Login({ onLogin }) {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        const user = USERS.find(u => u.login === login && u.password === password)

        if (user) {
            // Сохраняем данные пользователя в localStorage
            localStorage.setItem('vois_user', JSON.stringify(user))
            onLogin(user)
        } else {
            setError('Неверный логин или пароль')
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '10px'
                    }}>⚔️</div>
                    <h1 style={{
                        color: '#fff',
                        fontSize: '24px',
                        fontWeight: '700',
                        margin: '0 0 5px 0'
                    }}>VOIS War Room</h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '14px',
                        margin: 0
                    }}>Вход в командный центр</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            marginBottom: '8px'
                        }}>Логин</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Введите логин"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(0, 0, 0, 0.3)',
                                color: '#fff',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            marginBottom: '8px'
                        }}>Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(0, 0, 0, 0.3)',
                                color: '#fff',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            marginBottom: '20px',
                            color: '#f87171',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)'
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)'
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                        }}
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    )
}
