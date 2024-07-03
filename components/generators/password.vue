<script setup lang="ts">
import { ref, watch } from 'vue'
import {
    NButton,
    NCheckbox,
    NCheckboxGroup,
    NForm,
    NInput,
    NInputNumber,
    NRadio,
    NRadioGroup,
    NSlider,
    useNotification,
} from 'naive-ui'
import { useToast } from '../ui/toast'

// Define types for form state
interface FormState {
    type: 'password' | 'passphrase'
    numberOfPasswords: number
    passwordOptions: string[]
    passwordLength: number
    passphraseOptions: string[]
    wordSeparator: string
    wordsLength: number
}

const form = ref<FormState>({
    type: 'password',
    numberOfPasswords: 1,
    passwordOptions: ['A-Z', 'a-z', '0-9', '!@#$%^&*'],
    passwordLength: 12,
    passphraseOptions: ['capitalize', 'include number'],
    wordSeparator: '-',
    wordsLength: 4,
})

const { toast } = useToast()
const generatedPasswords = ref('')

watch(
    () => form.value,
    () => {
        generatePasswords()
    },
    { deep: true }
)
function copyText() {
    if (!generatedPasswords.value.length) {
        return
    }

    navigator.clipboard.writeText(generatedPasswords.value).then(() => {
        toast({
            title: 'Passwords copied to clipboard',
            duration: 3000,
        })
    })
}
function generateRandomPassword(options: string[], length: number): string {
    const chars: string[] = []
    if (options.includes('A-Z')) {
        chars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    }
    if (options.includes('a-z')) {
        chars.push('abcdefghijklmnopqrstuvwxyz')
    }
    if (options.includes('0-9')) {
        chars.push('0123456789')
    }
    if (options.includes('!@#$%^&*')) {
        chars.push('!@#$%^&*')
    }

    let password = ''
    const allChars = chars.join('')
    if (!allChars) {
        return ''
    }
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length)
        password += allChars[randomIndex]
    }
    return password
}

function generateRandomPassphrase(
    options: string[],
    length: number,
    separator: string
): string {
    const words = [
        'apple',
        'banana',
        'cherry',
        'date',
        'fig',
        'grape',
        'kiwi',
        'lemon',
        'mango',
        'nectarine',
        'orange',
        'papaya',
        'quince',
        'raspberry',
        'strawberry',
        'tangerine',
        'watermelon',
    ]
    const passphrase: string[] = []
    for (let i = 0; i < length; i++) {
        let word = words[Math.floor(Math.random() * words.length)]
        if (options.includes('capitalize')) {
            word = word.charAt(0).toUpperCase() + word.slice(1)
        }
        if (options.includes('include number')) {
            word += Math.floor(Math.random() * 10)
        }
        passphrase.push(word)
    }
    return passphrase.join(separator)
}

function generatePasswords() {
    let result = ''
    for (let i = 0; i < form.value.numberOfPasswords; i++) {
        if (form.value.type === 'password') {
            result += `${generateRandomPassword(
        form.value.passwordOptions,
        form.value.passwordLength
      )}\n`
        }
        else {
            result += `${generateRandomPassphrase(
        form.value.passphraseOptions,
        form.value.wordsLength,
        form.value.wordSeparator
      )}\n`
        }
    }
    generatedPasswords.value = result.trim()
}

generatePasswords()
</script>

<template>
    <div class="flex space-x-4 min-h-full h-full p-4">
        <div class="w-1/2 h-full flex flex-col">
            <div class="flex justify-between items-center mb-2">
                <h2 class="text-xl font-semibold">
                    Passwords
                </h2>
                <div class="flex gap-2">
                    <NButton class="ml-1 text-lg" @click="copyText">
                        <Icon class="mr-1" name="ci:copy" />
                        Copy
                    </NButton>
                    <NButton class="text-lg" type="primary" @click="generatePasswords">
                        <Icon class="mr-1" name="mingcute:refresh-2-fill" />

                        Regenerate
                    </NButton>
                </div>
            </div>
            <NInput
                v-model:value="generatedPasswords"
                class="w-full"
                placeholder="Configure via the form"
                readonly
                rows="10"
                type="textarea"
            />
        </div>
        <div class="w-1/2 h-full flex flex-col">
            <NForm class="flex-1 overflow-hidden relative p-2">
                <h2 class="text-xl font-semibold mb-2">
                    Configuration
                </h2>
                <NCard class="w-full p-1" hoverable>
                    <div class="flex justify-between mb-4">
                        <div>
                            <label class="block text-md font-medium text-gray-700 mb-1">Type</label>

                            <NRadioGroup v-model:value="form.type" class="flex space-x-4">
                                <NRadio value="password">
                                    Password
                                </NRadio>
                                <NRadio value="passphrase">
                                    Passphrase
                                </NRadio>
                            </NRadioGroup>
                        </div>

                        <div class="w-1/2">
                            <label class="block text-md font-medium text-gray-700 mb-1">Number of Passwords</label>
                            <NInputNumber
                                v-model:value="form.numberOfPasswords"
                                class="w-full"
                                max="1000"
                                :min="1"
                            />
                        </div>
                    </div>

                    <div v-if="form.type === 'password'" class="flex justify-between">
                        <div class="w-1/2">
                            <label class="block text-md font-medium text-gray-700 mb-1">Include in Passwords</label>
                            <NCheckboxGroup
                                v-model:value="form.passwordOptions"
                                class="space-y-2"
                            >
                                <div class="flex items-center space-x-2">
                                    <NCheckbox value="A-Z">
                                        A-Z
                                    </NCheckbox>
                                    <NCheckbox value="a-z">
                                        a-z
                                    </NCheckbox>
                                    <NCheckbox value="0-9">
                                        0-9
                                    </NCheckbox>
                                    <NCheckbox value="!@#$%^&*">
                                        !@#$%^&*
                                    </NCheckbox>
                                </div>
                            </NCheckboxGroup>
                        </div>

                        <div class="w-1/2 p-2">
                            <label class="block text-md font-medium text-gray-700 mb-1">Password Length</label>
                            <NSlider v-model:value="form.passwordLength" :max="32" :min="8" />
                        </div>
                    </div>

                    <div v-if="form.type === 'passphrase'" class="flex justify-between">
                        <div class="w-1/2">
                            <label class="block text-md font-medium text-gray-700 mb-1">Include in Passphrase</label>
                            <NCheckboxGroup
                                v-model:value="form.passphraseOptions"
                                class="space-y-2"
                            >
                                <div class="flex items-center space-x-2">
                                    <NCheckbox value="capitalize">
                                        Capitalize
                                    </NCheckbox>
                                    <NCheckbox value="include number">
                                        Include Number
                                    </NCheckbox>
                                    <NInput
                                        v-model:value="form.wordSeparator"
                                        autosize
                                        class=""
                                        maxlength="1"
                                        placeholder=""
                                    />
                                    <label class="text-sm font-medium text-gray-700 mb-1">Word Separator</label>
                                </div>
                            </NCheckboxGroup>
                        </div>

                        <div class="w-1/2 p-2">
                            <label class="block text-md font-medium text-gray-700 mb-1">Words Length</label>
                            <NSlider v-model:value="form.wordsLength" :max="10" :min="3" />
                        </div>
                    </div>
                </NCard>
            </NForm>
        </div>
    </div>
</template>

<style scoped></style>
