<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import ThemeOverridesConfig from '@/data/naive-ui-theme-overrides.json'

const themeOverrides: GlobalThemeOverrides = ThemeOverridesConfig
</script>

<template>
    <NConfigProvider :theme-overrides="themeOverrides">
        <NMessageProvider placement="bottom-right">
            <NNotificationProvider placement="bottom-right">
                <NuxtLoadingIndicator :height="5" />
                <NuxtLayout>
                    <NuxtPage />
                </NuxtLayout>
            </NNotificationProvider>
        </NMessageProvider>
    </NConfigProvider>
</template>
