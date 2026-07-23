import { request } from './client.js'

export const getMe = () => request('/users/me')
