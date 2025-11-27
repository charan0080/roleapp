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
      <h1>Admin Dashboard</h1>
      <p>Manage students and assign roles.</p>
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Create user</h2>
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
