import { request } from './client.js'

export const signup = (input) => request('/auth/signup', { method: 'POST', body: input, skipAuth: true })
export const login = (input) => request('/auth/login', { method: 'POST', body: input, skipAuth: true })
export const logout = () => request('/auth/logout', { method: 'POST' })
