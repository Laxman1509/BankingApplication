/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)

    const decodeToken = (tokenValue) => {
        try {
            return JSON.parse(atob(tokenValue.split('.')[1]))
        } catch {
            return null
        }
    }

    const user = useMemo(() => token ? decodeToken(token) : null, [token])

    const login = (newToken, role) => {
        localStorage.setItem('token', newToken)
        localStorage.setItem('role', role)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.clear()
        setToken(null)
    }

    const isAdmin = () => localStorage.getItem('role') === 'ADMIN'

    const isUser = () => localStorage.getItem('role') === 'USER'

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAdmin,
            isUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
