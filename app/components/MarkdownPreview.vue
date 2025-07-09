<script setup lang="ts">
import MarkdownItAsync from 'markdown-it-async'

const props = defineProps<{
  code: string
}>()

const colorMode = useColorMode()

const md = MarkdownItAsync({
  async highlight(code, lang) {
    const { codeToHtml } = await import('shiki')
    return await codeToHtml(code, {
      lang,
      theme: colorMode.value === 'dark' ? 'vitesse-dark' : 'vitesse-light',
    })
  },
})

onMounted(async () => {
})

const html = shallowRef('')

watch([() => props.code, colorMode], async ([value]) => {
  html.value = await md.renderAsync(value)
}, { immediate: true })
</script>

<template>
  <div v-if="html" p4 class="markdown-body" dark:bg-black v-html="html" />
</template>
