<script setup lang="ts">
interface Workspace {
    id: string
    label: string
    icon?: string
    apps: Array<any>
}

interface WorkspaceConfig {
    top: Array<Workspace>
    middle: Workspace
    bottom: Array<Workspace>
}

// Define props
defineProps({
    spaces: {
        type: Object as () => WorkspaceConfig,
        required: true,
    },
})

// Define emits
const $emit = defineEmits(['workspaceChanged', 'sideviewToggled'])
const showSideview = ref(false)
const activeSideview = ref('')

function updateActiveWorkspace(workspaceId: string) {
    // Emit an event to notify the parent component about the selected workspace
    $emit('workspaceChanged', workspaceId)
}

// Function to toggle the sideview
function toggleSideview(sideviewId: string) {
    if (activeSideview.value === sideviewId) {
        showSideview.value = false
        activeSideview.value = ''
    }
    else {
        activeSideview.value = sideviewId
        showSideview.value = true
    }
    // Emit an event to toggle the sideview
    $emit('sideviewToggled', showSideview.value, activeSideview.value)
}

// Check if workspace is active
function isActive(workspaceId: string) {
    const route = useRoute()
    return route.params.workspace === workspaceId
}
</script>

<template>
    <div class="h-screen p-2 min-w-20">
        <div class="flex flex-col w-full h-full pt-2 text-center bg-gray-200 rounded-xl">
            <!-- Sidebar logo -->
            <NuxtLink class="block" to="/">
                <Icon class="w-9 h-9" color="" name="iconoir:hexagon-dice" />
            </NuxtLink>

            <!-- Sidebar navigation -->
            <div class="flex flex-col justify-between grow">
                <!-- Top navigation -->
                <ul class="mt-4">
                    <li v-for="workspace in spaces.top" :key="workspace.id" class="mb-2">
                        <NuxtLink
                            class="block px-4 py-2 btn rounded-xl hover:bg-gray-300"
                            :class="{ 'bg-gray-300': isActive(workspace.id) }"
                            :to="`/${workspace.id}`"
                            @click="updateActiveWorkspace(workspace.id)"
                        >
                            <Icon v-if="workspace?.icon" class="w-6 h-6" :name="workspace?.icon" />
                            <span v-else>{{ workspace.label }}</span>
                        </NuxtLink>
                    </li>
                </ul>

                <!-- Middle navigation -->
                <ul>
                    <li v-for="workspace in spaces.middle?.apps" :key="workspace.id" class="mt-2">
                        <div
                            class="block px-4 py-2 rounded-xl hover:bg-gray-300"
                            :class="{ 'bg-gray-300': isActive(workspace.id) }"
                            @click="toggleSideview(workspace.id)"
                        >
                            <Icon v-if="workspace?.icon" class="w-6 h-6" :name="workspace?.icon" />
                            <span v-else>{{ workspace.label }}</span>
                        </div>
                    </li>
                </ul>

                <!-- Bottom navigation -->
                <ul class="mt-4">
                    <li v-for="workspace in spaces.bottom" :key="workspace.id" class="mt-2">
                        <NuxtLink
                            class="block px-4 py-2 rounded-xl hover:bg-gray-300"
                            :class="{ 'bg-gray-300': isActive(workspace.id) }"
                            :to="`/${workspace.id}`"
                            @click="updateActiveWorkspace(workspace.id)"
                        >
                            <Icon v-if="workspace?.icon" class="w-6 h-6" :name="workspace?.icon" />
                            <span v-else>{{ workspace.label }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
