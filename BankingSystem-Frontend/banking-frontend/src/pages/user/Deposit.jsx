import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Deposit() {
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const [formData, setFormData] = useState({ accountNumber: '', amount: '' })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    useEffect(() => {
        fetchAccounts()
    }, [])

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/api/accounts')
            setAccounts(res.data)
            if (res.data.length > 0) {
                setFormData(f => ({ ...f, accountNumber: res.data[0].accountNumber }))
            }
        } catch {
            toast.error('Failed to load accounts')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (parseFloat(formData.amount) <= 0) {
            toast.error('Amount must be greater than 0')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/api/accounts/deposit', formData)
            setResult(res.data)
            toast.success(`Rs ${formData.amount} deposited successfully`)
        } catch (err) {
            const msg = err.response?.data?.error || 'Deposit failed'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="app-page">
                <div className="content-wrap">
                    <div className="page-title">
                        <h1>Deposit Money</h1>
                        <p>Select an account and add money to the balance.</p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            {result ? (
                                <section className="result-shell text-center">
                                    <span className="status-badge status-success mb-3">Success</span>
                                    <h3 className="fw-bold mb-2">Deposit completed</h3>
                                    <p className="muted-text mb-4">New balance</p>
                                    <h2 className="fw-bold text-success mb-4">
                                        Rs {result.balance.toFixed(2)}
                                    </h2>
                                    <div className="row g-2">
                                        <div className="col-sm-6">
                                            <button
                                                className="btn-soft w-100"
                                                onClick={() => {
                                                    setResult(null)
                                                    setFormData({
                                                        accountNumber: formData.accountNumber,
                                                        amount: ''
                                                    })
                                                }}>
                                                New Deposit
                                            </button>
                                        </div>
                                        <div className="col-sm-6">
                                            <button className="btn-main w-100" onClick={() => navigate('/dashboard')}>
                                                Dashboard
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <section className="form-shell">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="field-label">Select account</label>
                                            <select
                                                className="form-select"
                                                value={formData.accountNumber}
                                                onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                                required>
                                                {accounts.map(acc => (
                                                    <option
                                                        key={acc.accountNumber}
                                                        value={acc.accountNumber}
                                                        disabled={acc.status === 'INACTIVE'}>
                                                        {acc.accountNumber} - {acc.accountType} - Rs {acc.balance.toFixed(2)}
                                                        {acc.status === 'INACTIVE' ? ' (BLOCKED)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="field-label">Amount</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter amount"
                                                min="1"
                                                step="0.01"
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <p className="field-label mb-2">Quick amount</p>
                                            <div className="quick-row">
                                                {[500, 1000, 2000, 5000].map(amt => (
                                                    <button
                                                        key={amt}
                                                        type="button"
                                                        className="btn-soft"
                                                        onClick={() => setFormData({ ...formData, amount: amt })}>
                                                        Rs {amt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-main w-100" disabled={loading}>
                                            {loading ? 'Processing...' : 'Deposit Money'}
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
