import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { LocalStorage } from 'quasar'

const api = axios.create({
  baseURL: 'https://api.unispherecompagny.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
//&& !config.url.includes('/token/refresh')
api.interceptors.request.use((config) => {
  const token = LocalStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Évite boucle infinie
      originalRequest._retry = true
      try {
        // Essaye de refresh le token
        await authStore.tryRefreshToken()

        if (authStore.token) {
          originalRequest.headers.Authorization = `Bearer ${authStore.token}`
          return api(originalRequest)
        }
      } catch {
        authStore.logout('Session expirée')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default boot(async ({ store }) => {
  const authStore = useAuthStore(store)
  const token = LocalStorage.getItem('token')

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    await authStore.fetchUser() // Charge les infos de l'utilisateur
  }
})

export { api }
