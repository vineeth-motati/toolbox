<script setup lang="ts">
import { onMounted, ref } from 'vue'
import workspaceConfig from '@/data/workspaceConfig.json'

const workspaces = workspaceConfig.top
const activeWorkspace = ref(workspaces[0])
const activeWorkspaceApps = ref(activeWorkspace.value.apps)
const sideviewActive = ref(false)
const activeSideviewId = ref('')
// Function to update active workspace and its apps
function updateActiveWorkspace(workspaceId: string) {
    const workspace = workspaces.find(ws => ws.id === workspaceId)
    if (workspace) {
        activeWorkspace.value = workspace
        activeWorkspaceApps.value = workspace.apps
    }
}

// Function to toggle the sideview
function toggleSideview(showSideview: boolean, activeSideview: string) {
    sideviewActive.value = showSideview
    if (showSideview) {
        activeSideviewId.value = activeSideview
    }
    else {
        activeSideviewId.value = ''
    }
}

// Set default active workspace and its apps
onMounted(() => {
    const route = useRoute()
    const workspaceId = Array.isArray(route.params?.workspace) ? route.params.workspace[0] : route.params.workspace
    updateActiveWorkspace(workspaceId || workspaces?.[0]?.id)
})
</script>

<template>
    <div class="flex">
        <LayoutSidebar
            :spaces="workspaceConfig"
            @sideview-toggled="toggleSideview"
            @workspace-changed="updateActiveWorkspace"
        />
        <LayoutSideview v-if="sideviewActive" :id="activeSideviewId" />
        <div class="flex flex-col w-full">
            <LayoutTopbar
                :apps="activeWorkspaceApps"
                :workspace="activeWorkspace.id"
            />
            <div class="w-full h-full pb-2 pr-2">
                <div
                    class="relative w-full h-full overflow-hidden rounded-xl"
                >
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Style for custom scrollbar */
::-webkit-scrollbar {
    width: 4px; /* Width of the scrollbar */
}

::-webkit-scrollbar-track {
    display: none; /* Hidden scrollbar track */
    background: rgba(0, 0, 0, 0); /* Transparent background */
}

::-webkit-scrollbar-thumb {
    background-color: #888; /* Color of the scrollbar thumb */
    border-radius: 4px; /* Rounded corners for the thumb */
}

::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Color of the scrollbar thumb on hover */
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
