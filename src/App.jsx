import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { supabase } from './supabaseClient'

function App() {
  // Simple auth state holding the username explicitly: 'Dindayal' or 'Lakshmi'
  const [user, setUser] = useState(null)

  useEffect(() => {
    const sessionStr = localStorage.getItem('friends_mood_session');
    if (sessionStr) {
      try {
        const sessionData = JSON.parse(sessionStr);
        const now = Date.now();
        const diff = now - sessionData.loginTime;
        // 15 minutes = 15 * 60 * 1000 milliseconds
        if (diff < 15 * 60 * 1000) {
          setUser(sessionData.username);
        } else {
          localStorage.removeItem('friends_mood_session');
        }
      } catch (e) {
        localStorage.removeItem('friends_mood_session');
      }
    }
  }, [])

  const handleLogin = (username) => {
    setUser(username)
    localStorage.setItem('friends_mood_session', JSON.stringify({
      username,
      loginTime: Date.now()
    }));
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('friends_mood_session');
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
