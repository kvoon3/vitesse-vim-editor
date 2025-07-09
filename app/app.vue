<script setup lang="ts">
import type { EditorOptions } from './types'
// @ts-expect-error no type declare
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

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

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark'
    ? 'light'
    : 'dark'
}

// const value = useLocalStorage('vitesse-vim', defaultText)
const value = shallowRef(defaultText)
const languages = ['markdown', 'typescript', 'javascript'] as const
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
  language: 'markdown',
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
          <select id="language" v-model="options.language" name="language">
            <option v-for="lang in languages" :key="lang" :value="lang">
              {{ lang }}
            </option>
          </select>
        </div>
        <div flex gap-2 items-center>
          <input id="line-numbers" v-model="options.lineNumbers" type="checkbox">
          <label for="line-numbers">
            Line Numbers
          </label>
          <Icon
            :name="colorMode.value === 'dark'
              ? 'ph:moon-duotone'
              : 'ph:sun-duotone'"
            @click="toggleColorMode"
          />
        </div>
      </header>

      <div flex-1 />

      <a decoration-underline target="_blank" cursor-pointer href="https://github.com/kvoon3/vitesse-vim-editor" />
    </div>

    <Splitpanes flex-1>
      <Pane v-for="key in editorCount" :key>
        <MonacoEditor :id="key" v-model:value="value" h-full :options @sp="splitEditor" />
      </Pane>
      <Pane v-if="options.language === 'markdown'">
        <MarkdownPreview h-full :code="value" />
      </Pane>
    </Splitpanes>
  </div>
</template>
