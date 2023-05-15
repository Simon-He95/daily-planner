import * as vscode from 'vscode'
import { TodoDataProvider } from './todoModel'
import { getCurrentDate } from './common'

let timer: any = null
export function activate(context: vscode.ExtensionContext) {
  let isClosed = false
  const todoDataProvider = new TodoDataProvider()
  if (!isClosed && !todoDataProvider.hasTodo) {
    vscode.window.showInformationMessage('您还没有添加今日的计划，是否开启今日计划?', '添加计划', '忽略')
      .then((choice) => {
        if (choice === '添加计划')
          vscode.commands.executeCommand('workbench.view.extension.todoList')
        else
          isClosed = true
      })
  }
  context.subscriptions.push(vscode.window.registerTreeDataProvider('todoTreeView', todoDataProvider))

  // 开启一个定时任务去检测是否达到计划时间，提醒开始任务 每秒检测
  timer = setInterval(() => {
    if (!todoDataProvider.hasTodo)
      return
    todoDataProvider.monitor()
  }, 1000)
  const addTodoDisposable = vscode.commands.registerCommand('todoList.addTodo', async () => {
    const todoLabel = await vscode.window.showInputBox({ prompt: '输入你的计划名' })
    const dateTime = await vscode.window.showInputBox({
      prompt: '请输入计划开始时间(HH:mm)',
      ignoreFocusOut: true,
      validateInput: (value) => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        return regex.test(value) ? undefined : 'Invalid time format'
      },
    })

    if (dateTime && todoLabel) {
      const date = getCurrentDate()
      todoDataProvider.addTodo({ name: todoLabel, time: `${date} ${dateTime}` })
    }
  })

  const selectTodoDisposable = vscode.commands.registerCommand('todoList.select', async (todoItem) => {
    if (!todoItem)
      return
    const confirm = await vscode.window.showWarningMessage(
      '是否确实要删除此计划?',
      { modal: true },
      '确认',
    )
    if (confirm === '确认') {
      // Delete the item
      todoDataProvider.deleteTodo(todoItem.id)
    }
  })

  context.subscriptions.push(addTodoDisposable, selectTodoDisposable)
}

export function deactivate() {
  clearInterval(timer)
}
