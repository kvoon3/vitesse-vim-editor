<script setup lang="ts">
import type { EditorOptions } from './types'
// @ts-expect-error no type
import { Pane, Splitpanes } from 'splitpanes'

const defaultText = [
  '# Vitesse Vim',
  '',
  '[Github](https://github.com/kvoon3/vitesse-vim)',
  '',
  '```ts',
  'const name: string = "vitesse-vim-editor"',
  '',
  'function foo() {}',
  '```',
  '',
].join('\n')

const value = useLocalStorage('vitesse-vim', defaultText)

const languages = ['markdown', 'typescript', 'javascript'] as const

// const options = useLocalStorage<EditorOptions>('options', {
const language = useLocalStorage('lang', 'markdown')
const options = reactive<EditorOptions>({
  lineNumbers: 'off',
  value: value.value,
  theme: 'vitesse-dark',
  fontSize: 22,
  fontFamily: 'DM mono, monospace',
  quickSuggestions: true,
  suggest: {
    preview: true,
  },
  cursorSmoothCaretAnimation: 'on',
  language: language.value,
  cursorSurroundingLines: 2,
  padding: {
    bottom: 0,
  },
  colorDecorators: false,
  bracketPairColorization: {
    enabled: false,
    independentColorPoolPerBracketType: false,
  },
  tabSize: 2,
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
  scrollBeyondLastLine: false,
})

const editorCount = shallowRef(1)
function splitEditor() {
  editorCount.value += 1
}
</script>

<template>
  <div flex="~ col" h-100dvh dark:bg-black>
    <div p4 flex border="b base">
      <header flex="~ items-center gap4 ">
        <span text-xl color-teal-600 font-black font-mono>vitesse-vim</span>
        <!-- <button i-ph-arrow-counter-clockwise-duotone inline-block title="Reset" @click="value = defaultText" >Reset</button> -->
        <div class="btn">
          <select id="language" v-model="language" name="language">
            <option v-for="lang in languages" :key="lang" :value="lang">
              <label for="language" inline-block />
              {{ lang }}
            </option>
          </select>
        </div>
        <div space-x-1>
          <input id="line-numbers" v-model="options.lineNumbers" type="checkbox">
          <label for="line-numbers">
            Line Numbers
          </label>
        </div>
      </header>

      <div flex-1 />

      <a decoration-underline target="_blank" cursor-pointer href="https://github.com/kvoon3/vitesse-vim-editor" />
    </div>

    <Splitpanes>
      <Pane v-for="key in editorCount" :key>
        <Editor :id="key" v-model:value="value" h-full :options @sp="splitEditor" />
      </Pane>
      <Pane v-if="language === 'markdown'">
        <MarkdownPreview h-full :code="value" />
      </Pane>
    </Splitpanes>
  </div>
</template>

<style scoped>
.btn {
  --at-apply: flex gap1 items-center;
  /* --at-apply: border border-base p2 px4 rounded-full flex gap1 items-center; */
}
</style>
