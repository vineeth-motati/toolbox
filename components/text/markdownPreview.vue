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
    <div class="flex h-full min-h-full p-4 space-x-4">
        <NSplit
            direction="horizontal"
            :max="0.75"
            :min="0.25"
            :resize-trigger-size="16"
        >
            <template #1>
                <div class="flex flex-col h-full ">
                    <h2 class="mb-4 text-xl font-semibold">
                        Input
                    </h2>
                    <NInput
                        ref="inputElement"
                        v-model:value="markdownText"
                        class="w-full h-full p-4 overflow-y-auto resize-none"
                        placeholder="Enter your markdown here..."
                        type="textarea"
                    />
                </div>
            </template>
            <template #2>
                <div class="flex flex-col h-full ">
                    <h2 class="mb-4 text-xl font-semibold">
                        Markdown Preview
                    </h2>

                    <NCard ref="outputElement" class="relative flex-1 p-2 overflow-hidden">
                        <div class="absolute w-full h-full max-h-full min-w-full min-h-full p-4 pl-10 ml-4 overflow-y-auto prose right-4 inset-y-5" v-html="parsedMarkdown" />
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
