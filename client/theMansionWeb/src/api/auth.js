import client from './client'


export async function login(credentials) {

    const {data: token} = await client.post('/auth/login', credentials)

    localStorage.setItem('access_token', token)

    return token
}

export async function register(credentials) {
    const {data} = await client.post('/auth/register', credentials)
    return data
}