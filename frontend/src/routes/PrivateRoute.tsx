import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../features/Auth/hooks/useAuth'
import { SpinnerCustom } from '../components/Spinner'
import { isTokenExpired } from '../lib/jwt-status'

export default function PrivateRoute() {
    const { isAuthenticated, loading } = useAuth()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        setChecking(loading)
    }, [loading])

    // Token validation logic
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!loading && (!token || isTokenExpired(token))) {
            localStorage.removeItem('token')
            setChecking(false)
        }
    }, [loading])

    const token = localStorage.getItem('token')
    if (checking || loading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='scale-150'>
                    <SpinnerCustom />
                </div>
            </div>
        )
    }

    if (!token || isTokenExpired(token) || !isAuthenticated) {
        localStorage.removeItem('token')
        return <Navigate to='/login' replace />
    }

    return <Outlet />
}
