import { ThemeProvider } from './components/providers/theme-provider'
import AppRouter from './routes/AppRoute'

function App() {
    return (
        <>
            <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
                <AppRouter />
            </ThemeProvider>
        </>
    )
}

export default App
