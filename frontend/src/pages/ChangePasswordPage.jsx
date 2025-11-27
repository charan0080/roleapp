import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            await client.put('api/accounts/password/change/', formData)
            setSuccess('Password changed successfully.')
            setFormData({ old_password: '', new_password: '' })
            setTimeout(() => {
                navigate(-1)
            }, 2000)
        } catch (err) {
            if (err.response && err.response.data) {
                const msg = err.response.data.detail || err.response.data.old_password || 'Failed to change password.'
                setError(Array.isArray(msg) ? msg[0] : msg)
            } else {
                setError('An unexpected error occurred.')
            }
        }
    }

    return (
        <section className="form-shell">
            <div className="form-card">
                <h2>Change Password</h2>
                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}

                <label>
                    Current Password
                    <input
                        type="password"
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    New Password
                    <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </label>
                <button type="submit" onClick={handleSubmit}>Update Password</button>
                <button type="button" className="ghost" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </div>
        </section>
    )
}

export default ChangePasswordPage
