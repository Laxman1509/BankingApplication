import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, role }) => {
    const { token, isAdmin } = useAuth()

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (role === 'ADMIN' && !isAdmin()) {
        return <Navigate to="/dashboard" replace />
    }

    if (role === 'USER' && isAdmin()) {
        return <Navigate to="/admin" replace />
    }

    return children
}

export default PrivateRoute
