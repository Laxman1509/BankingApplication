import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAccounts: 0,
        activeAccounts: 0,
        blockedAccounts: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const [usersRes, accountsRes] = await Promise.all([
                api.get('/api/admin/users'),
                api.get('/api/admin/accounts')
            ])
            const accounts = accountsRes.data
            setStats({
                totalUsers: usersRes.data.length,
                totalAccounts: accounts.length,
                activeAccounts: accounts.filter(a => a.status === 'ACTIVE').length,
                blockedAccounts: accounts.filter(a => a.status === 'INACTIVE').length
            })
        } catch {
            toast.error('Failed to load stats')
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, mark: 'US', tone: 'status-info', path: '/admin/users' },
        { title: 'Total Accounts', value: stats.totalAccounts, mark: 'AC', tone: 'status-warning', path: '/admin/accounts' },
        { title: 'Active Accounts', value: stats.activeAccounts, mark: 'ON', tone: 'status-success', path: '/admin/accounts' },
        { title: 'Blocked Accounts', value: stats.blockedAccounts, mark: 'BL', tone: 'status-danger', path: '/admin/accounts' }
    ]

    return (
        <>
            <Navbar />
            <main className="app-page">
                <div className="content-wrap">
                    <section className="hero-panel mb-4">
                        <h1>Admin Dashboard</h1>
                        <p>Monitor users, accounts, active records, and blocked accounts.</p>
                    </section>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" />
                        </div>
                    ) : (
                        <section className="stats-grid mb-4">
                            {statCards.map(card => (
                                <button
                                    key={card.title}
                                    type="button"
                                    className="dash-card text-start"
                                    onClick={() => navigate(card.path)}>
                                    <span className={`status-badge ${card.tone} mb-3`}>{card.mark}</span>
                                    <h2 className="fw-bold mb-1">{card.value}</h2>
                                    <p className="muted-text mb-0 small">{card.title}</p>
                                </button>
                            ))}
                        </section>
                    )}

                    <section className="table-shell">
                        <h4 className="fw-bold mb-3">Quick Actions</h4>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <button className="btn-main w-100 py-3" onClick={() => navigate('/admin/users')}>
                                    Manage Users
                                </button>
                            </div>
                            <div className="col-md-6">
                                <button className="btn-soft w-100 py-3" onClick={() => navigate('/admin/accounts')}>
                                    Manage Accounts
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
