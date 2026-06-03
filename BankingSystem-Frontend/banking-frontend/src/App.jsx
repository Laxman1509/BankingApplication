import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User Pages
import UserDashboard from './pages/user/UserDashboard'
import CreateAccount from './pages/user/CreateAccount'
import Deposit from './pages/user/Deposit'
import Withdraw from './pages/user/Withdraw'
import Passbook from './pages/user/Passbook'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AllUsers from './pages/admin/AllUsers'
import AllAccounts from './pages/admin/AllAccounts'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>

                    {/* ✅ Default → Login */}
                    <Route path="/"
                        element={<Navigate to="/login" replace />}
                    />

                    {/* ✅ Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ✅ User Routes */}
                    <Route path="/dashboard"
                        element={
                            <PrivateRoute role="USER">
                                <UserDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/create-account"
                        element={
                            <PrivateRoute role="USER">
                                <CreateAccount />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/deposit"
                        element={
                            <PrivateRoute role="USER">
                                <Deposit />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/withdraw"
                        element={
                            <PrivateRoute role="USER">
                                <Withdraw />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/passbook/:accountNumber"
                        element={
                            <PrivateRoute role="USER">
                                <Passbook />
                            </PrivateRoute>
                        }
                    />

                    {/* ✅ Admin Routes */}
                    <Route path="/admin"
                        element={
                            <PrivateRoute role="ADMIN">
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/admin/users"
                        element={
                            <PrivateRoute role="ADMIN">
                                <AllUsers />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/admin/accounts"
                        element={
                            <PrivateRoute role="ADMIN">
                                <AllAccounts />
                            </PrivateRoute>
                        }
                    />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App

