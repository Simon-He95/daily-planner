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
    if (!todoDataProvider.hasTodo)
      return
    todoDataProvider.monitor()
  }, 1000)
  const addTodoDisposable = vscode.commands.registerCommand('todoList.addTodo', async () => {
    const todoLabel = (await vscode.window.showInputBox({
      prompt: '输入你的计划名',
      ignoreFocusOut: true,
      validateInput: value => value.trim() ? undefined : '计划名不能为空',
    }))?.trim()
    const time = (await vscode.window.showInputBox({
      prompt: '请输入计划开始时间(HH:mm) 24小时制',
      placeHolder: 'HH:mm',
      ignoreFocusOut: true,
      validateInput: value => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) ? undefined : '日期格式有误，参考格式:HH:mm',
    }))?.trim()

    if (time && todoLabel)
      todoDataProvider.addTodo({ name: todoLabel, time })
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
      todoDataProvider.deleteTodo(todoItem)
    }
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

  context.subscriptions.push(DailyPlannerViewDisposable, addTodoDisposable, selectTodoDisposable, generateReportDisposable)
}

export function deactivate() {
  clearInterval(timer)
}
