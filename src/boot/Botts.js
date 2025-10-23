import { boot } from 'quasar/wrappers'
import { BBreadcrumb, breadcrumbPlugin } from 'bootstrap-vue-next'

export default boot(({ app }) => {
  app.component('BBreadcrumb', BBreadcrumb)

  // ⚠️ Très important : injecte le plugin
  app.use(breadcrumbPlugin)
})
