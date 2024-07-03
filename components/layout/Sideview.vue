<script setup lang="ts">
// Define props
defineProps({
    id: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <div class="h-screen pt-2 pb-2 pr-2 min-w-56">
        <div class="w-full h-full p-2 text-center bg-gray-200 rounded-xl">
            sideview
            {{ id }}
        </div>
    </div>
</template>
