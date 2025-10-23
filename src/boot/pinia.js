// "async" is optional;

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default async ({ app }) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
