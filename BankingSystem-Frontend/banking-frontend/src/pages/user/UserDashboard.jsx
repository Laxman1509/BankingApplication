import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function UserDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAccounts()
    }, [])

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/api/accounts')
            setAccounts(response.data)
        } catch {
            toast.error('Failed to load accounts')
        } finally {
            setLoading(false)
        }
    }

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

    const actions = [
        { label: 'New Account', hint: 'Open savings/current', mark: '+', path: '/create-account' },
        { label: 'Deposit', hint: 'Add funds', mark: 'IN', path: '/deposit' },
        { label: 'Withdraw', hint: 'Take out cash', mark: 'OUT', path: '/withdraw' },
        {
            label: 'Passbook',
            hint: 'View activity',
            mark: 'PB',
            path: `/passbook/${accounts[0]?.accountNumber || ''}`
        }
    ]

    return (
        <>
            <Navbar />
            <main className="app-page">
                <div className="content-wrap">
                    <section className="hero-panel mb-4">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <div>
                                <h1>Welcome, {user?.sub || 'User'}</h1>
                                <p>Your account summary and quick banking actions are here.</p>
                            </div>
                            <div className="balance-box">
                                <span>Total balance</span>
                                <strong>Rs {totalBalance.toFixed(2)}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="action-grid mb-4">
                        {actions.map(action => (
                            <button
                                key={action.label}
                                type="button"
                                className="dash-card text-start"
                                onClick={() => navigate(action.path)}
                                disabled={action.label === 'Passbook' && accounts.length === 0}>
                                <span className="card-symbol mb-3">{action.mark}</span>
                                <h5 className="fw-bold mb-1">{action.label}</h5>
                                <p className="muted-text mb-0 small">{action.hint}</p>
                            </button>
                        ))}
                    </section>

                    <section className="table-shell">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                            <div>
                                <h4 className="fw-bold mb-1">My Accounts</h4>
                                <p className="muted-text mb-0 small">{accounts.length} account records</p>
                            </div>
                            <button className="btn-soft" onClick={() => navigate('/create-account')}>
                                Add Account
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-success" />
                            </div>
                        ) : accounts.length === 0 ? (
                            <div className="text-center py-5">
                                <h5 className="fw-bold">No account created yet</h5>
                                <p className="muted-text">Create your first account to start transactions.</p>
                                <button className="btn-main" onClick={() => navigate('/create-account')}>
                                    Create First Account
                                </button>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {accounts.map((acc) => (
                                    <div key={acc.accountNumber} className="col-md-6">
                                        <article className={`account-card ${acc.accountType === 'CURRENT' ? 'current' : ''}`}>
                                            <div className="d-flex justify-content-between align-items-start mb-4">
                                                <div>
                                                    <p className="text-white-50 small mb-1">{acc.accountType}</p>
                                                    <h5 className="fw-bold mb-0">{acc.accountNumber}</h5>
                                                </div>
                                                <span className={`status-badge ${acc.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                                                    {acc.status}
                                                </span>
                                            </div>
                                            <p className="text-white-50 small mb-1">Available balance</p>
                                            <h3 className="fw-bold mb-4">Rs {acc.balance.toFixed(2)}</h3>
                                            <button
                                                className="btn btn-light fw-bold rounded-3"
                                                onClick={() => navigate(`/passbook/${acc.accountNumber}`)}>
                                                View Passbook
                                            </button>
                                        </article>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    )
}
