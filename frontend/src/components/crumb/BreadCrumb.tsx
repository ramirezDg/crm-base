import { Link, useLocation } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { useUserModulesStore } from '../../store/useUserModulesStore'

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ')

const AutoBreadcrumb = () => {
    const location = useLocation()
    const { modules } = useUserModulesStore()
    const paths = location.pathname.split('/').filter(Boolean)

    const currentModule = modules.find(module => location.pathname.startsWith(module.path))

    const subSection = paths.length > 1 ? paths[paths.length - 1] : null
    const showSubSection = subSection && (subSection === 'list' || subSection === 'custom')

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink asChild>
                        <Link to='/'>Inicio</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {currentModule && (
                    <>
                        <BreadcrumbSeparator className='hidden md:block' />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{currentModule.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
                {showSubSection && (
                    <>
                        <BreadcrumbSeparator className='hidden md:block' />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{capitalize(subSection)}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default AutoBreadcrumb
