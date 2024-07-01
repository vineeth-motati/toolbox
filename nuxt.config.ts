// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    build: {
        transpile: [
            'trpc-nuxt'
        ]
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@bg-dev/nuxt-naiveui',
        'nuxt-icon',
        '@sidebase/nuxt-auth'
    ],
    auth: { provider: { type: 'authjs' } },
    typescript: {
        shim: false
    }
})
