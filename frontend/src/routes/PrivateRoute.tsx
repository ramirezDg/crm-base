import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function PrivateRoute() {
    const token = useAuthStore(state => state.isAuthenticated)

    if (!token) {
        return <Navigate to='/login' replace />
    }

    return <Outlet />
}
