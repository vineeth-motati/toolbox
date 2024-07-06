<script setup lang="ts">
import { ref, watch } from 'vue'
import {
    NButton,
    NCard,
    NForm,
    NInput,
    NInputNumber,
    NSelect,
    NSwitch,
    useNotification,
} from 'naive-ui'
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'

// Define types for form state
interface FormState {
    showHyphens: boolean
    uppercase: boolean
    uuidVersion: 1 | 4
    numberOfUuids: number
}

const form = ref<FormState>({
    showHyphens: true,
    uppercase: false,
    uuidVersion: 4,
    numberOfUuids: 1,
})

const uuidVersionOptions = [
    { label: 'UUID v1', value: 1 },
    { label: 'UUID v4', value: 4 },
]
const notification = useNotification()
const generatedUuids = ref('')

watch(
    () => form.value,
    () => {
        generateUuids()
    },
    { deep: true }
)

function generateUuid(version: 1 | 4): string {
    return version === 1 ? uuidv1() : uuidv4()
}

function formatUuid(
    uuid: string,
    showHyphens: boolean,
    uppercase: boolean
): string {
    if (!showHyphens) {
        uuid = uuid.replace(/-/g, '')
    }
    if (uppercase) {
        uuid = uuid.toUpperCase()
    }
    return uuid
}

function copyText() {
    if (!generatedUuids.value.length) {
        return
    }

    navigator.clipboard.writeText(generatedUuids.value).then(() => {
        notification.success({
            title: 'UUIDs copied to clipboard',
            duration: 3000,
        })
    })
}

function generateUuids() {
    let result = ''
    for (let i = 0; i < form.value.numberOfUuids; i++) {
        let uuid = generateUuid(form.value.uuidVersion)
        uuid = formatUuid(uuid, form.value.showHyphens, form.value.uppercase)
        result += `${uuid}\n`
    }
    generatedUuids.value = result
}

generateUuids()
</script>

<template>
    <div class="flex h-full min-h-full p-4 space-x-4">
        <div class="flex flex-col w-1/2 h-full">
            <div class="flex items-center justify-between mb-2">
                <h2 class="text-xl font-semibold">
                    UUIDs
                </h2>
                <div class="flex gap-2">
                    <NButton class="ml-1 text-lg" type="primary" secondary @click="copyText">
                        <Icon class="mr-1" name="ci:copy" />
                        Copy
                    </NButton>
                    <NButton class="text-lg" type="primary" secondary @click="generateUuids">
                        <Icon class="mr-1" name="mingcute:refresh-2-fill" />
                        Regenerate
                    </NButton>
                </div>
            </div>
            <NInput
                v-model:value="generatedUuids"
                class="w-full"
                placeholder="Configure via the form"
                readonly
                rows="10"
                type="textarea"
            />
        </div>
        <div class="flex flex-col w-1/2 h-full">
            <NForm class="relative flex-1 p-2 overflow-hidden">
                <h2 class="mb-2 text-xl font-semibold">
                    Configuration
                </h2>
                <NCard class="w-full p-1" hoverable>
                    <div class="flex justify-between mb-4">
                        <div class="w-1/2">
                            <label class="block mb-1 font-medium text-gray-700 text-md">UUID Version</label>
                            <NSelect
                                v-model:value="form.uuidVersion"
                                class="w-full"
                                :options="uuidVersionOptions"
                            />
                        </div>
                        <div class="w-1/2">
                            <label class="block mb-1 font-medium text-gray-700 text-md">Number of UUIDs</label>
                            <NInputNumber
                                v-model:value="form.numberOfUuids"
                                class="w-full"
                                max="1000"
                                :min="1"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between mb-4">
                        <div class="w-1/2">
                            <label class="block mb-1 font-medium text-gray-700 text-md">Show Hyphens</label>
                            <NSwitch v-model:value="form.showHyphens" />
                        </div>
                        <div class="w-1/2">
                            <label class="block mb-1 font-medium text-gray-700 text-md">Uppercase</label>
                            <NSwitch v-model:value="form.uppercase" />
                        </div>
                    </div>
                </NCard>
            </NForm>
        </div>
    </div>
</template>

<style scoped></style>
