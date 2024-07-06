<script setup lang="ts">
import menuOptions from '@/data/menuOptions.json'

const activeKey = ref('')

watch(
    () => useRoute().params,
    (newParams) => {
        activeKey.value = Array.isArray(newParams?.workspace) ? newParams.workspace[0] : newParams.workspace
        activeKey.value = newParams.app ? Array.isArray(newParams?.app) ? newParams.app[0] : newParams.app : activeKey.value
    },
    { immediate: true }
)
</script>

<template>
    <div class="flex">
        <LayoutMenubar :menu-options="menuOptions" :active-key="activeKey" />
        <div class="flex flex-col w-full ml-12">
            <LayoutBreadcurmb class="w-full py-2 pr-2 min-h-14" />
            <div class="w-full h-full pb-2 pr-2">
                <div
                    class="relative w-full h-full"
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
