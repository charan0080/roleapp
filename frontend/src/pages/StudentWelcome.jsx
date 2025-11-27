import { useEffect, useState } from 'react'

import client from '../api/client'

const StudentWelcome = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await client.get('api/accounts/student/welcome/')
        setProfile(response.data.user || response.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!profile) {
    return <p>Unable to load profile data.</p>
  }

  return (
    <section className="welcome-shell">
      <h1>Welcome, {profile.username}</h1>
      <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Student Dashboard</p>

      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Account Information</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
              <td style={{ padding: '0.75rem 0', color: '#94a3b8', width: '40%' }}>Username:</td>
              <td style={{ padding: '0.75rem 0', color: '#f1f5f9' }}>{profile.username}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
              <td style={{ padding: '0.75rem 0', color: '#94a3b8' }}>Email:</td>
              <td style={{ padding: '0.75rem 0', color: '#f1f5f9' }}>{profile.email || 'Not provided'}</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem 0', color: '#94a3b8' }}>Role:</td>
              <td style={{ padding: '0.75rem 0', color: '#f1f5f9' }}>{profile.role}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default StudentWelcome
