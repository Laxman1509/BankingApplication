import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Register() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setLoading(true)

        try {
            await api.post('/api/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            })

            toast.success('Account created. Please login.')
            navigate('/login')
        } catch (err) {
            const msg = err.response?.data?.error
                || err.response?.data
                || 'Registration failed. Try again.'
            setError(msg)
            toast.error('Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-layout">
                <div className="auth-note">
                    <span className="mini-mark">BS</span>
                    <h1>Open your banking profile.</h1>
                    <p>
                        Create a secure profile to access digital banking services.
                    </p>
                </div>

                <div className="auth-card">
                    <div className="mb-4">
                        <p className="text-uppercase fw-bold text-success small mb-2">
                            Registration
                        </p>
                        <h2 className="fw-bold mb-1">Create Account</h2>
                        <p className="muted-text mb-0">Enter your basic details to get started.</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-3">
                            <div className="col-sm-6">
                                <label className="field-label">First name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    placeholder="Rahul"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-sm-6">
                                <label className="field-label">Last name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    placeholder="Sharma"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="field-label">Email address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="rahul@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="field-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Minimum 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="field-label">Confirm password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Repeat password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {formData.confirmPassword && (
                                <small className={formData.password === formData.confirmPassword
                                    ? 'text-success fw-bold'
                                    : 'text-danger fw-bold'}>
                                    {formData.password === formData.confirmPassword
                                        ? 'Passwords match'
                                        : 'Passwords do not match'}
                                </small>
                            )}
                        </div>

                        <button type="submit" className="btn-main w-100" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center muted-text small mb-0 mt-4">
                        Already registered?{' '}
                        <Link className="fw-bold text-success text-decoration-none" to="/login">
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )
}
