import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const { register } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const formatError = (errorData) => {
    if (!errorData) {
      return 'Unable to register at this time.'
    }

    if (typeof errorData === 'string') {
      return errorData
    }

    if (errorData.detail) {
      return errorData.detail
    }

    if (errorData.username) {
      return Array.isArray(errorData.username) ? errorData.username[0] : errorData.username
    }

    return Object.entries(errorData)
      .map(([field, value]) => `${field}: ${Array.isArray(value) ? value[0] : value}`)
      .join(' | ')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await register(form)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(formatError(err.response?.data))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="form-shell">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="form-card">
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
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
        {error && <p className="form-error">{JSON.stringify(error)}</p>}
      </form>
    </section>
  )
}

export default RegisterPage
