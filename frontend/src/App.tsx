import { AlertProvider } from './components/alert-context'
import { ThemeProvider } from './components/providers/theme-provider'
import AppRouter from './routes/AppRoute'

function App() {
    return (
        <>
            <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
                <AlertProvider>
                    <AppRouter />
                </AlertProvider>
            </ThemeProvider>
        </>
    )
}

export default App
