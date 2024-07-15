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
        '@nuxtjs/supabase'
    ],

    supabase: {
        redirectOptions: {
            login: '/auth',
            callback: '/',
            include: ['/encoders(/*)?'],
            exclude: [],
            cookieRedirect: false,
        }
    },
    typescript: {
        shim: false
    }
})
