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
    <div class="min-w-56 h-screen pt-2 pb-2 pr-2">
        <div class="bg-gray-200 w-full h-full rounded-xl text-center p-2">
            sideview
            {{ id }}
        </div>
    </div>
</template>
