import { Separator } from '@radix-ui/react-separator'
import { AppSidebar } from '../components/app-sidebar/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '../components/ui/breadcrumb'
import { Outlet } from 'react-router-dom'
import AutoBreadcrumb from '../components/crumb/BreadCrumb'
import { ModeToggle } from '../components/mode-toggle'

const AppLayout = () => (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
                <div className='flex items-center gap-2 px-4'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator
                        orientation='vertical'
                        className='mr-2 data-[orientation=vertical]:h-4'
                    />
                    <div className='flex items-center justify-between w-full'>
                        <div className='flex-1 min-w-0'>
                            <AutoBreadcrumb />
                        </div>
                        <ModeToggle />
                    </div>
                </div>
            </header>
            <Outlet />
        </SidebarInset>
    </SidebarProvider>
)

export default AppLayout
