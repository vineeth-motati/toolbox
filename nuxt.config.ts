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
        '@sidebase/nuxt-auth',
        '@nuxtjs/supabase'
    ],
    auth: { provider: { type: 'authjs' } },
    typescript: {
        shim: false
    },
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        redirectOptions: {
            login: '/auth',
            callback: '/auth'
        }
    }
})
