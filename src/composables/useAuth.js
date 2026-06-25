import { reactive, computed } from 'vue'
import { authAPI } from '@/api'

// Shared auth state, restored from localStorage so a refresh keeps the session.
const state = reactive({
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null')
})

function persist() {
  if (state.token) localStorage.setItem('token', state.token)
  else localStorage.removeItem('token')

  if (state.user) localStorage.setItem('user', JSON.stringify(state.user))
  else localStorage.removeItem('user')
}

// The API response shape isn't fixed, so pull the token/user from the
// most common locations instead of assuming one layout.
function extractToken(payload) {
  return payload.token || payload.accessToken || payload.data?.token || ''
}

function extractUser(payload) {
  return payload.user || payload.data?.user || null
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(state.token))
  const userType = computed(() => state.user?.type || state.user?.user_type || null)

  async function login(credentials) {
    const { data } = await authAPI.login(credentials)
    state.token = extractToken(data)
    state.user = extractUser(data) || { email: credentials.email, type: credentials.type }
    persist()
    return state.user
  }

  async function register(payload) {
    const { data } = await authAPI.register(payload)
    // Some backends log the user in on register; keep the session if so.
    const token = extractToken(data)
    if (token) {
      state.token = token
      state.user = extractUser(data) || { username: payload.username, email: payload.email, type: payload.type }
      persist()
    }
    return data
  }

  function logout() {
    state.token = ''
    state.user = null
    persist()
  }

  // Dashboard route after auth depends on the account type.
  // (The public landing page lives at '/'.)
  function homeRoute() {
    return userType.value === 'client' ? '/client-home' : '/home'
  }

  return { state, isAuthenticated, userType, login, register, logout, homeRoute }
}
