import { useEffect, useState } from 'react'

import client from '../api/client'

const StudentWelcome = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await client.get('api/accounts/student/welcome/')
      setProfile(response.data.user)
      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <p>Loading welcome message…</p>
  }

  return (
    <section className="welcome-shell">
      <h1>Welcome, {profile?.username}</h1>
      <p>Your role is {profile?.role}</p>
      <p>Access is limited to a friendly welcome screen only.</p>
    </section>
  )
}

export default StudentWelcome
