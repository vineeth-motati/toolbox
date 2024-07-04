<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NFormItem, NInput } from 'naive-ui'

const email = ref('')
const password = ref('')
const supabase: any = useSupabaseClient()

async function handleLogin(): Promise<void> {
    const { user, error } = await supabase.signInWithPassword({
        email: email.value,
        password: password.value,
    })

    if (error) {
        console.error(error.message)
    }
    else {
        console.info('Login successful', user)
    }
}

async function handleSignUp(): Promise<void> {
    const { user, error } = await supabase.signUp({
        email: email.value,
        password: password.value,
    })

    if (error) {
        console.error(error.message)
    }
    else {
        console.info('Sign up successful', user)
    }
}

async function handleGitHubLogin(): Promise<void> {
    const { user, error } = await supabase.signInWithOAuth({
        provider: 'github',
    })

    if (error) {
        console.error(error.message)
    }
    else {
        console.info('GitHub login successful', user)
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <NCard class="w-full max-w-md p-6 space-y-4 bg-white rounded-lg shadow-md">
            <NForm>
                <NFormItem>
                    <NInput v-model:value="email" placeholder="Email" type="email" />
                </NFormItem>
                <NFormItem>
                    <NInput v-model:value="password" placeholder="Password" type="password" />
                </NFormItem>
                <div class="flex justify-between items-center">
                    <NButton type="primary" @click="handleLogin">
                        Login
                    </NButton>
                    <NButton @click="handleSignUp">
                        Sign Up
                    </NButton>
                </div>
                <div class="flex justify-center items-center mt-4">
                    <NButton @click="handleGitHubLogin">
                        Login with GitHub
                    </NButton>
                </div>
            </NForm>
        </NCard>
    </div>
</template>

<style scoped>
</style>
