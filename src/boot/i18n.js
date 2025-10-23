import { createI18n } from 'vue-i18n'
import localeMessages from '../app/modules/locales/index'
const locale = 'fr'

export default async ({ app }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale || 'en',
    fallbackLocale: 'en',
    messages: { ...localeMessages },
  })
  app.use(i18n)
}
