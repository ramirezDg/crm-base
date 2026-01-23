import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '../features/Auth/hooks/useAuth'
import { useEffect, useState } from 'react'
import type { LoginPayload } from '../features/Auth/types/authTypes'
import { useAlert } from './alert-context'
import { useNavigate } from 'react-router-dom'
import { useUserModules } from '../features/UserModules/hooks/useUserModules'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { showAlert } = useAlert()
    const { usersModules, loading: loadingModules, getUserModules } = useUserModules()
    const navigate = useNavigate()

    const formInitialState: LoginPayload = { email: '', password: '' }

    const { login, isAuthenticated, loading } = useAuth()
    const [form, setForm] = useState<LoginPayload>(formInitialState)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(form)
            showAlert({
                type: 'success',
                title: 'Inicio de sesión exitoso',
                description: `Bienvenido de nuevo!`,
                duration: 3000,
                position: 'top-right',
            })
        } catch (err) {
            showAlert({
                type: 'error',
                title: 'Error al iniciar sesión',
                description: 'Credenciales inválidas o error de red.',
                duration: 5000,
                position: 'top-right',
            })
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            getUserModules()
            navigate('/', { replace: true })
        }
    }, [isAuthenticated, navigate])

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='m@example.com'
                                    required
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Field>
                            <Field>
                                <div className='flex items-center'>
                                    <FieldLabel htmlFor='password'>Password</FieldLabel>
                                    <a
                                        href='#'
                                        className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id='password'
                                    type='password'
                                    required
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Field>
                            <Field>
                                <Button type='submit' onClick={handleSubmit} disabled={loading}>
                                    {loading ? 'Cargando...' : 'Login'}
                                </Button>
                                <Button variant='outline' type='button' disabled={loading}>
                                    Login with Google
                                </Button>
                                <FieldDescription className='text-center'>
                                    Don&apos;t have an account? <a href='#'>Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
