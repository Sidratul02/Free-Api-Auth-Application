import { useState, useEffect } from 'react'
import './App.css'

const BASE = '/api/v1/users'

function App() {
  const [view, setView] = useState('login') // 'login' | 'register' | 'profile'
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' }) // type: 'success' | 'error'

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', role: 'USER' })

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  function showMsg(text, type = 'success') {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 4000)
  }

  async function fetchCurrentUser() {
    try {
      const res = await fetch(`${BASE}/current-user`, { credentials: 'include' })
      const data = await res.json()
      if (res.ok && data.data) {
        setUser(data.data)
        setView('profile')
      }
    } catch (_) {}
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.data?.user)
        setView('profile')
        showMsg('Logged in successfully!')
      } else {
        showMsg(data.message || 'Login failed', 'error')
      }
    } catch (err) {
      showMsg(err.message || 'Network error', 'error')
    }
    setLoading(false)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      })
      const data = await res.json()
      if (res.ok) {
        showMsg('Registered! Please log in.')
        setView('login')
      } else {
        showMsg(data.message || 'Registration failed', 'error')
      }
    } catch (err) {
      showMsg(err.message || 'Network error', 'error')
    }
    setLoading(false)
  }

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch(`${BASE}/logout`, { method: 'POST', credentials: 'include' })
      setUser(null)
      setView('login')
      showMsg('Logged out successfully!')
    } catch (_) {
      showMsg('Logout failed', 'error')
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="brand">FreeAPI Auth</h1>

        {msg.text && <div className={`msg ${msg.type}`}>{msg.text}</div>}

        {view === 'login' && (
          <form onSubmit={handleLogin} className="form">
            <h2>Login</h2>
            <input
              placeholder="Username"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="switch">
              No account?{' '}
              <span onClick={() => setView('register')}>Register</span>
            </p>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} className="form">
            <h2>Register</h2>
            <input
              placeholder="Username"
              value={registerForm.username}
              onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
            />
            <select
              value={registerForm.role}
              onChange={e => setRegisterForm({ ...registerForm, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="switch">
              Have an account?{' '}
              <span onClick={() => setView('login')}>Login</span>
            </p>
          </form>
        )}

        {view === 'profile' && user && (
          <div className="profile">
            <h2>Welcome, {user.username} 👋</h2>
            <div className="profile-info">
              <div className="avatar">{user.username?.[0]?.toUpperCase()}</div>
              <div className="details">
                <p><span>Username</span>{user.username}</p>
                <p><span>Email</span>{user.email}</p>
                <p><span>Role</span>{user.role}</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} disabled={loading}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
