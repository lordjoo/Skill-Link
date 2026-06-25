import api from './apiClient'

// Authentication endpoints (login, register, password reset).
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  forgetPassword: (data) => api.post('/auth/forget-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data)
}
