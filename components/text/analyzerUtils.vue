<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
    NButton,
    NCard,
    NDataTable,
    NGi,
    NGrid,
    NInput,
    useNotification,
} from 'naive-ui'

const notification = useNotification()
const text = ref('')
const originalText = ref('')
const selectedText = ref('')
const selectionStart = ref(0)
const selectionEnd = ref(0)
const statistics = ref({
    length: 0,
    startPosition: 0,
    endPosition: 0,
    line: 0,
    column: 0,
    bytes: 0,
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    lineBreak: '',
})

const characterFrequency = ref<
  { char: string, count: number, selectedCount: number }[]
>([])
const wordFrequency = ref<
  { word: string, count: number, selectedCount: number }[]
>([])

const invisibleCharMap: { [key: string]: string } = {
    ' ': '⎵',
    '\n': '⤶',
    '\t': '⟶',
}

function mapInvisibleChars(char: string): string {
    return invisibleCharMap[char] || char
}

interface CaseConversion {
    label: string
    type: string
}

interface LineSorting {
    label: string
    type: string
}

const caseConversions: CaseConversion[] = [
    { label: 'lower case', type: 'lower case' },
    { label: 'UPPER CASE', type: 'UPPER CASE' },
    { label: 'Sentence case', type: 'Sentence case' },
    { label: 'Title Case', type: 'Title Case' },
    { label: 'camelCase', type: 'camelCase' },
    { label: 'PascalCase', type: 'PascalCase' },
    { label: 'snake_case', type: 'snake_case' },
    { label: 'CONSTANT_CASE', type: 'CONSTANT_CASE' },
    { label: 'kebab-case', type: 'kebab-case' },
    { label: 'COBOL-CASE', type: 'COBOL-CASE' },
    { label: 'Train-Case', type: 'Train-Case' },
    { label: 'aLtErNaTiNg cAsE', type: 'aLtErNaTiNg cAsE' },
    { label: 'InVeRsE CaSe', type: 'InVeRsE CaSe' },
    { label: 'raNdoM caSE', type: 'raNdoM caSE' },
]

const lineSortings: LineSorting[] = [
    { label: 'Alphabetize', type: 'Alphabetize' },
    { label: 'Reverse alphabetize', type: 'Reverse alphabetize' },
    { label: 'Alphabetize by last word', type: 'Alphabetize by last word' },
    {
        label: 'Reverse Alphabetize by last word',
        type: 'Reverse Alphabetize by last word',
    },
    { label: 'Reverse', type: 'Reverse' },
    { label: 'Randomize', type: 'Randomize' },
]

// Function to store the original text before any modifications
function storeOriginalText() {
    if (!originalText.value) {
        originalText.value = text.value
    }
}

// Function to show the original text
function showOriginalText() {
    text.value = originalText.value
}

// Function to copy the text to clipboard
function copyText() {
    if (!text.value && !selectedText.value) {
        return
    }
    navigator.clipboard.writeText(text.value).then(() => {
        notification.success({
            title: 'Text copied to clipboard',
            duration: 3000,
        })
    })
}

// Function to paste the text from clipboard
async function pasteText() {
    const clipboardText = await navigator.clipboard.readText()
    text.value = clipboardText
}

// Function to clear the text area
function clearText() {
    text.value = ''
    selectedText.value = ''
    originalText.value = ''
}

function updateStatistics() {
    const selected = selectedText.value
    const lines = selected.split(/\r\n|\r|\n/)
    const words = selected.match(/\b\w+\b/g) || []
    const sentences = selected.match(/[^.!?]+[.!?]+/g) || []
    const paragraphs = selected.split(/\r\n\r\n|\r\r|\n\n/)

    statistics.value = {
        length: selected.length,
        startPosition: selectionStart.value,
        endPosition: selectionEnd.value,
        line: selected.split(/\n/).length,
        column: selected.length - selected.lastIndexOf('\n'),
        bytes: new TextEncoder().encode(selected).length,
        characters: selected.length,
        words: words.length,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        lines: lines.length,
        lineBreak: /\r\n/.test(selected) ? 'CRLF' : 'LF',
    }

    const charFreq: {
        [key: string]: { count: number, selectedCount: number }
    } = {}
    for (const char of text.value) {
        const displayChar = mapInvisibleChars(char)
        if (!charFreq[displayChar]) {
            charFreq[displayChar] = { count: 0, selectedCount: 0 }
        }
        charFreq[displayChar].count += 1
    }
    for (const char of selected) {
        const displayChar = mapInvisibleChars(char)
        if (charFreq[displayChar]) {
            charFreq[displayChar].selectedCount += 1
        }
        else {
            charFreq[displayChar] = { count: 0, selectedCount: 1 }
        }
    }
    characterFrequency.value = Object.entries(
        charFreq
    ).map(([char, { count, selectedCount }]) => ({ char, count, selectedCount }))

    const wordFreq: {
        [key: string]: { count: number, selectedCount: number }
    } = {}
    for (const word of text.value.match(/\b\w+\b/g) || []) {
        if (!wordFreq[word]) {
            wordFreq[word] = { count: 0, selectedCount: 0 }
        }
        wordFreq[word].count += 1
    }
    for (const word of selected.match(/\b\w+\b/g) || []) {
        if (wordFreq[word]) {
            wordFreq[word].selectedCount += 1
        }
        else {
            wordFreq[word] = { count: 0, selectedCount: 1 }
        }
    }
    wordFrequency.value = Object.entries(
        wordFreq
    ).map(([word, { count, selectedCount }]) => ({ word, count, selectedCount }))
}

// Update the replaceSelectedText function to store the original text before making changes
function replaceSelectedText() {
    storeOriginalText()
    text.value
    = text.value.slice(0, selectionStart.value)
    + selectedText.value
    + text.value.slice(selectionEnd.value)
}

function convertLineBreak(type: string) {
    selectedText.value
    = type === 'CRLF'
            ? selectedText.value.replace(/\n/g, '\r\n')
            : selectedText.value.replace(/\r\n/g, '\n')
    replaceSelectedText()
}

function convertCase(type: string) {
    switch (type) {
        case 'lower case':
            selectedText.value = selectedText.value.toLowerCase()
            break
        case 'UPPER CASE':
            selectedText.value = selectedText.value.toUpperCase()
            break
        case 'Sentence case':
            selectedText.value = selectedText.value.replace(
                /(^\w|\.\s*\w)/g,
                match => match.toUpperCase()
            )
            break
        case 'Title Case':
            selectedText.value = selectedText.value.replace(
                /\w\S*/g,
                match => match.charAt(0).toUpperCase() + match.substr(1).toLowerCase()
            )
            break
        case 'camelCase':
            selectedText.value = selectedText.value
                .replace(/^\w|[A-Z]|\b\w|\s+/g, (match, index) =>
                    index === 0 ? match.toLowerCase() : match.toUpperCase())
                .replace(/\s+/g, '')
            break
        case 'PascalCase':
            selectedText.value = selectedText.value
                .replace(/^\w|[A-Z]|\b\w|\s+/g, match => match.toUpperCase())
                .replace(/\s+/g, '')
            break
        case 'snake_case':
            selectedText.value = selectedText.value
                .replace(/\W+/g, ' ')
                .split(/ |\B(?=[A-Z])/)
                .map(word => word.toLowerCase())
                .join('_')
            break
        case 'CONSTANT_CASE':
            selectedText.value = selectedText.value
                .replace(/\W+/g, ' ')
                .split(/ |\B(?=[A-Z])/)
                .map(word => word.toUpperCase())
                .join('_')
            break
        case 'kebab-case':
            selectedText.value = selectedText.value
                .replace(/\W+/g, ' ')
                .split(/ |\B(?=[A-Z])/)
                .map(word => word.toLowerCase())
                .join('-')
            break
        case 'COBOL-CASE':
            selectedText.value = selectedText.value
                .replace(/\W+/g, ' ')
                .split(/ |\B(?=[A-Z])/)
                .map(word => word.toUpperCase())
                .join('-')
            break
        case 'Train-Case':
            selectedText.value = selectedText.value
                .replace(/\W+/g, ' ')
                .split(/ |\B(?=[A-Z])/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join('-')
            break
        case 'aLtErNaTiNg cAsE':
            selectedText.value = selectedText.value.replace(/[a-z]/gi, (c, i) =>
                i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())
            break
        case 'InVeRsE CaSe':
            selectedText.value = selectedText.value.replace(/[a-z]/gi, (c, i) =>
                i % 2 === 0 ? c.toUpperCase() : c.toLowerCase())
            break
        case 'raNdoM caSE':
            selectedText.value = selectedText.value.replace(/[a-z]/gi, c =>
                Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase())
            break
    }
    replaceSelectedText()
}

function sortLines(type: string) {
    let lines = selectedText.value.split(/\r\n|\r|\n/)
    switch (type) {
        case 'Alphabetize':
            lines = lines.sort()
            break
        case 'Reverse alphabetize':
            lines = lines.sort().reverse()
            break
        case 'Alphabetize by last word':
            lines = lines.sort((a, b) => {
                const aLastWord = a.split(' ').slice(-1)[0]
                const bLastWord = b.split(' ').slice(-1)[0]
                return aLastWord ? aLastWord.localeCompare(bLastWord) : 0
            })
            break
        case 'Reverse Alphabetize by last word':
            lines = lines.sort((a, b) => {
                const aLastWord = a.split(' ').slice(-1)[0]
                const bLastWord = b.split(' ').slice(-1)[0]
                return bLastWord ? bLastWord.localeCompare(aLastWord) : 0
            })
            break
        case 'Reverse':
            lines = lines.reverse()
            break
        case 'Randomize':
            for (let i = lines.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [lines[i], lines[j]] = [lines[j], lines[i]]
            }
            break
    }
    selectedText.value = lines.join('\n')
    replaceSelectedText()
}

// Watch the selectedText to update statistics whenever it changes
watch([text, selectedText], updateStatistics, { immediate: true })

// Function to capture selected text in the textarea
function captureSelectedText(event: Event) {
    const textarea = event.target as HTMLTextAreaElement
    selectionStart.value = textarea?.selectionStart
    selectionEnd.value = textarea?.selectionEnd
    selectedText.value = text.value?.slice(
        selectionStart.value,
        selectionEnd.value
    )
}

onMounted(updateStatistics)
</script>

<template>
    <div class="rounded-xl">
        <NGrid class="mb-4" cols="8" x-gap="12" y-gap="2">
            <NGi>
                <NButton class="w-full overflow-hidden" @click="convertLineBreak('LF')">
                    Convert to LF
                </NButton>
            </NGi>
            <NGi>
                <NButton
                    class="w-full overflow-hidden"
                    @click="convertLineBreak('CRLF')"
                >
                    Convert to CRLF
                </NButton>
            </NGi>
            <template v-for="conversion in caseConversions" :key="conversion.type">
                <NGi>
                    <NButton
                        class="w-full overflow-hidden"
                        @click="convertCase(conversion.type)"
                    >
                        {{ conversion.label }}
                    </NButton>
                </NGi>
            </template>
            <template v-for="sorting in lineSortings" :key="sorting.type">
                <NGi>
                    <NButton
                        class="w-full overflow-hidden"
                        @click="sortLines(sorting.type)"
                    >
                        {{ sorting.label }}
                    </NButton>
                </NGi>
            </template>
        </NGrid>
        <div class="flex gap-4">
            <NCard class="h-auto">
                <div class="flex justify-between">
                    <h2 class="mb-2 text-xl font-semibold">
                        Text
                    </h2>
                    <div class="flex gap-0">
                        <NButton class="mx-1 text-lg" @click="showOriginalText">
                            Show original text
                        </NButton>
                        <NDivider class="self-center !h-5 !w-0.5" vertical />
                        <NButton class="mx-1 text-lg" @click="copyText">
                            <Icon class="mr-1" name="ci:copy" />
                            Copy
                        </NButton>
                        <NButton class="mx-1 text-lg" @click="pasteText">
                            <Icon class="mr-1" name="fluent:clipboard-paste-24-regular" />
                            Paste
                        </NButton>
                        <NDivider class="self-center !h-5 !w-0.5" vertical />
                        <NButton class="text-lg" @click="clearText">
                            <Icon name="f7:clear" class="mr-1" />
                            Clear
                        </NButton>
                    </div>
                </div>
                <NInput
                    id="text-input"
                    v-model:value="text"
                    class="w-full p-4 mb-4"
                    placeholder="Enter your text here"
                    rows="25"
                    type="textarea"
                    @change="updateStatistics"
                    @select="captureSelectedText"
                />
            </NCard>

            <NCard class="flex h-full mb-4 hoverable" hoverable>
                <div class="flex">
                    <div class="w-1/2 mr-4">
                        <h2 class="mb-2 text-xl font-semibold">
                            Statistics
                        </h2>
                        <NDataTable
                            class="mb-4"
                            :columns="[
                                { title: 'Metric', key: 'metric' },
                                { title: 'Value', key: 'value' },
                            ]"
                            :data="[
                                { metric: 'Length', value: statistics.length },
                                { metric: 'Start Position', value: statistics.startPosition },
                                { metric: 'End Position', value: statistics.endPosition },
                                { metric: 'Line', value: statistics.line },
                                { metric: 'Column', value: statistics.column },
                                { metric: 'Bytes', value: statistics.bytes },
                                { metric: 'Characters', value: statistics.characters },
                                { metric: 'Words', value: statistics.words },
                                { metric: 'Sentences', value: statistics.sentences },
                                { metric: 'Paragraphs', value: statistics.paragraphs },
                                { metric: 'Lines', value: statistics.lines },
                                { metric: 'Line Break', value: statistics.lineBreak },
                            ]"
                        />
                    </div>
                    <div class="w-1/2">
                        <h2 class="mb-2 text-xl font-semibold">
                            Character Frequency
                        </h2>
                        <NDataTable
                            class="mb-4"
                            :columns="[
                                { title: 'Character', key: 'char' },
                                { title: 'Frequency', key: 'count' },
                                { title: 'Selected', key: 'selectedCount' },
                            ]"
                            :data="characterFrequency"
                            :max-height="233"
                        />
                        <h2 class="mb-2 text-xl font-semibold">
                            Word Frequency
                        </h2>
                        <NDataTable
                            :columns="[
                                { title: 'Word', key: 'word', className: 'whitespace-nowrap overflow-hidden text-overflow-ellipsis' },
                                { title: 'Frequency', key: 'count' },
                                { title: 'Selected', key: 'selectedCount' },
                            ]"
                            :data="wordFrequency"
                            :max-height="233"
                        />
                    </div>
                </div>
            </NCard>
        </div>
    </div>
</template>

<style scoped></style>
