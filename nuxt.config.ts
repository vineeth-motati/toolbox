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
    ],
    typescript: {
        shim: false
    }
})
