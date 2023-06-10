import * as vscode from 'vscode'
import { RegisterWebview } from '@vscode-use/registerwebview'
import { getwebviewHtml } from '../media/webviewHtml'
import { getwebviewScript } from '../media/webview'

export function webviewProvider(context: vscode.ExtensionContext, props: Record<string, any>, callback: (data: any) => void) {
  const provider = new RegisterWebview(
    context.extensionUri,
    getwebviewHtml(),
    ['https://unpkg.com/vue@3', 'https://unpkg.com/element-plus'],
    ['https://unpkg.com/element-plus/dist/index.css', 'style.css'],
    callback,
  )
  provider.deferScript(getwebviewScript(props))
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('DailyPlannerView.id', provider))
  return provider
}
