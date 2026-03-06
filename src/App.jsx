import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { supabase } from './supabaseClient'

function App() {
  // Simple auth state holding the username explicitly: 'Dindayal' or 'Lakshmi'
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Auth is purely in-memory now relative to this session
  }, [])

  const handleLogin = (username) => {
    setUser(username)
  }

  const handleLogout = () => {
    setUser(null)
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
