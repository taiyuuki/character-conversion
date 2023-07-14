import type { DecorationOptions, TextEditor, TextEditorDecorationType } from 'vscode'
import { Range, window } from 'vscode'

import { equalDecorations, isNotNull } from './utils'

export interface ScopeItem {
  reg: RegExp
  target: string
  decorationType: TextEditorDecorationType
  group: number
  decorationOptions: DecorationOptions[]
  cache: DecorationOptions[]
}

export class CharacterConversion {
  scope: ScopeItem[]

  editor: TextEditor | undefined

  constructor() {
    this.scope = []
    this.editor = window.activeTextEditor
  }

  add(origin: RegExp | string, target: string, group?: number) {
    group ??= 0
    this.scope.push({
      reg: new RegExp(origin, 'g'),
      target,
      decorationType: window.createTextEditorDecorationType({
        before: { contentText: target },
        textDecoration: 'none; display: none;',
      }),
      group,
      decorationOptions: [],
      cache: [],
    })
  }

  reset() {
    this.scope.forEach(item => {
      item.decorationOptions.length = 0
      if (isNotNull(this.editor)) {
        this.editor.setDecorations(item.decorationType, [])
      }
    })
  }

  clear() {
    this.reset()
    this.scope = []
  }

  update() {
    const editor = this.editor
    const code = editor?.document.getText()
    if (isNotNull(code) && isNotNull(editor)) {
      const selectPst = editor.selection.active
      this.scope.forEach(item => {
        let match = item.reg.exec(code)
        item.decorationOptions.length = 0
        while (match && match[item.group]) {
          const groupStartIndex = match.index + match[0].indexOf(match[item.group])
          const groupEndIndex = groupStartIndex + match[item.group].length
          if (groupEndIndex === code.length) {
            break
          }
          const start = editor.document.positionAt(groupStartIndex)
          const end = editor.document.positionAt(groupEndIndex)
          const range = new Range(start, end)
          if (selectPst.isBefore(start) || selectPst.isAfter(end)) {
            item.decorationOptions.push({ range })
          }
          match = item.reg.exec(code)
        }
        if (equalDecorations(item.cache, item.decorationOptions)) {
          return
        }
        item.cache = [...item.decorationOptions]
        editor.setDecorations(item.decorationType, item.decorationOptions)
      })
    }
  }
}