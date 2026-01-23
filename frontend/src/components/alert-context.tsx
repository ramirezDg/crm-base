import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react'
import { CustomAlert } from './alert/custom-alert'

export type AlertType = 'success' | 'info' | 'warning' | 'error'

type AlertPosition =
    | 'top-center'
    | 'top-right'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'bottom-left'

interface AlertState {
    open: boolean
    type: AlertType
    title: ReactNode
    description?: ReactNode
    duration?: number
    position?: AlertPosition
}

interface AlertContextProps {
    showAlert: (options: Omit<AlertState, 'open'>) => void
    closeAlert: () => void
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined)

export function useAlert() {
    const ctx = useContext(AlertContext)
    if (!ctx) throw new Error('useAlert debe usarse dentro de AlertProvider')
    return ctx
}

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alert, setAlert] = useState<AlertState | null>(null)

    useEffect(() => {
        if (alert?.open && alert.duration) {
            const timer = setTimeout(() => setAlert(null), alert.duration)
            return () => clearTimeout(timer)
        }
    }, [alert])

    const showAlert = useCallback((options: Omit<AlertState, 'open'>) => {
        setAlert({ ...options, open: true })
    }, [])

    const closeAlert = useCallback(() => {
        setAlert(null)
    }, [])

    // Posiciones CSS
    const getPositionClass = (position?: AlertPosition) => {
        switch (position) {
            case 'top-right':
                return 'fixed top-4 right-4'
            case 'top-left':
                return 'fixed top-4 left-4'
            case 'bottom-center':
                return 'fixed bottom-4 left-1/2 -translate-x-1/2'
            case 'bottom-right':
                return 'fixed bottom-4 right-4'
            case 'bottom-left':
                return 'fixed bottom-4 left-4'
            case 'top-center':
            default:
                return 'fixed top-4 left-1/2 -translate-x-1/2'
        }
    }

    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            {alert?.open && (
                <div className={`${getPositionClass(alert.position)} z-50 w-full max-w-md`}>
                    <CustomAlert
                        type={alert.type}
                        title={alert.title}
                        description={alert.description}
                    />
                </div>
            )}
        </AlertContext.Provider>
    )
}
