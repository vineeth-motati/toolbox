<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'
import { NAvatar, NButton, NEllipsis, NuxtLink } from '#components'

defineProps({
    isCollapsed: {
        type: Boolean,
        required: true
    },
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const message = useMessage()

function renderIcon(option: { [key: string]: any }) {
    if (option.avatarUrl) {
        return h(NAvatar, { src: option.avatarUrl, class: 'h-7' })
    } if (option.iconName) {
        return h(IconifyIcon, { icon: option.iconName })
    }
    return null
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        message.error(error)
    }
    else {
        message.success('Logged out')
    }
}

const profileOptionsData = computed(() => [
    user.value
        ? {
                id: 'profile',
                name: () => h(NEllipsis, { style: { maxWidth: '150px' } }, { default: () => user.value?.user_metadata?.full_name || user.value?.email }),
                iconName: 'lucide:user',
                avatarUrl: user.value?.user_metadata?.avatar_url || null,
                children: [
                    {
                        id: 'logout',
                        name: () => h(NButton, { onClick: handleLogout, class: 'w-full', type: 'error' }, { default: () => 'Logout' }),
                        path: '/logout',
                        extra: 'asdfasd'
                    },
                ],
            }
        : {
                id: 'profile',
                name: () => h(NuxtLink, { to: '/auth', }, { default: () => 'Login' }),
                iconName: 'lucide:user',
                path: '/auth',
            },
])
</script>

<template>
    <NMenu
        :value="null"
        :collapsed="isCollapsed"
        :options="profileOptionsData"
        :collapsed-icon-size="24"
        :icon-size="24"
        bordered
        :indent="0"
        :root-indent="12"
        accordion
        mode="vertical"
        key-field="id"
        responsive
        label-field="name"
        children-field="children"
        :render-icon="renderIcon"
    />
</template>

<style scoped></style>
