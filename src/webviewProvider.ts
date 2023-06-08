import * as vscode from 'vscode'
import { RegisterWebview } from '@vscode-use/registerwebview'
import { getwebviewHtml } from '../media/webviewHtml'
import { getwebviewScript } from '../media/webview'

export function webviewProvider(context: vscode.ExtensionContext, callback: (data: any) => void) {
  let mode: 'light' | 'dark' = 'light'

  const provider = new RegisterWebview(
    context.extensionUri,
    getwebviewHtml(),
    ['https://unpkg.com/vue@3', 'https://unpkg.com/element-plus'],
    ['https://unpkg.com/element-plus/dist/index.css', 'style.css'],
    (data) => {
      const { type, value } = data
      if (type === 'switchMode')
        mode = value
      else
        callback(data)
    },
  )
  provider.deferScript(getwebviewScript(mode))
  vscode.window.registerWebviewViewProvider('DailyPlannerView.id', provider)
}
