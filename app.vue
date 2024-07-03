<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import Toaster from './components/ui/toast/Toaster.vue'
import ThemeOverridesConfig from '@/data/naive-ui-theme-overrides.json'

const themeOverrides: GlobalThemeOverrides = ThemeOverridesConfig
</script>

<template>
    <Toaster />
    <!-- <NConfigProvider :theme-overrides="themeOverrides"> -->
    <!-- <NNotificationProvider placement="bottom-right"> -->
    <NuxtLoadingIndicator :height="5" />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <!-- </NNotificationProvider> -->
    <!-- </NConfigProvider> -->
</template>
