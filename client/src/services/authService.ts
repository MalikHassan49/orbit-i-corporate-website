import { apiClient, setAccessToken } from './apiClient'
import type { ApiResponse, User } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface AuthResult {
  user: User
  accessToken: string
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>('/auth/login', payload)
    setAccessToken(data.data.accessToken)
    return data.data.user
  },

  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>('/auth/register', payload)
    setAccessToken(data.data.accessToken)
    return data.data.user
  },

  async logout() {
    await apiClient.post('/auth/logout')
    setAccessToken(null)
  },

  async me() {
    const { data } = await apiClient.get<ApiResponse<User>>('/users/me')
    return data.data
  },

  async forgotPassword(email: string) {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email })
    return data.message
  },

  async resetPassword(token: string, password: string) {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/reset-password', { token, password })
    return data.message
  },
}
