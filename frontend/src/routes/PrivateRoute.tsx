import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../features/Auth/hooks/useAuth'
import { SpinnerCustom } from '../components/Spinner'

export default function PrivateRoute() {
    const { isAuthenticated, loading } = useAuth()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        setChecking(loading)
    }, [loading])

    if (checking) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='scale-150'>
                    <SpinnerCustom />
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }

    return <Outlet />
}
