import { useEffect, useState } from 'react'

import client from '../api/client'

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'STUDENT', label: 'Student' },
]

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'STUDENT' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchUsers = async () => {
    const response = await client.get('api/accounts/admin/users/')
    setUsers(response.data)
  }

  useEffect(() => {
    const load = async () => {
      await fetchUsers()
      setLoading(false)
    }

    load()
  }, [])

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) {
      return
    }

    await client.delete(`api/accounts/admin/users/${userId}/`)
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const response = await client.post('api/accounts/admin/users/', form)
      setUsers((prev) => [response.data, ...prev])
      setForm({ username: '', email: '', password: '', role: 'STUDENT' })
      setIsModalOpen(false)
    } catch (err) {
      setError(err.response?.data || 'Unable to create user.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p>Loading users…</p>
  }

  return (
    <section className="dashboard-shell">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage students and assign roles.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white',
            fontWeight: '600',
            borderRadius: '0.5rem',
            padding: '0.875rem 1.5rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s'
          }}
        >
          + Create User
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#f1f5f9' }}>Create New User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0.25rem 0.5rem'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="form-card" style={{ marginTop: 0 }}>
              <label>
                Username
                <input name="username" value={form.username} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Password
                <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />
              </label>
              <label>
                Role
                <select name="role" value={form.role} onChange={handleChange}>
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {error && <p className="form-error">{JSON.stringify(error)}</p>}
              <button type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create user'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="user-grid">
        {users.map((user) => (
          <article key={user.id} className="user-card">
            <div>
              <h3>{user.username}</h3>
              <p>Role: {user.role}</p>
              <p>Email: {user.email || 'No email'}</p>
            </div>
            <button type="button" className="ghost" onClick={() => handleDelete(user.id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminDashboard
