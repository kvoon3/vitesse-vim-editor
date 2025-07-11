<script setup lang="ts">
import type { EditorOptions } from '../types'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor'
// @ts-expect-error no type declare
import { initVimMode, VimMode } from 'monaco-vim'
import { createHighlighter } from 'shiki'
import './worker'

const props = defineProps<{
  id: number
  options?: EditorOptions
}>()

const emits = defineEmits<{
  (e: 'sp'): void
}>()
const value = defineModel('value', { default: '' })

const colorMode = useColorMode()

const editorRef = useTemplateRef('editorRef')
const statusbarRef = useTemplateRef('statusbarRef')
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>()

const model = monaco.editor.createModel(
  value.value,
  props.options?.language,
)

const { Vim } = VimMode
Vim.defineEx('split', 'sp', () => emits('sp'))
Vim.defineEx('split', 'sp', () => emits('sp'))
Vim.map('<C-a>', 'ggVG', 'normal')
Vim.unmap('<Space>')
// Vim.defineAction('githubMdCheckbox', (cm: any) => {
//   Vim.handleEx(cm, 's/\[\s\]/[x]/g')
//   Vim.handleEx(cm, 'nohls')
//   Vim.handleKey(cm, 'h')
//   Vim.handleKey(cm, 'j')
//   Vim.handleKey(cm, 'j')
// })
// Vim.mapCommand('<Space>s', 'action', 'githubMdCheckbox')

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
      'markdown',
    ],
  })

  // Register the themes from Shiki, and provide syntax highlighting for Monaco.
  shikiToMonaco(highlighter, monaco)

  editor.value = monaco.editor.create(editorRef.value!, {
    ...props.options,
    model,
  })
  editor.value.onDidChangeModelContent(() => {
    const v = editor.value?.getValue()
    if (v)
      value.value = v
  })
  initVimMode(editor.value, statusbarRef.value!)

  watch(() => props.options, (value) => {
    if (!value)
      return

    // FIXME: theme may already changed
    editor.value?.updateOptions(objectOmit(value, ['theme']))
  }, { deep: true })
  watch(() => props.options?.language, (value) => {
    if (!value)
      return

    monaco.editor.setModelLanguage(model, value)
  })

  watchEffect(() => {
    editor.value?.updateOptions({
      theme: colorMode.value === 'dark' ? 'vitesse-black' : 'vitesse-light',
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
      <div ref="editorRef" inset-0 absolute />
    </div>
    <div px4 py2 dark:bg-black>
      <div ref="statusbarRef" color-black font-mono dark:color-white />
    </div>
  </div>
</template>
