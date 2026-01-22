import { useEffect } from 'react'

interface SeoProps {
    title: string
    description?: string
}

const Seo = ({ title, description }: SeoProps) => {
    useEffect(() => {
        document.title = title
        if (description) {
            const meta = document.querySelector('meta[name="description"]')
            if (meta) {
                meta.setAttribute('content', description)
            } else {
                const metaTag = document.createElement('meta')
                metaTag.name = 'description'
                metaTag.content = description
                document.head.appendChild(metaTag)
            }
        }
    }, [title, description])

    return null
}

export default Seo
