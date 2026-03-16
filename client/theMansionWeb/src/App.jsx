import { BrowserRouter } from 'react-router-dom'
import { useLogin, useLogout } from './hooks/useAuth'
import { useAuth } from './context/AuthContext'

function AuthTest() {
    const { token, isLoggedIn } = useAuth()
    const { mutate: login, isPending, error } = useLogin()
    const logout = useLogout()

    const handleLogin = () => {
        login({ username: 'dogbless', password: 'Purpleben7*' })
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Auth Test</h2>

            <p>isLoggedIn: {String(isLoggedIn)}</p>
            <p>token: {token ? token.slice(0, 30) + '...' : 'none'}</p>

            {error && <p style={{ color: 'red' }}>
                {error.response?.data?.error || 'Login failed'}
            </p>}

            <button onClick={handleLogin} disabled={isPending}>
                {isPending ? 'Logging in...' : 'Test Login'}
            </button>

            <button onClick={logout} style={{ marginLeft: 10 }}>
                Test Logout
            </button>
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthTest />
        </BrowserRouter>
    )
}