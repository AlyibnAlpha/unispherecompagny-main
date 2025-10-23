import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { route } from 'quasar/wrappers'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
import { useAuthStore } from 'stores/auth'
import { nextTick } from 'vue'
import { Notify } from 'quasar'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  nextTick(() => {
    Router.beforeEach((to, from, next) => {
      const auth = useAuthStore()

      if (to.meta.requiresAuth && !auth.isAuthenticated) {
        Notify.create({
          type: 'warning',
          message: 'Veuillez vous reconnecter',
        })
        return next('/login')
      }

      if (to.meta.roles) {
        const userRoles = [...(auth.roles || [])]
        const allowedRoles = to.meta.roles

        const hasAccess = userRoles.some((role) => allowedRoles.includes(role))

        if (!hasAccess) {
          return next('/unauthorized') // assure-toi que cette page existe
        }
      }
      if (to.path === '/admin/gestions-admin' && auth.user?.isSuperAdmin === false) {
        Notify.create({
          type: 'negative',
          message: "Vous n'avez pas accès à cette page",
        })
        return next('/unauthorized') // redirige vers dashboard ou autre page
      }

      next()
    })
  })
  return Router
})
