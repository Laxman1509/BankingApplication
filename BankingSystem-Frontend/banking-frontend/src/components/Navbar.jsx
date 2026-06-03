import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { logout, isAdmin } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand-lg glass-nav px-3">
            <div className="container-fluid content-wrap px-0">
                <Link className="navbar-brand brand-lockup d-flex align-items-center gap-2" to="/">
                    <span className="brand-mark">BS</span>
                    <span>Banking System</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    aria-expanded={open}
                    aria-label="Toggle navigation"
                    onClick={() => setOpen(value => !value)}>
                    <span className="navbar-toggler-icon" />
                </button>

                <div className={`${open ? '' : 'collapse'} navbar-collapse`} id="navMenu">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1 mt-3 mt-lg-0">
                        {!isAdmin() && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-pill" to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-pill" to="/create-account" onClick={() => setOpen(false)}>New Account</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-pill" to="/deposit" onClick={() => setOpen(false)}>Deposit</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-pill" to="/withdraw" onClick={() => setOpen(false)}>Withdraw</Link>
                                </li>
                            </>
                        )}

                        {isAdmin() && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-pill" to="/admin" onClick={() => setOpen(false)}>Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-pill" to="/admin/users" onClick={() => setOpen(false)}>Users</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-pill" to="/admin/accounts" onClick={() => setOpen(false)}>Accounts</Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item ms-lg-2">
                            <button className="btn-soft" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
