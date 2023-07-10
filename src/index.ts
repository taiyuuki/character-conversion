import type * as vscode from 'vscode'
import { window, workspace } from 'vscode'
import { CharacterConversion } from './conversion'
import { isNotEmptyString, throttle } from './utils'

export function activate(context: vscode.ExtensionContext) {
  const conversion = new CharacterConversion()
  let config = workspace.getConfiguration()

  function setScope() {
    conversion.clear()
    isNotEmptyString(config.characterConversion.arrow)
    && conversion.add(/=>/g, config.characterConversion.arrow)
    isNotEmptyString(config.characterConversion.equal)
    && conversion.add(/===?/g, config.characterConversion.equal)
    isNotEmptyString(config.characterConversion.notequal)
    && conversion.add(/!==?/g, config.characterConversion.notequal)
    isNotEmptyString(config.characterConversion.notless)
    && conversion.add(/>=/g, config.characterConversion.notless)
    isNotEmptyString(config.characterConversion.notmore)
    && conversion.add(/<=/g, config.characterConversion.notmore)

    const rules = config.characterConversion.rules as [string, string, number | undefined][]
    rules.forEach(rule => {
      if (isNotEmptyString(rule[0]) && isNotEmptyString(rule[1])) {
        conversion.add(rule[0], rule[1], rule[2] ?? 0)
      }
    })
  }

  const triggerUpdate = throttle(() => {
    conversion.update()
  }, 500)

  window.onDidChangeActiveTextEditor(
    (currentEditor) => {
      conversion.editor = currentEditor
      conversion.reset()
      if (conversion.editor) {
        triggerUpdate()
      }
    },
    null,
    context.subscriptions
  )

  workspace.onDidChangeTextDocument(
    triggerUpdate,
    null,
    context.subscriptions
  )

  window.onDidChangeTextEditorSelection((e) => {
    if (!e.kind || !e.textEditor) {return}
    triggerUpdate()
  },
  null,
  context.subscriptions
  )

  workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('characterConversion')) {
      config = workspace.getConfiguration()
      setScope()
    }
  },
  null,
  context.subscriptions
  )

  setScope()
  triggerUpdate()
}

// deactivate方法会在插件失活时调用
export function deactivate(context: vscode.ExtensionContext) {
  context.subscriptions.forEach((d) => d.dispose())
}