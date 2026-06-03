import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [isAdmin, setIsAdmin] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleToggle = (adminMode) => {
        setIsAdmin(adminMode)
        setError('')
        setFormData({ email: '', password: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await api.post('/api/auth/login', formData)
            const token = response.data.token
            const payload = JSON.parse(atob(token.split('.')[1]))
            const role = payload.role

            if (isAdmin && role !== 'ADMIN') {
                setError('This account is not an admin account.')
                setLoading(false)
                return
            }

            if (!isAdmin && role === 'ADMIN') {
                setError('Admin accounts should use the admin tab.')
                setLoading(false)
                return
            }

            login(token, role)
            toast.success(isAdmin ? 'Admin login successful' : 'Login successful')
            navigate(role === 'ADMIN' ? '/admin' : '/dashboard')
        } catch (err) {
            const msg = err.response?.data?.error
                || err.response?.data
                || 'Invalid email or password'
            setError(msg)
            toast.error('Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-layout">
                <div className="auth-note">
                    <span className="mini-mark">BS</span>
                    <h1>Simple banking, neatly managed.</h1>
                    <p>
                        A secure digital banking platform for customers and administrators,
                        powered by a robust Spring Boot backend with role-based access control
                        and transaction management.
                    </p>
                </div>

                <div className="auth-card">
                    <div className="mb-4">
                        <p className="text-uppercase fw-bold text-success small mb-2">
                            {isAdmin ? 'Admin area' : 'User area'}
                        </p>
                        <h2 className="fw-bold mb-1">
                            {isAdmin ? 'Admin Login' : 'Sign in to your account'}
                        </h2>
                        <p className="muted-text mb-0">
                            Use your registered email and password.
                        </p>
                    </div>

                    <div className="mode-switch mb-4">
                        <button
                            type="button"
                            className={!isAdmin ? 'active' : ''}
                            onClick={() => handleToggle(false)}>
                            User
                        </button>
                        <button
                            type="button"
                            className={isAdmin ? 'active' : ''}
                            onClick={() => handleToggle(true)}>
                            Admin
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="field-label">Email address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder={isAdmin ? 'admin@example.com' : 'student@example.com'}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="field-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-main w-100" disabled={loading}>
                            {loading ? 'Signing in...' : isAdmin ? 'Login as Admin' : 'Sign In'}
                        </button>
                    </form>

                    {!isAdmin ? (
                        <p className="text-center muted-text small mb-0 mt-4">
                            New user?{' '}
                            <Link className="fw-bold text-success text-decoration-none" to="/register">
                                Create an account
                            </Link>
                        </p>
                    ) : (
                        <p className="text-center muted-text small mb-0 mt-4">
                            Not admin?{' '}
                            <button
                                type="button"
                                className="border-0 bg-transparent fw-bold text-success p-0"
                                onClick={() => handleToggle(false)}>
                                Go to user login
                            </button>
                        </p>
                    )}
                </div>
            </section>
        </main>
    )
}
