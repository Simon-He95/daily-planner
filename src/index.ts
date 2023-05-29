import fsp from 'node:fs/promises'
import * as vscode from 'vscode'
import { TodoDataProvider } from './todoModel'
import { compareDay, getCurrentDate, getDayFirst } from './common'

let timer: any = null
export async function activate(context: vscode.ExtensionContext) {
  let isClosed = false
  const todoDataProvider = new TodoDataProvider(context, () => {
    if (!isClosed && !todoDataProvider.hasTodo) {
      vscode.window.showInformationMessage('您还没有添加今日的计划，是否开启今日计划?', '添加计划', '忽略')
        .then((choice) => {
          if (choice === '添加计划')
            vscode.commands.executeCommand('workbench.view.extension.todoList')
          else
            isClosed = true
        })
    }
  })
  const DailyPlannerViewDisposable = vscode.window.registerTreeDataProvider('DailyPlannerView.id', todoDataProvider)

  // 开启一个定时任务去检测是否达到计划时间，提醒开始任务 每秒检测
  timer = setInterval(() => {
    if (!todoDataProvider.hasTodo || todoDataProvider.pending)
      return

    todoDataProvider.monitor().then((res) => {
      if (res === 'match') {
        setTimeout(() => {
          todoDataProvider.pending = false
        }, 60000)
      }
    })
  }, 1000)
  const addTodoDisposable = vscode.commands.registerCommand('todoList.addTodo', async () => {
    const todoLabel = (await vscode.window.showInputBox({
      prompt: '输入你的计划名',
      ignoreFocusOut: true,
      validateInput: value => value.trim() ? undefined : '计划名不能为空',
    }))?.trim()
    if (!todoLabel)
      return
    const time = (await vscode.window.showInputBox({
      prompt: '请输入计划开始时间(HH:mm) 24小时制',
      placeHolder: 'HH:mm',
      ignoreFocusOut: true,
      validateInput: value => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) ? undefined : '日期格式有误，参考格式:HH:mm',
    }))?.trim()

    if (time && todoLabel)
      todoDataProvider.addTodo({ name: todoLabel, time })
  })

  const addDailyTodoDisposable = vscode.commands.registerCommand('todoList.addDailyTodo', async () => {
    const todoLabel = (await vscode.window.showInputBox({
      prompt: '输入你的计划名',
      ignoreFocusOut: true,
      validateInput: value => value.trim() ? undefined : '计划名不能为空',
    }))?.trim()
    if (!todoLabel)
      return
    const time = (await vscode.window.showInputBox({
      prompt: '请输入计划开始时间(HH:mm) 24小时制',
      placeHolder: 'HH:mm',
      ignoreFocusOut: true,
      validateInput: value => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) ? undefined : '日期格式有误，参考格式:HH:mm',
    }))?.trim()

    if (time && todoLabel)
      todoDataProvider.addDailyTodo({ name: todoLabel, time })
  })
  const addDetailDisposable = vscode.commands.registerCommand('todoList.addDetail', async (todoItem) => {
    // todo: 点击弹出新的界面 -> 增加描述或者查看描述或者修改描述
    const detail = (await vscode.window.showInputBox({
      prompt: '输入一些详情描述',
      ignoreFocusOut: true,
      value: todoItem.detail,
      validateInput: value => value.trim() ? undefined : '详情描述不能为空',
    }))?.trim()
    if (detail)
      todoDataProvider.addDetail(todoItem, detail)
  })

  const generateReportDisposable = vscode.commands.registerCommand('todoList.generateReport', async (data) => {
    // 生成周报
    const today = getCurrentDate()
    const firstDay = getDayFirst()
    let result = '# Daily Planner 周报 \n\n'
    // 计算周一到今天的数据生成周报
    Object.keys(data).forEach((key) => {
      if (compareDay(key, firstDay) && compareDay(today, key)) {
        const { title, children } = data[key]
        result += `## ${title} \n`
        children.forEach((child: any) => {
          result += `- ${child.label}\n`
          result += ` - ${child.detail}\n`
        })
        result += '\n'
      }
    })
    // 生产markdown类型周报
    const folders = vscode.workspace.workspaceFolders
    if (!folders)
      return
    const rootpath = folders[0].uri.fsPath
    fsp.writeFile(`${rootpath}/daily-planner__report.md`, result, 'utf-8').catch((err) => {
      vscode.window.showErrorMessage(err.message)
    }).then(() => {
      vscode.window.showInformationMessage('Daily Planner 周报已生成在当前目录下')
    })
  })
  const deleteTodoDisposable = vscode.commands.registerCommand('todoList.deleteTodo', async (todoItem) => {
    if (!todoItem)
      return
    const confirm = await vscode.window.showWarningMessage(
      '是否确实要删除此计划?',
      { modal: true },
      '确认',
    )
    if (confirm === '确认') {
      // Delete the item
      todoDataProvider.deleteTodo(todoItem)
    }
  })
  const editTodoDisposable = vscode.commands.registerCommand('todoList.editTodo', async (todoItem) => {
    if (!todoItem)
      return
    const todoLabel = (await vscode.window.showInputBox({
      prompt: '输入你的计划名',
      value: todoItem.name,
      ignoreFocusOut: true,
      validateInput: value => value.trim() ? undefined : '计划名不能为空',
    }))?.trim()

    const time = (await vscode.window.showInputBox({
      prompt: '请输入计划开始时间(HH:mm) 24小时制',
      placeHolder: 'HH:mm',
      value: todoItem.time,
      ignoreFocusOut: true,
      validateInput: value => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) ? undefined : '日期格式有误，参考格式:HH:mm',
    }))?.trim()
    if (!time && !todoLabel)
      return
    // update todoList
    if (time)
      todoItem.time = time
    if (todoLabel)
      todoItem.label = todoItem.label.replace(`计划: ${todoItem.name}`, `计划: ${todoLabel}`)
    todoDataProvider.updateTodo(todoItem)
  })

  context.subscriptions.push(editTodoDisposable, deleteTodoDisposable, addDailyTodoDisposable, DailyPlannerViewDisposable, addTodoDisposable, addDetailDisposable, generateReportDisposable)
}

export function deactivate() {
  clearInterval(timer)
}
