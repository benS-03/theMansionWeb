import { createContext, useContext, useState } from "react";



const AuthContext = createContext(null)


export function AuthProvider({children}){

    const [token, setToken] = useState( localStorage.getItem('access_token'))

    const login = (token) => {
        localStorage.setItem('access_token', token)
        setToken(token)
    }

    const logout = () => {
        localStorage.removeItem('acess_token')
        setToken(null)
    }

    const isLoggedIn = !!token

    return <AuthContext.Provider value={{token, login, logout, isLoggedIn}}>
        {children}
    </AuthContext.Provider>
}

//Hello git hub work
export function useAuth() {
    return useContext(AuthContext)
}