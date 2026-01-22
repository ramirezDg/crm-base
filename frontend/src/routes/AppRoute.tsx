import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import { lazy } from 'react'
import { Suspense } from 'react'
import AppSkeleton from '../components/skeletons/AppSkeleton'
import AppLayout from '../layouts/AppLayout'
import Seo from '../components/Seo'

const Home = lazy(() => import('../pages/Home'))
const Dashboard = lazy(() => import('../features/Dashboard/components/Dashboard'))
const Login = lazy(() => import('../features/Auth/components/Login'))

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path='/login' element={<Login />} />
                </Route>
                <Route element={<PublicRoute />}>
                    <Route element={<PublicRoute />}>
                        <Route element={<AppLayout />}>
                            {/* Home */}
                            <Route
                                path='/home'
                                element={
                                    <>
                                        <Seo
                                            title='Home | CRM'
                                            description='Página principal del CRM'
                                        />
                                        <Home />
                                    </>
                                }
                            />

                            {/* Dashboard */}
                            <Route
                                path='/dashboard'
                                element={
                                    <>
                                        <Seo
                                            title='Dashboard | CRM'
                                            description='Panel de control del CRM'
                                        />
                                        <Dashboard />
                                    </>
                                }
                            />
                        </Route>
                    </Route>
                    <Route path='/dashboard' element={<Dashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
