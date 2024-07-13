<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NDivider, NForm, NInput, useMessage } from 'naive-ui'

const supabase = useSupabaseClient()
const loading = ref(false)
const email = ref('')
const password = ref('')
const message = useMessage()

async function handleGitHubSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' })
    if (error) {
        message.error(error.message)
    }
}

async function handleEmailSignIn() {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    })
    loading.value = false

    if (error) {
        message.error(error.message)
    }
    else {
        message.success('Successfully signed in.')
    }
}

async function handleEmailSignUp() {
    loading.value = true
    const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
    })
    loading.value = false
    if (error) {
        message.error(error.message)
    }
    else {
        message.success('Successfully signed up. Please check your email for confirmation.')
    }
}
</script>

<template>
    <NCard class="absolute inset-0 overflow-y-auto rounded-lg" embedded>
        <div class="flex items-center justify-center h-full text-center text-2xl">
            <NCard class="w-auto max-w-md p-4" hoverable>
                <div>
                    <h2 class="text-2xl font-semibold mb-4">
                        Sign in / Sign up
                    </h2>
                    <NTabs default-value="signin" size="large" type="segment" justify-content="space-evenly" animated>
                        <NTabPane name="signin" tab="Sign In">
                            <NForm class="text-left">
                                <NFormItemRow label="Email">
                                    <NInput v-model:value="email" placeholder="Email" class="mb-2 p-1" size="large" />
                                </NFormItemRow>
                                <NFormItemRow label="Password">
                                    <NInput v-model:value="password" placeholder="Password" type="password" class="mb-2 p-1" size="large" show-password-on="click" />
                                </NFormItemRow>
                            </NForm>
                            <NButton
                                type="primary"
                                size="large"
                                :loading="loading"
                                class="w-full"
                                :disabled="loading"
                                @click="handleEmailSignIn"
                            >
                                Sign In
                            </NButton>
                        </NTabPane>
                        <NTabPane name="signup" tab="Sign Up">
                            <NForm class="text-left">
                                <NFormItemRow label="Email">
                                    <NInput v-model:value="email" placeholder="Email" class="mb-2 p-1" size="large" />
                                </NFormItemRow>
                                <NFormItemRow label="Password">
                                    <NInput v-model:value="password" placeholder="Password" type="password" class="mb-2 p-1" size="large" show-password-on="click" />
                                </NFormItemRow>
                            </NForm>

                            <NButton
                                type="primary"
                                size="large"
                                :loading="loading"
                                class="w-full"
                                :disabled="loading"
                                @click="handleEmailSignUp"
                            >
                                Sign Up
                            </NButton>
                        </NTabPane>
                    </NTabs>
                    <NDivider>
                        <span class="!text-gray-500">or</span>
                    </NDivider>
                    <NButton
                        class="w-full"
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
