<script setup lang="ts">
import type { EditorOptions } from '../types'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
// @ts-expect-error no type
import { initVimMode, VimMode } from 'monaco-vim'
import { createHighlighter } from 'shiki'

const props = defineProps<{
  id: number
  options?: EditorOptions
}>()

const value = defineModel('value', {default: ''})
const emits  = defineEmits<{
  (e: 'sp'): void
}>()

const editorRef = templateRef('editorRef')
const statusbarRef = templateRef('statusbarRef')
const editor = shallowRef<ReturnType<typeof monaco.editor.create>>()

const { Vim } = VimMode
Vim.defineEx('split', 'sp', () =>  emits('sp'))
Vim.defineEx('split', 'sp', () =>  emits('sp'))

onMounted(async () => {
  const highlighter = await createHighlighter({
    themes: [
      'vitesse-dark',
      'vitesse-black',
      'vitesse-light',
    ],
    langs: [
      'javascript',
      'typescript',
      'vue',
      'markdown',
    ],
  })

  // Register the languageIds first. Only registered languages will be highlighted.
  monaco.languages.register({ id: 'vue' })
  monaco.languages.register({ id: 'typescript' })
  monaco.languages.register({ id: 'javascript' })

  // Register the themes from Shiki, and provide syntax highlighting for Monaco.
  shikiToMonaco(highlighter, monaco)

  editor.value = monaco.editor.create(editorRef.value!, props.options)
  editor.value.onDidChangeModelContent(() => {
    const v = editor.value?.getValue()
    if(v)
      value.value = v
  })
  initVimMode(editor.value, statusbarRef.value!)

  watch(() => props.options, (value) => {
    if (!value)
      return

    editor.value?.updateOptions(value)
  }, { deep: true })

  watchEffect(() => {
    editor.value?.updateOptions({
      theme: isDark.value ? 'vitesse-black' : 'vitesse-light',
    })
  })
})

defineExpose({
  id: props.id,
  instance: editor,
})
</script>

<template>
  <div grid="~ rows-[1fr_min-content]">
    <div relative>
      <div absolute inset-0 ref="editorRef" />
    </div>
    <div px4 py2 dark:bg-black>
      <div ref="statusbarRef" color-black font-mono dark:color-white />
    </div>
  </div>
</template>
