<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import ThemeOverridesConfig from '@/data/naive-ui-theme-overrides.json'

const themeOverrides: GlobalThemeOverrides = ThemeOverridesConfig
</script>

<template>
    <NConfigProvider :theme-overrides="themeOverrides">
        <NNotificationProvider placement="bottom-right">
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </NNotificationProvider>
    </NConfigProvider>
</template>
