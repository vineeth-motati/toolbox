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
    <NCard class="absolute inset-0 overflow-y-auto" hoverable>
        <div v-if="isComponentLoaded" class="relative h-full">
            <component :is="ComponentName" class="h-full" />
        </div>
        <div v-else>
            <NSkeleton class="absolute inset-0 h-full rounded-xl" />
            <NEmpty class="absolute inset-0 justify-center h-full text-xl text-center rounded-xl" description="Component is in development">
                <template #icon>
                    <Icon name="iconoir:hexagon-dice" class="self-center justify-center text-5xl text-center " />
                </template>
            </NEmpty>
        </div>
    </NCard>
</template>
