<script setup lang="ts">
import type { EditorOptions } from './types'
import 'splitpanes/dist/splitpanes.css'
// @ts-expect-error no type
import { Splitpanes, Pane } from 'splitpanes'

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

const options = reactive<EditorOptions>({
  lineNumbers: 'off',
  value: value.value,
  theme: 'vitesse-dark',
  fontSize: 22,
  fontFamily: 'DM mono, monospace',
  // cursorSmoothCaretAnimation: 'on',
  language: 'markdown',
  cursorSurroundingLines: 2,
  padding: {
    bottom: 0,
  },
  bracketPairColorization: {
    enabled: false,
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
          <label i-catppuccin-markdown for="language" inline-block />
          <select id="language" name="language" value="markdown">
            <option value="markdown">
              markdown
            </option>
          </select>
        </div>
        <div space-x-1>
          <input type="checkbox" id="line-numbers" v-model="options.lineNumbers" />
          <label  for="line-numbers" >
            Line Numbers
          </label>
        </div>
      </header>

      <div flex-1 />

      <a decoration-underline target="_blank" cursor-pointer href="https://github.com/kvoon3/vitesse-vim-editor">
        Github
      </a>
    </div>

    <Splitpanes>
      <Pane v-for="key in editorCount" :key>
        <Editor ref="editor" :id="key"  v-model:value="value" @sp="splitEditor" h-full :options />
      </Pane>
      <Pane>
       <MarkdownPreview  h-full :code="value" />
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
