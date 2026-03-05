import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { supabase } from './supabaseClient'

function App() {
  // Simple auth state holding the username explicitly: 'Dindayal' or 'Lakshmi'
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check session storage on mount
    const savedUser = sessionStorage.getItem('moodConnectUser')
    if (savedUser) setUser(savedUser)
  }, [])

  const handleLogin = (username) => {
    setUser(username)
    sessionStorage.setItem('moodConnectUser', username)
  }

  const handleLogout = () => {
    setUser(null)
    sessionStorage.removeItem('moodConnectUser')
  }

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <footer style={{ marginTop: 'auto', textAlign: 'center', padding: '1rem', color: '#334155', fontSize: '0.8rem', fontWeight: 500 }}>
        Made by Motuu for Motki
      </footer>
    </>
  )
}

export default App
