<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NDivider, NInput } from 'naive-ui'

const supabase = useSupabaseClient()

const email = ref('')
async function handleGitHubSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' })

    if (error) {
        console.error(error)
    }
}
</script>

<template>
    <NCard class="absolute inset-0 overflow-y-auto rounded-lg" embedded>
        <div class="flex items-center justify-center h-full text-center text-2xl">
            <NCard class="w-auto max-w-md p-4" hovarable>
                <div>
                    <h2 class="text-2xl font-semibold mb-4">
                        Sign in / Sign up
                    </h2>
                    <NInput v-model:value="email" placeholder="Email" class="mb-2" size="large" />
                    <NDivider>
                        <span class="!text-gray-500">or</span>
                    </NDivider>
                    <NButton
                        class="mt-4"
                        color="#24292f"
                        type="primary"
                        size="large"
                        @click="handleGitHubSignIn"
                    >
                        <Icon class="mr-1" name="tabler:brand-github" />
                        Continue with GitHub
                    </NButton>
                </div>
            </NCard>
        </div>
    </NCard>
</template>
