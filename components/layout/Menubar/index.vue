<script setup>
import { computed, h, ref } from 'vue'
import { NMenu } from 'naive-ui'
import { Icon as IconifyIcon } from '@iconify/vue'
import { NuxtLink } from '#components'

const props = defineProps({
    menuOptions: {
        type: Array,
        required: true
    },
    activeKey: {
        type: String,
        required: false
    }
})
const isCollapsed = ref(true)

const menuOptionsData = computed(() =>
    props.menuOptions.map(option => ({
        ...option,
        name: option.path
            ? () => h(NuxtLink, { to: option.path }, { default: () => option.name })
            : option.name,
        children: option?.children
            ? option.children.map(child => ({
                ...child,
                name: () => h(NuxtLink, { to: child.path }, { default: () => child.name })
            }))
            : undefined
    }))
)

function renderIcon(option) {
    if (option.iconName) {
        return h(IconifyIcon, { icon: option.iconName })
    }
    return null
}

function handleMenuClick(key, item) {
    console.info(`Menu item clicked: ${item.name}, Path: ${item.path}`)
}
</script>

<template>
    <div
        class="flex flex-col h-screen relative"
        @mouseenter="isCollapsed = false"
        @mouseleave="isCollapsed = true"
    >
        <div
            class="side-menu absolute top-0 inset-y-0 left-0 transition-all duration-400 mt-14 z-10 bg-white"
            :class="isCollapsed ? 'w-12' : 'w-60 shadow-2xl'"
        >
            <div
                class="p-2 fixed top-0 left-0 z-10 bg-white transition-all duration-400"
                :class="isCollapsed ? 'w-12' : 'w-60'"
            >
                <NuxtLink class="w-9 h-9" to="/">
                    <Icon class="w-9 h-9" name="iconoir:hexagon-dice" />
                </NuxtLink>
            </div>
            <div class="flex flex-col justify-between h-full">
                <NMenu
                    :value="activeKey || null"
                    :collapsed="isCollapsed"
                    :options="menuOptionsData"
                    :collapsed-icon-size="24"
                    :icon-size="24"
                    bordered
                    :indent="32"
                    :root-indent="12"
                    accordion
                    mode="vertical"
                    key-field="id"
                    label-field="name"
                    children-field="children"
                    :render-icon="renderIcon"
                    @update:value="handleMenuClick"
                />
                <LayoutMenubarProfileOptions :is-collapsed="isCollapsed" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
