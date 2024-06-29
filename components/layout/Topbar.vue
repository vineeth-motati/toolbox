<script setup lang="ts">
interface App {
    id: string
    label: string
    route: string
}
defineProps({
    workspace: {
        type: String,
        required: true,
    },
    apps: {
        type: Array<App>,
        required: true,
    },
})

// Check if app is active
function isActive(appId: string) {
    const route = useRoute()
    return route.params.app === appId
}
</script>

<template>
    <div class="w-full min-h-14 py-2 pr-2">
        <div class="w-full h-full rounded-xl bg-gray-200">
            <ul class="flex flex-row items-center">
                <li v-for="app in apps" :key="app.id" class="mr-2">
                    <NuxtLink class="block" :to="`/${workspace}/${app.id}`">
                        <span
                            class="inline-block py-2 px-4 hover:bg-gray-300 rounded-xl"
                            :class="{ 'bg-gray-300': isActive(app.id) }"
                        >
                            {{ app.label }}
                        </span>
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>
