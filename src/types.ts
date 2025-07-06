import type { editor } from 'monaco-editor'

export type EditorOptions = Exclude<Parameters<typeof editor.create>[1], undefined>
