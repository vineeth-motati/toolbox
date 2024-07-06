<script setup lang="ts">
import { ref } from 'vue'
import {
    NButton,
    NCard,
    NColorPicker,
    NForm,
    NInput,
    NInputNumber,
    NModal,
    NQrCode,
    NSelect,
    NUpload,
    type UploadCustomRequestOptions,
    useNotification
} from 'naive-ui'
import jsQR from 'jsqr'
import * as pdfjsLib from 'pdfjs-dist'

// Define types for form state
interface FormState {
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
    color: string
    backgroundColor: string
    iconSize: number
    iconSrc: string
    size: number
}

const form = ref<FormState>({
    errorCorrectionLevel: 'L',
    color: '#000000',
    backgroundColor: '#ffffff',
    iconSize: 20,
    iconSrc: '',
    size: 300,
})

const notification = useNotification()
const textContent = ref('')
const uploadRef = ref<any>(null)
const errorCorrectionLevels = [
    { label: 'Low', value: 'L' },
    { label: 'Medium', value: 'M' },
    { label: 'High', value: 'Q' },
    { label: 'Max', value: 'H' },
]

const isModalOpen = ref(false)

function copyText() {
    if (!textContent.value.length) {
        return
    }
    navigator.clipboard.writeText(textContent.value).then(() => {
        notification.success({
            title: 'Text copied to clipboard',
            duration: 3000,
        })
    })
}

function copyQRCode() {
    const svg = document.querySelector('#qrcode svg') as SVGElement
    if (svg) {
        const svgCopy = svg.cloneNode(true) as SVGElement
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const svgData = new XMLSerializer().serializeToString(svgCopy)
        const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
        })
        const url = URL.createObjectURL(svgBlob)
        const img = new Image()
        const padding = 12
        const roundedRadius = 12

        img.onload = () => {
            const totalSize = form.value.size + 2 * padding
            canvas.width = totalSize
            canvas.height = totalSize

            // Draw rounded rectangle background
            ctx!.fillStyle = form.value.backgroundColor
            ctx!.beginPath()
            ctx!.moveTo(roundedRadius, 0)
            ctx!.lineTo(totalSize - roundedRadius, 0)
            ctx!.quadraticCurveTo(totalSize, 0, totalSize, roundedRadius)
            ctx!.lineTo(totalSize, totalSize - roundedRadius)
            ctx!.quadraticCurveTo(
                totalSize,
                totalSize,
                totalSize - roundedRadius,
                totalSize
            )
            ctx!.lineTo(roundedRadius, totalSize)
            ctx!.quadraticCurveTo(0, totalSize, 0, totalSize - roundedRadius)
            ctx!.lineTo(0, roundedRadius)
            ctx!.quadraticCurveTo(0, 0, roundedRadius, 0)
            ctx!.closePath()
            ctx!.fill()

            // Draw the QR code image inside the rounded rectangle
            ctx!.drawImage(img, padding, padding, form.value.size, form.value.size)
            URL.revokeObjectURL(url)

            // Convert canvas to PNG and copy to clipboard
            canvas.toBlob((blob) => {
                const item = new ClipboardItem({ 'image/png': blob! })
                navigator.clipboard.write([item]).then(() => {
                    notification.success({
                        title: 'QR Code copied to clipboard',
                        duration: 3000,
                    })
                })
            })
        }
        img.src = url
    }
}

function downloadQRCode() {
    const svg = document.querySelector('#qrcode svg') as SVGElement
    if (svg) {
        const svgCopy = svg.cloneNode(true) as SVGElement
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const svgData = new XMLSerializer().serializeToString(svgCopy)
        const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
        })
        const url = URL.createObjectURL(svgBlob)
        const img = new Image()
        const padding = 12
        const roundedRadius = 12

        img.onload = () => {
            const totalSize = form.value.size + 2 * padding
            canvas.width = totalSize
            canvas.height = totalSize

            // Draw rounded rectangle background
            ctx!.fillStyle = form.value.backgroundColor
            ctx!.beginPath()
            ctx!.moveTo(roundedRadius, 0)
            ctx!.lineTo(totalSize - roundedRadius, 0)
            ctx!.quadraticCurveTo(totalSize, 0, totalSize, roundedRadius)
            ctx!.lineTo(totalSize, totalSize - roundedRadius)
            ctx!.quadraticCurveTo(
                totalSize,
                totalSize,
                totalSize - roundedRadius,
                totalSize
            )
            ctx!.lineTo(roundedRadius, totalSize)
            ctx!.quadraticCurveTo(0, totalSize, 0, totalSize - roundedRadius)
            ctx!.lineTo(0, roundedRadius)
            ctx!.quadraticCurveTo(0, 0, roundedRadius, 0)
            ctx!.closePath()
            ctx!.fill()

            // Draw the QR code image inside the rounded rectangle
            ctx!.drawImage(img, padding, padding, form.value.size, form.value.size)
            URL.revokeObjectURL(url)

            // Convert canvas to PNG and download
            const link = document.createElement('a')
            link.href = canvas.toDataURL('image/png')
            link.download = 'qrcode.png'
            link.click()
        }
        img.src = url
    }
}

function handleUpload(options: UploadCustomRequestOptions) {
    const { file } = options
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
    uploadRef.value?.clear()

    if (!allowedTypes.includes(file.file?.type || '')) {
        notification.error({
            title: 'Invalid file type',
            content: 'Please upload an image or PDF file.',
            duration: 3000,
        })
        return false
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
            if (file.file?.type === 'application/pdf') {
                try {
                    const pdf = await pdfjsLib.getDocument({ data: result }).promise
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i)
                        const viewport = page.getViewport({ scale: 1.0 })
                        const canvas = document.createElement('canvas')
                        const context = canvas.getContext('2d')
                        canvas.height = viewport.height
                        canvas.width = viewport.width
                        if (!context) {
                            notification.error({
                                title: 'Error scanning PDF',
                                content: 'An error occurred while scanning the PDF.',
                                duration: 3000,
                            })
                            return false
                        }
                        await page.render({ canvasContext: context, viewport }).promise

                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                        const code = jsQR(imageData.data, imageData.width, imageData.height)
                        if (code) {
                            textContent.value = code.data
                            notification.success({
                                title: 'QR Code found in PDF',
                                content: 'The text field has been updated with the scanned content.',
                                duration: 3000,
                            })
                            return false
                        }
                    }
                    notification.error({
                        title: 'No QR Code found',
                        content: 'Unable to detect a QR Code in the PDF.',
                        duration: 3000,
                    })
                }
                catch (error) {
                    notification.error({
                        title: 'Error scanning PDF',
                        content: 'An error occurred while scanning the PDF.',
                        duration: 3000,
                    })
                }
            }
            else {
                // Handle image files
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = img.width
                    canvas.height = img.height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0)
                    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
                    if (imageData) {
                        const code = jsQR(imageData.data, imageData.width, imageData.height)

                        if (code) {
                            textContent.value = code.data
                            notification.success({
                                title: 'QR Code scanned successfully',
                                content: 'The text field has been updated with the scanned content.',
                                duration: 3000,
                            })
                        }
                        else {
                            notification.error({
                                title: 'No QR Code found',
                                content: 'Unable to detect a QR Code in the uploaded image.',
                                duration: 3000,
                            })
                        }
                    }
                }
                img.src = result
            }
        }
    }

    reader.readAsDataURL(file.file as File)
}
</script>

<template>
    <div class="flex flex-col space-y-4">
        <div class="flex p-4 space-x-4">
            <div class="flex flex-col w-1/2 h-full">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xl font-semibold">
                        QR Code Encoder / Decoder
                    </h2>
                    <div class="flex gap-2">
                        <NButton class="ml-1 text-lg" type="primary" secondary @click="copyText">
                            <Icon class="mr-1" name="ci:copy" />
                            Copy
                        </NButton>
                    </div>
                </div>
                <NInput
                    v-model:value="textContent"
                    class="w-full h-full"
                    placeholder="Add your text here"
                    maxlength="1500"
                    rows="12"
                    type="textarea"
                    :show-count="true"
                >
                    <template #count="{ value }">
                        {{ value.length > 1000 ? `${value.length.toString()} / ` + `1500` : null }}
                    </template>
                </NInput>
            </div>

            <NForm class="w-1/2 space-y-4">
                <h2 class="content-end text-xl font-semibold h-7">
                    Configuration
                </h2>
                <NCard class="p-4 space-y-4" hoverable>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block mb-1 font-medium text-gray-700 text-md">Error Correction Level</label>
                            <NSelect
                                v-model:value="form.errorCorrectionLevel"
                                class="w-full"
                                :options="errorCorrectionLevels"
                            />
                        </div>
                        <div>
                            <label class="block mb-1 font-medium text-gray-700 text-md">Size</label>
                            <NInputNumber
                                v-model:value="form.size"
                                class="w-full"
                                :max="700"
                                :min="50"
                            />
                        </div>
                        <div>
                            <label class="block mb-1 font-medium text-gray-700 text-md">Background Color</label>
                            <NColorPicker
                                v-model:value="form.backgroundColor"
                                class="w-full"
                                :show-alpha="false"
                            />
                        </div>
                        <div>
                            <label class="block mb-1 font-medium text-gray-700 text-md">Foreground Color</label>
                            <NColorPicker
                                v-model:value="form.color"
                                class="w-full"
                                :show-alpha="false"
                            />
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700 text-md">Icon URL</label>
                            <NInput
                                v-model:value="form.iconSrc"
                                class="w-full"
                                placeholder="https://example.com/icon.png"
                            />
                        </div>
                        <div>
                            <label class="block mb-1 font-medium text-gray-700 text-md">Icon Size</label>
                            <NInputNumber v-model:value="form.iconSize" class="w-full" />
                        </div>
                    </div>
                </NCard>
            </NForm>
        </div>

        <div class="flex flex-col w-1/2 px-4">
            <div class="flex items-center justify-between mb-2">
                <h2 class="text-xl font-semibold">
                    QR Code
                </h2>
                <div class="flex gap-2">
                    <NButton class="ml-1 text-lg" tertiary @click="downloadQRCode">
                        <Icon class="mr-1" name="mage:image-download" />
                        Download
                    </NButton>

                    <NUpload
                        ref="uploadRef"
                        :custom-request="handleUpload"
                        :show-file-list="false"
                        :max="1"
                        class="w-fit"
                    >
                        <NButton class="ml-1 text-lg" tertiary>
                            <Icon class="mr-1" name="mage:image-upload" />
                            Upload QR Code
                        </NButton>
                    </NUpload>
                    <NButton class="ml-1 text-lg" tertiary @click="copyQRCode">
                        <Icon class="mr-1" name="ci:copy" />
                        Copy QR Code
                    </NButton>
                    <NButton class="ml-1 text-lg" tertiary @click="isModalOpen = true">
                        <Icon class="mr-1" name="iconamoon:screen-full" />
                        Fullscreen
                    </NButton>
                </div>
            </div>
            <NCard class="p-4" hoverable>
                <div class="flex justify-center w-auto">
                    <div class="flex flex-col h-full">
                        <div
                            class="flex items-center justify-center p-4 border-2 border-dashed rounded-lg"
                        >
                            <NQrCode
                                id="qrcode"
                                v-model:value="textContent"
                                class="items-center justify-center"
                                type="svg"
                                v-bind="form"
                            />
                        </div>
                    </div>
                </div>
            </NCard>
        </div>

        <NModal v-model:show="isModalOpen" transform-origin="center" size="huge" title="QR Code">
            <NCard class="p-4 w-fit" hoverable embedded>
                <div
                    class="flex items-center justify-center p-4 border-2 border-dashed rounded-lg"
                >
                    <NQrCode
                        v-model:value="textContent"
                        class="items-center justify-center"
                        type="svg"
                        v-bind="form"
                        :size="700"
                    />
                </div>
            </NCard>
        </NModal>
    </div>
</template>

<style scoped></style>
