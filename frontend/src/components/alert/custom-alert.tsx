import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2Icon, InfoIcon, AlertTriangleIcon, XCircleIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const ICONS = {
    success: <CheckCircle2Icon className='text-green-500' />,
    info: <InfoIcon className='text-blue-500' />,
    warning: <AlertTriangleIcon className='text-yellow-500' />,
    error: <XCircleIcon className='text-red-500' />,
}

type AlertType = 'success' | 'info' | 'warning' | 'error'

interface CustomAlertProps {
    type?: AlertType
    title: ReactNode
    description?: ReactNode
    icon?: ReactNode
    className?: string
    children?: ReactNode
}

export function CustomAlert({
    type = 'info',
    title,
    description,
    icon,
    className = '',
    children,
}: CustomAlertProps) {
    return (
        <Alert className={className}>
            {icon ?? ICONS[type]}
            <AlertTitle>{title}</AlertTitle>
            {description && <AlertDescription>{description}</AlertDescription>}
            {children}
        </Alert>
    )
}
