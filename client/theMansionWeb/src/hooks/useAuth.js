import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { login as loginApi, register as registerApi } from '../api/auth'
import { useNavigate } from 'react-router-dom'



export function useLogin() {

    const {login} = useAuth();

    const navigate = useNavigate()


    return useMutation({

        mutationFn: loginApi,

        onSuccess: (token) => {
            login(token)
            navigate('/')
        },

        onError: (error) => {
            console.error('Login failed: ', error.response?.data?.error)
        }
    })
}


export function useRegister() {

    const navigate = useNavigate()

    return useMutation({
        mutationFn: registerApi,

        onSuccess: () => {
            navigate('/login')
        },

        onError: (error) => {
            console.error("Register Failed: ", error.response?.data?.error)
        }
    })
}


export function useLogout() {

    const {logout} = useAuth();
    const navigate = useNavigate();

    return () => {
        logout()
        navigate('/login')
    }
}