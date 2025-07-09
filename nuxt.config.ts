// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown.min.css',
        },
      ],
    },
  },

  css: [
    '~/styles/main.css',
  ],

  colorMode: {
    classSuffix: '',
    storage: 'cookie',
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: 'latest',

  eslint: {
    config: {
      standalone: true,
    },
  },
})
