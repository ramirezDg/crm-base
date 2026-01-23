import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import { lazy } from 'react'
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
                    <Route
                        path='/login'
                        element={
                            <>
                                <Seo title='Login | CRM' description='Inicia sesión en el CRM' />
                                <Login />
                            </>
                        }
                    />
                    <Route path='/login' element={<Login />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route element={<AppLayout />}>
                        {/* Home */}
                        <Route
                            path='/'
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
                        {/* Users */}
                        <Route
                            path='/us'
                            element={
                                <>
                                    <Seo title='Users | CRM' description='Users page' />
                                    {/* Main Users component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo title='Users List | CRM' description='Users page' />
                                        <h1>Users</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Users | CRM'
                                            description='User management'
                                        />
                                        <h1>Users</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Permission */}
                        <Route
                            path='/pe'
                            element={
                                <>
                                    <Seo title='Permission | CRM' description='Permission page' />
                                    {/* Main Permission component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo
                                            title='Permission List | CRM'
                                            description='Permission page'
                                        />
                                        <h1>Permission</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Permission | CRM'
                                            description='Permission management'
                                        />
                                        <h1>Permission</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Files */}
                        <Route
                            path='/fi'
                            element={
                                <>
                                    <Seo title='Files | CRM' description='Files page' />
                                    {/* Main Files component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo title='Files List | CRM' description='Files page' />
                                        <h1>Files</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Files | CRM'
                                            description='Files management'
                                        />
                                        <h1>Files</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Error Logs */}
                        <Route
                            path='/erlo'
                            element={
                                <>
                                    <Seo title='Error Logs | CRM' description='Error Logs page' />
                                    {/* Main Error Logs component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo
                                            title='Error Logs List | CRM'
                                            description='Error Logs page'
                                        />
                                        <h1>Error Logs</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Error Logs | CRM'
                                            description='Error Logs management'
                                        />
                                        <h1>Error Logs</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Entities */}
                        <Route
                            path='/en'
                            element={
                                <>
                                    <Seo title='Entities | CRM' description='Entities page' />
                                    {/* Main Entities component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo
                                            title='Entities List | CRM'
                                            description='Entities page'
                                        />
                                        <h1>Entities</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Entities | CRM'
                                            description='Entities management'
                                        />
                                        <h1>Entities</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Custom Field */}
                        <Route
                            path='/cufi'
                            element={
                                <>
                                    <Seo
                                        title='Custom Field | CRM'
                                        description='Custom Field page'
                                    />
                                    {/* Main Custom Field component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Field List | CRM'
                                            description='Custom Field page'
                                        />
                                        <h1>Custom Field</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Custom Field | CRM'
                                            description='Custom Field management'
                                        />
                                        <h1>Custom Field</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Custom Field Value */}
                        <Route
                            path='/cufiva'
                            element={
                                <>
                                    <Seo
                                        title='Custom Field Value | CRM'
                                        description='Custom Field Value page'
                                    />
                                    {/* Main Custom Field Value component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Field Value List | CRM'
                                            description='Custom Field Value page'
                                        />
                                        <h1>Custom Field Value</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Custom Field Value | CRM'
                                            description='Custom Field Value management'
                                        />
                                        <h1>Custom Field Value</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Entity Definition */}
                        <Route
                            path='/ende'
                            element={
                                <>
                                    <Seo
                                        title='Entity Definition | CRM'
                                        description='Entity Definition page'
                                    />
                                    {/* Main Entity Definition component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo
                                            title='Entity Definition List | CRM'
                                            description='Entity Definition page'
                                        />
                                        <h1>Entity Definition</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Entity Definition | CRM'
                                            description='Entity Definition management'
                                        />
                                        <h1>Entity Definition</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Role Permission */}
                        <Route
                            path='/rope'
                            element={
                                <>
                                    <Seo
                                        title='Role Permission | CRM'
                                        description='Role Permission page'
                                    />
                                    {/* Main Role Permission component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo
                                            title='Role Permission List | CRM'
                                            description='Role Permission page'
                                        />
                                        <h1>Role Permission</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Role Permission | CRM'
                                            description='Role Permission management'
                                        />
                                        <h1>Role Permission</h1>
                                    </>
                                }
                            />
                        </Route>
                        {/* Activity Logs */}
                        <Route
                            path='/aclo'
                            element={
                                <>
                                    <Seo
                                        title='Activity Logs | CRM'
                                        description='Activity Logs page'
                                    />
                                    {/* Main Activity Logs component goes here */}
                                </>
                            }
                        >
                            <Route
                                path='list'
                                element={
                                    <>
                                        <Seo
                                            title='Activity Logs List | CRM'
                                            description='Activity Logs list page'
                                        />
                                        <h1>Activity Logs</h1>
                                    </>
                                }
                            />
                            <Route
                                path='custom'
                                element={
                                    <>
                                        <Seo
                                            title='Custom Activity Logs | CRM'
                                            description='Activity Logs management'
                                        />
                                        <h1>Activity Logs</h1>
                                    </>
                                }
                            />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
