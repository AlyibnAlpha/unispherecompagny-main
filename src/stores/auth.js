import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import axios from 'axios'
import { LocalStorage } from 'quasar'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: LocalStorage.getItem('token') || null,
    refreshToken: LocalStorage.getItem('refresh_token') || null,
    refreshTokenExpiration: LocalStorage.getItem('refresh_token_expiration') || null,
    nom: LocalStorage.getItem('nom') || null,
    expireMessage: null,
    isRefreshing: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    roles: (state) => state.user?.roles || null,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post(
          '/login_check',
          {
            email: credentials.email,
            password: credentials.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        this.token = response.data.token
        this.refreshToken = response.data.refresh_token
        this.refreshTokenExpiration = response.data.refresh_token_expiration
        LocalStorage.set('token', this.token)
        LocalStorage.set('refresh_token', this.refreshToken)
        LocalStorage.set('refresh_token_expiration', this.refreshTokenExpiration)

        const decoded = jwtDecode(this.token)

        this.user = {
          roles: decoded.roles, // assure-toi que le token contient ce champ
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        //await this.fetchUser()
        //this.scheduleTokenRefresh()
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur de connexion')
      }
    },
    async initFromToken() {
      await this.fetchUser()
      this.scheduleTokenRefresh()
    },
    async tryRefreshToken() {
      if (this.isRefreshing) return
      this.isRefreshing = true

      const refreshToken = this.refreshToken || LocalStorage.getItem('refresh_token')
      if (!refreshToken) {
        this.logout('Session expirée')
        this.isRefreshing = false
        return
      }

      const now = Math.floor(Date.now() / 1000)
      if (this.refreshTokenExpiration && now > this.refreshTokenExpiration) {
        this.logout('Session expirée, reconnectez-vous')
        this.isRefreshing = false
        return
      }

      try {
        // 🧠 Utilise un client Axios séparé sans intercepteurs
        const refreshClient = axios.create({
          baseURL: 'https://api.unispherecompagny.com/api',
          headers: { 'Content-Type': 'application/json' },
        })

        // ✅ Appel direct sans Bearer token
        const response = await refreshClient.post('/token/refresh', {
          refresh_token: refreshToken,
        })

        this.token = response.data.token
        this.refreshToken = response.data.refresh_token
        this.refreshTokenExpiration = response.data.refresh_token_expiration
        LocalStorage.set('token', this.token)
        LocalStorage.set('refresh_token', this.refreshToken)
        LocalStorage.set('refresh_token_expiration', this.refreshTokenExpiration)

        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        // Optionnel : rafraîchir les infos utilisateur
        const decoded = jwtDecode(this.token)
        this.user = { roles: decoded.roles }
      } catch (error) {
        this.logout('Votre session a expiré. Veuillez vous reconnecter.')
        console.error('Erreur lors du refresh token :', error)
      } finally {
        this.isRefreshing = false
      }
    },

    async register(userData) {
      try {
        await api.post('/users/register', userData)
      } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur d'inscription")
      }
    },
    scheduleTokenRefresh() {
      if (!this.token) return

      const decoded = jwtDecode(this.token)
      if (!decoded.exp) return

      const now = Date.now() / 1000
      const expiresIn = decoded.exp - now
      const refreshTime = (expiresIn - 60) * 1000 // 1 min avant expiration

      if (refreshTime <= 0) return // déjà expiré

      setTimeout(async () => {
        await this.tryRefreshToken()
        // boucle continue après refresh
      }, refreshTime)
    },

    logout(message = null) {
      this.expireMessage = message
      this.user = null
      this.refresh_token = null
      this.nom = null
      this.refreshTokenExpiration = null
      this.token = null
      this.isRefreshing = false

      LocalStorage.remove('nom')
      LocalStorage.remove('token')
      LocalStorage.remove('refresh_token')
      LocalStorage.remove('refresh_token_expiration')
      delete api.defaults.headers.common['Authorization']
      this.$reset()
      LocalStorage.clear()
    },

    async fetchUser() {
      if (!this.token) return
      try {
        const decoded = jwtDecode(this.token)
        const now = Date.now() / 1000
        if (decoded.exp && decoded.exp < now) {
          // 🔒 Token expiré
          await this.tryRefreshToken()
        }

        const response = await api.get('/users/me')
        this.user = {
          // Assure-toi que le token contient ce champ
          roles: decoded.roles,
          isSuperAdmin: response.data?.admin?.isSuperAdmin || false,
        }

        // ⚠️ IMPORTANT : remettre le header Authorization
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } catch {
        this.logout('Votre session a expiré. Veuillez vous reconnecter.')
      }
    },
  },
  persist: true,
})
