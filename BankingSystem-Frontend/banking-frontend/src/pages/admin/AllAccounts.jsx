import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function AllAccounts() {
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [actionLoading, setActionLoading] = useState(null)

    useEffect(() => {
        fetchAccounts()
    }, [])

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/api/admin/accounts')
            setAccounts(res.data)
        } catch {
            toast.error('Failed to load accounts')
        } finally {
            setLoading(false)
        }
    }

    const handleBlock = async (accountNumber) => {
        setActionLoading(accountNumber)
        try {
            await api.put(`/api/admin/block/account/${accountNumber}`)
            toast.success('Account blocked successfully')
            fetchAccounts()
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to block account')
        } finally {
            setActionLoading(null)
        }
    }

    const handleUnblock = async (accountNumber) => {
        setActionLoading(accountNumber)
        try {
            await api.put(`/api/admin/unblock/account/${accountNumber}`)
            toast.success('Account unblocked successfully')
            fetchAccounts()
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to unblock account')
        } finally {
            setActionLoading(null)
        }
    }

    const filteredAccounts = accounts.filter(a =>
        a.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
        a.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
        a.ownerEmail?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <Navbar />
            <main className="app-page">
                <div className="content-wrap">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                        <div className="page-title mb-0">
                            <h1>All Accounts</h1>
                            <p>{accounts.length} total accounts</p>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            style={{ maxWidth: 310 }}
                            placeholder="Search accounts"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <section className="table-shell p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-success" />
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle bank-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Account No.</th>
                                            <th>Owner</th>
                                            <th>Type</th>
                                            <th>Balance</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAccounts.map((acc, i) => (
                                            <tr key={acc.accountNumber}>
                                                <td className="text-muted small">{i + 1}</td>
                                                <td className="fw-bold text-success small">{acc.accountNumber}</td>
                                                <td>
                                                    <p className="fw-bold small mb-0">{acc.ownerName}</p>
                                                    <small className="text-muted">{acc.ownerEmail}</small>
                                                </td>
                                                <td>
                                                    <span className="status-badge status-info">{acc.accountType}</span>
                                                </td>
                                                <td className="fw-bold">Rs {acc.balance.toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge ${acc.status === 'ACTIVE' ? 'status-success' : 'status-danger'}`}>
                                                        {acc.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {acc.status === 'ACTIVE' ? (
                                                        <button
                                                            className="btn-danger-soft"
                                                            disabled={actionLoading === acc.accountNumber}
                                                            onClick={() => handleBlock(acc.accountNumber)}>
                                                            {actionLoading === acc.accountNumber ? 'Working...' : 'Block'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn-success-soft"
                                                            disabled={actionLoading === acc.accountNumber}
                                                            onClick={() => handleUnblock(acc.accountNumber)}>
                                                            {actionLoading === acc.accountNumber ? 'Working...' : 'Unblock'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredAccounts.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="muted-text mb-0">No accounts found.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    )
}
