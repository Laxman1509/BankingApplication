import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function CreateAccount() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(null)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        accountType: 'SAVINGS',
        dob: '',
        governmentId: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const calculateAge = (dob) => {
        if (!dob) return null
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const maxDob = () => {
        const d = new Date()
        d.setFullYear(d.getFullYear() - 18)
        return d.toISOString().split('T')[0]
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const age = calculateAge(formData.dob)
        if (age < 18) {
            setError('You must be at least 18 years old to open an account.')
            return
        }

        if (formData.governmentId.trim().length < 6) {
            setError('Government ID must be at least 6 characters.')
            return
        }

        setLoading(true)
        try {
            const response = await api.post('/api/accounts', formData)
            setCreated(response.data)
            toast.success('Account created successfully')
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to create account'
            setError(msg)
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const age = calculateAge(formData.dob)

    return (
        <>
            <Navbar />
            <main className="app-page">
                <div className="content-wrap">
                    <div className="page-title">
                        <h1>Create New Account</h1>
                        <p>Choose account type and verify basic identity details.</p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            {created ? (
                                <section className="result-shell text-center">
                                    <span className="status-badge status-success mb-3">Created</span>
                                    <h3 className="fw-bold mb-3">Account is ready</h3>
                                    <div className="row g-3 text-start mb-4">
                                        <div className="col-sm-6">
                                            <p className="muted-text small mb-1">Account number</p>
                                            <h5 className="fw-bold">{created.accountNumber}</h5>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="muted-text small mb-1">Account type</p>
                                            <h5 className="fw-bold">{created.accountType}</h5>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="muted-text small mb-1">Balance</p>
                                            <h5 className="fw-bold">Rs {Number(created.balance).toFixed(2)}</h5>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="muted-text small mb-1">Government ID</p>
                                            <h5 className="fw-bold">{created.governmentId}</h5>
                                        </div>
                                    </div>
                                    <button className="btn-main w-100" onClick={() => navigate('/dashboard')}>
                                        Go to Dashboard
                                    </button>
                                </section>
                            ) : (
                                <section className="form-shell">
                                    {error && (
                                        <div className="alert alert-danger py-2 small">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="field-label">Account type</label>
                                            <div className="row g-3">
                                                {['SAVINGS', 'CURRENT'].map(type => (
                                                    <div className="col-sm-6" key={type}>
                                                        <div
                                                            className={`option-card ${formData.accountType === type ? 'active' : ''}`}
                                                            onClick={() => setFormData({ ...formData, accountType: type })}>
                                                            <h5 className="fw-bold mb-1">{type === 'SAVINGS' ? 'Savings' : 'Current'}</h5>
                                                            <p className="muted-text small mb-0">
                                                                {type === 'SAVINGS'
                                                                    ? 'Good for personal balance'
                                                                    : 'Useful for frequent transactions'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="field-label">Date of birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                className="form-control"
                                                max={maxDob()}
                                                value={formData.dob}
                                                onChange={handleChange}
                                                required
                                            />
                                            {formData.dob && (
                                                <small className={age >= 18 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                                    {age >= 18 ? `Age: ${age} years` : `Must be 18+. Current age: ${age}`}
                                                </small>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="field-label">Government ID</label>
                                            <input
                                                type="text"
                                                name="governmentId"
                                                className="form-control"
                                                placeholder="Aadhaar, PAN or Passport number"
                                                value={formData.governmentId}
                                                onChange={handleChange}
                                                maxLength={20}
                                                required
                                            />
                                            <small className="muted-text">
                                                The backend will generate the account number automatically.
                                            </small>
                                        </div>

                                        <button type="submit" className="btn-main w-100" disabled={loading}>
                                            {loading ? 'Creating...' : 'Create Account'}
                                        </button>
                                    </form>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
