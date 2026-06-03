import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function AllUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/admin/users')
            setUsers(res.data)
        } catch {
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(u =>
        u.firstName.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <>
            <Navbar />
            <main className="app-page">
                <div className="content-wrap">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                        <div className="page-title mb-0">
                            <h1>All Users</h1>
                            <p>{users.length} total users</p>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            style={{ maxWidth: 290 }}
                            placeholder="Search users"
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
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u, i) => (
                                            <tr key={u.id}>
                                                <td className="text-muted small">{i + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="avatar">
                                                            {u.firstName[0]}{u.lastName[0]}
                                                        </span>
                                                        <span className="fw-bold small">
                                                            {u.firstName} {u.lastName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-muted small">{u.email}</td>
                                                <td>
                                                    <span className={`status-badge ${u.role === 'ADMIN' ? 'status-warning' : 'status-info'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${u.enabled ? 'status-success' : 'status-danger'}`}>
                                                        {u.enabled ? 'Active' : 'Blocked'}
                                                    </span>
                                                </td>
                                                <td className="text-muted small">{formatDate(u.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="muted-text mb-0">No users found.</p>
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
