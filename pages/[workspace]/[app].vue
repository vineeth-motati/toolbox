<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const appName = ref(route.params.app)
const workspaceName = ref(route.params.workspace)

const componentExists = ref(true)
const ComponentName = defineAsyncComponent(() =>
    import(`@/components/${workspaceName.value}/${appName.value}.vue`).catch(() => {
        componentExists.value = false
        return null
    })
)

onMounted(() => {
    appName.value = route.params.app
    workspaceName.value = route.params.workspace
})

const isComponentLoaded = computed(() =>
    appName.value && workspaceName.value && componentExists.value
)
</script>

<template>
    <NCard class=" absolute inset-0 overflow-y-auto" hoverable>
        <div v-if="isComponentLoaded" class="h-full relative">
            <component :is="ComponentName" class="h-full" />
        </div>
        <p v-else>
            Component is in development
        </p>
    </NCard>
</template>
