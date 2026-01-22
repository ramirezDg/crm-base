import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

function PublicRoute() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    return !isAuthenticated ? <Outlet /> : <Navigate to='/home' />
}

export default PublicRoute
