import * as vscode from 'vscode'
import { createServer } from './server'

export function activate(context: vscode.ExtensionContext) {
  // todo: 起一个server存储数据
  createServer()
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.myCommand', () => {
      // 创建一个 WebviewPanel，并设置其标题和内容
      const panel = vscode.window.createWebviewPanel(
        'myView', // Webview 的唯一标识符
        'My View', // Webview 标题
        vscode.ViewColumn.One, // Webview 初始显示位置
        {},
      )
      panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
          body{
            display:flex;
            justify-content:center;
            padding-top:40px;
          }
        </style>
      </head>
      <body>
        <h1>Daily Planner</h1>
        <main>
          <input type="text" placeholder="填写计划" />
          <input type="time" placeholder="填写时间" />
        </main>
      </body>
      </html>
      `
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('myView.show', () => {
      const panel = vscode.window.createWebviewPanel(
        'myView', // Webview 的唯一标识符
        'My View', // Webview 标题
        vscode.ViewColumn.One, // Webview 初始显示位置
        {},
      )
      panel.webview.html = '<h1>Hello World!</h1>'
    }),
  )
}

export function deactivate() {

}
