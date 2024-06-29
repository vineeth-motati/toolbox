<script setup lang="ts">
import { computed, ref } from 'vue'
import { NCard, NInput } from 'naive-ui'
import { marked } from 'marked'

const markdownText = ref<string>('')

const parsedMarkdown = computed(() => {
    return marked(markdownText.value)
})

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
                <div class=" h-full flex flex-col">
                    <h2 class="text-xl font-semibold mb-4">
                        Input
                    </h2>
                    <NInput
                        ref="inputElement"
                        v-model:value="markdownText"
                        class="w-full h-full p-4 resize-none overflow-y-auto"
                        placeholder="Enter your markdown here..."
                        type="textarea"
                    />
                </div>
            </template>
            <template #2>
                <div class=" h-full flex flex-col">
                    <h2 class="mb-4 text-xl font-semibold">
                        Markdown Preview
                    </h2>

                    <NCard ref="outputElement" class="flex-1 overflow-hidden relative p-2">
                        <div class="right-4 w-full min-w-full ml-4 pl-10 min-h-full h-full max-h-full inset-y-5 p-4 prose absolute overflow-y-auto" v-html="parsedMarkdown" />
                    </NCard>
                </div>
            </template>
            <template #resize-trigger>
                <div
                    class="h-[100%] top-[50%] -translate-y-[50%]  absolute cursor-ew-resize flex rounded-lg  hover:bg-gray-200"
                >
                    <Icon class="self-center" name="fluent:re-order-dots-vertical-16-regular" />
                </div>
            </template>
        </NSplit>
    </div>
</template>

<style scoped>
</style>
