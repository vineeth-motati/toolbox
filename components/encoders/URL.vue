<script setup lang="ts">
import { computed, ref } from 'vue'
import { NCard, NInput } from 'naive-ui'

const urlInput = ref<string>('')
const urlOutput = ref<string>('')

const encodedUrl = computed(() => {
    return encodeURIComponent(urlInput.value)
})

const decodedUrl = computed(() => {
    try {
        return decodeURIComponent(urlInput.value)
    }
    catch (e) {
        return 'Invalid URL encoding'
    }
})

function getOutput(type: 'encode' | 'decode') {
    if (type === 'encode') {
        urlOutput.value = encodedUrl.value
    }
    else {
        urlOutput.value = decodedUrl.value
    }
}

const inputElement = ref<HTMLElement | null>(null)
const outputElement = ref<HTMLElement | null>(null)
</script>

<template>
    <div class="flex space-x-4 min-h-full h-full p-4">
        <NSplit
            direction="horizontal"
            :max="0.75"
            :min="0.25"
            :resize-trigger-size="16"
        >
            <template #1>
                <div class="h-full flex flex-col">
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-xl font-semibold">
                            Input
                        </h2>
                        <div class="flex gap-2">
                            <NButton class="ml-1 text-lg" @click="getOutput('encode')">
                                <Icon class="mr-1" name="ci:link" />
                                Encode
                            </NButton>
                            <NButton class="ml-1 text-lg" @click="getOutput('decode')">
                                <Icon class="mr-1" name="ci:link-break" />
                                Decode
                            </NButton>
                        </div>
                    </div>
                    <NInput
                        ref="inputElement"
                        v-model:value="urlInput"
                        class="w-full h-full p-4 resize-none overflow-y-auto"
                        placeholder="Enter your URL here..."
                        type="textarea"
                    />
                </div>
            </template>
            <template #2>
                <div class=" h-full flex flex-col">
                    <h2 class="mb-4 text-xl font-semibold">
                        Output
                    </h2>

                    <NCard ref="outputElement" class="flex-1 overflow-hidden relative p-2">
                        <div class="right-4 w-full min-w-full ml-4 pl-10 min-h-full h-full max-h-full inset-y-5 p-4 pt-0 prose absolute overflow-y-auto" v-text="urlOutput" />
                    </NCard>
                </div>
            </template>
            <template #resize-trigger>
                <div
                    class="h-[100%] top-[50%] -translate-y-[50%] absolute cursor-ew-resize flex rounded-lg hover:bg-gray-200"
                >
                    <Icon class="self-center" name="fluent:re-order-dots-vertical-16-regular" />
                </div>
            </template>
        </NSplit>
    </div>
</template>

<style scoped>
</style>
