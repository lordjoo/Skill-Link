import axios from 'axios'

// ---------------------------------------------------------------------------
// Shared API client
// ---------------------------------------------------------------------------
// This is the ONE axios instance used by every resource file in this folder
// (auth.js, user.js, client.js, common.js). Those files import `api` from here
// and only declare their endpoints — all cross-cutting concerns (base URL, auth
// token, error handling) live here so they're configured in a single place.
//
// Base URL: set VITE_API_BASE_URL in a `.env` file to point at a different
// backend (e.g. http://localhost:3003 when running the API locally). If it is
// not set, we fall back to the deployed server. See `.env.example`.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://skilllinkapi.ddns.net'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 15000
})

// Attach the bearer token to every request when the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Clear the session on an expired/invalid token so guards send the user to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

// Sent as the 3rd axios arg when the body is a FormData (file upload) so axios
// uses the multipart content type instead of JSON.
export const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

export function isFormData(data) {
  return typeof FormData !== 'undefined' && data instanceof FormData
}

export default api
