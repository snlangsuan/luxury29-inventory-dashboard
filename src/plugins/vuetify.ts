import '@mdi/font/css/materialdesignicons.css'
import '~/assets/scss/variables.scss'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { defaults } from '@/helpers/defaults'
import { MAIN_THEME, mainDarkTheme, mainTheme } from '@/helpers/themes'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: { ...components, VNumberInput },
    defaults,
    directives,
    icons: {
      aliases,
      defaultSet: 'mdi',
      sets: {
        mdi,
      },
    },
    ssr: false,
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainDarkTheme,
        mainTheme,
      },
      variations: {
        colors: ['primary', 'secondary', 'accent'],
        darken: 9,
        lighten: 9,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
