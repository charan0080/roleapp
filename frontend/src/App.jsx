import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import StudentWelcome from './pages/StudentWelcome'
import './App.css'

const ProtectedRoute = ({ element: Element, roles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/login" replace />
  }

  return <Element />
}

function App() {
  const { user, logout, loading } = useAuth()

  return (
    <div className="app-shell">
      <nav className="main-nav">
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <div>
          {!loading && user ? (
            <>
              <button
                type="button"
                onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : '/student')}
                className="ghost"
              >
                Dashboard
              </button>
              <button type="button" onClick={logout} className="ghost">
                Logout {user.username}
              </button>
            </>
          ) : null}
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<ProtectedRoute element={AdminDashboard} roles={['ADMIN']} />} />
        <Route path="/student" element={<ProtectedRoute element={StudentWelcome} roles={['STUDENT']} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
