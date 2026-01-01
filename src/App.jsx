import { useState, useEffect } from 'react'
import MixitWarRoom from './MixitWarRoom'
import Login from './components/Login'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Проверяем, есть ли сохранённая сессия
  useEffect(() => {
    const savedUser = localStorage.getItem('vois_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('vois_user')
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e',
        color: '#fff'
      }}>
        Загрузка...
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return <MixitWarRoom user={user} onLogout={handleLogout} />
}

export default App
