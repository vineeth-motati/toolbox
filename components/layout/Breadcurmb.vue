<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import menuData from '@/data/menuOptions.json'

const route = useRoute()

const breadcrumbItems = computed(() => {
    const path = route.path
    const pathSegments = path.split('/').filter(Boolean)

    const items = []
    let currentPath = ''

    for (const segment of pathSegments) {
        currentPath += `/${segment}`
        const category = menuData.find(cat => cat.id === segment)

        if (category) {
            items.push({ name: category.name, path: currentPath })
        }
        else {
            const child = menuData
                .flatMap(cat => cat.children)
                .find(child => child.path === currentPath)

            if (child) {
                items.push({ name: child.name, path: child.path })
            }
        }
    }

    return items
})
</script>

<template>
    <NBreadcrumb class="p-2 content-center">
        <NBreadcrumbItem>
            <NuxtLink to="/">
                Vineeth's Devtoys
            </NuxtLink>
        </NBreadcrumbItem>
        <NBreadcrumbItem v-for="item in breadcrumbItems" :key="item.path" class="ml-2">
            <NuxtLink :to="item.path">
                {{ item.name }}
            </NuxtLink>
        </NBreadcrumbItem>
    </NBreadcrumb>
</template>
