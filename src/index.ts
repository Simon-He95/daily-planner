import fsp from 'node:fs/promises'
import * as vscode from 'vscode'
import ClaudeApi from 'anthropic-ai'
import { CreateWebview } from '@vscode-use/createwebview'
import { initVue } from '../media/main.js'
import { TodoDataProvider } from './todoModel'
import { calculateTime, compareDay, getCurrentDate, getDayFirst } from './common'
// import { CreateWebview } from './createWebview'

let timer: any = null
let claude: ClaudeApi
// 使用webview的方式来增加、修改、查看任务
export async function activate(context: vscode.ExtensionContext) {
  const { avater, name } = vscode.workspace.getConfiguration('daily-planner')
  let isClosed = false
  const provider = new CreateWebview(
    context.extensionUri,
    'Daily planner',
    ['https://unpkg.com/vue@2/dist/vue.js', 'https://unpkg.com/element-ui/lib/index.js'],
    ['reset.css', 'https://unpkg.com/element-ui/lib/theme-chalk/index.css', 'main.css'])

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
    if (provider.isActive())
      provider.destory()

    createForm('add', (data) => {
      const { type, value } = data
      if (type === 'error') {
        vscode.window.showErrorMessage(value)
      }
      else {
        const { name, time, detail } = value
        const processDetail = detail.replace(/\n/g, '\\n')

        todoDataProvider.addTodo({ name, time, detail: processDetail })
        vscode.window.showInformationMessage('提交成功')
      }
    })
  })

  const addDailyTodoDisposable = vscode.commands.registerCommand('todoList.addDailyTodo', async () => {
    if (provider.isActive())
      provider.destory()

    createForm('add', (data) => {
      const { type, value } = data
      if (type === 'error') {
        vscode.window.showErrorMessage(value)
      }
      else {
        const { name, time, detail } = value
        const processDetail = detail.replace(/\n/g, '\\n')

        todoDataProvider.addDailyTodo({ name, time, detail: processDetail })
        vscode.window.showInformationMessage('提交成功')
      }
    })
  })
  let reportIsWorking = false
  const generateReportDisposable = vscode.commands.registerCommand('todoList.generateReport', async (data, title) => {
    if (reportIsWorking)
      return vscode.window.showInformationMessage('当前正在生成中，请耐心等待...')
    // 生成周报
    const isWeekly = title === '生成周报'
    const today = getCurrentDate()
    const firstDay = getDayFirst()

    let result = ''
    if (isWeekly) {
      result = '# Daily Planner 周报 \n\n'
      // 计算周一到今天的数据生成周报
      Object.keys(data).forEach((key) => {
        if (compareDay(key, firstDay) && compareDay(today, key)) {
          const { title, children } = data[key]
          result += `## ${title} \n`
          children.forEach((child: any) =>
            result += `- 🎯 ${child.name} &nbsp;&nbsp;&nbsp;&nbsp; ⏰ ${child.time} ${calculateTime(child.time) > calculateTime('1:00') ? 'AM' : 'PM'} ${child.detail ? `&nbsp;&nbsp;&nbsp;&nbsp; 💬 ${child.detail}` : ''}\n`,
          )
          result += '\n'
        }
      })
    }
    else {
      result = '# Daily Planner 日报 \n\n'
      const list = data[today]
      if (!list)
        return vscode.window.showInformationMessage('今天还没有填写任何计划呢')

      const { title, children } = list
      result += `## ${title} \n`
      children.forEach((child: any) =>
        result += `- 🎯 ${child.name} &nbsp;&nbsp;&nbsp;&nbsp; ⏰ ${child.time} ${calculateTime(child.time) > calculateTime('1:00') ? 'AM' : 'PM'} ${child.detail ? `&nbsp;&nbsp;&nbsp;&nbsp; 💬 ${child.detail}` : ''}\n`,
      )
      result += '\n'
    }
    reportIsWorking = true

    // 生产markdown类型周报
    const folders = vscode.workspace.workspaceFolders
    if (!folders)
      return
    try {
      if (!claude)
        claude = new ClaudeApi('')
      const summary = await claude.complete(`假设你是一个写${isWeekly ? '周' : '日'}报的达人,请你能根据我以下给出的markdown格式内容,进行提炼、润色和总结,给出这样的结果"## 本周计划总结: 提炼的总结\n## 工作中遇到的问题: \n如果有,则总结, 无则写无\n"\n\n注意不要生成额外冗余的信息\n\n
        ${result}`, {
        model: 'claude-v1.3-100k',
      })
      result += `${summary.trim()}`
    }
    catch (error) {
    }

    const rootpath = folders[0].uri.fsPath
    // 根据操作的日期对应文件名
    const reportUri = `${rootpath}/daily-planner__${isWeekly ? 'week' : 'day'}-report-${today}.md`
    fsp.writeFile(reportUri, result, 'utf-8').catch((err) => {
      vscode.window.showErrorMessage(err.message)
    }).then(() => {
      vscode.window.showInformationMessage(`Daily Planner ${isWeekly ? '周' : '日'}报已生成在当前目录下`, `打开${isWeekly ? '周' : '日'}报`).then((val) => {
        reportIsWorking = false
        if (val)
          vscode.workspace.openTextDocument(reportUri).then(doc => vscode.window.showTextDocument(doc))
      })
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
    if (provider.isActive())
      provider.destory()
    createForm('edit', (data) => {
      const { type, value } = data
      if (type === 'error') {
        vscode.window.showErrorMessage(value)
      }
      else {
        const { name, time, detail } = value
        const processDetail = detail.replace(/\n/g, '\\n')
        todoItem.label = todoItem.label.replace(`开始时间: ${todoItem.time}`, `开始时间: ${time}`)
        todoItem.time = time
        todoItem.label = todoItem.label.replace(`计划: ${todoItem.name}`, `计划: ${name}`)
        todoItem.name = name
        todoItem.label = todoItem.label.replace(`详情: ${todoItem.detail}`, `详情: ${processDetail}`)
        todoItem.detail = processDetail
        todoDataProvider.updateTodo(todoItem)
        vscode.window.showInformationMessage('修改成功')
        provider.destory()
      }
    }, todoItem)
  })

  const viewTodoDisposable = vscode.commands.registerCommand('todoList.view', async (todoItem) => {
    if (provider.isActive())
      provider.destory()
    createForm('view', () => { }, todoItem)
  })

  context.subscriptions.push(editTodoDisposable, viewTodoDisposable, deleteTodoDisposable, addDailyTodoDisposable, DailyPlannerViewDisposable, addTodoDisposable, generateReportDisposable)

  function createForm(status: 'add' | 'view' | 'edit', callback: (data: any) => void, form: any = {}) {
    provider.deferScript(`
    <script>
    ${initVue(form)}
    </script>
    `)
    const title = status === 'add'
      ? 'Daily Planner Add Page'
      : status === 'view'
        ? 'Daily Planner View Page'
        : 'Daily Planner Edit Page'
    return provider.create(`
    <div id="app">
      <a href="https://github.com/Simon-He95/daily-planner" class="github-corner" aria-label="View source on GitHub">
        <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
        </svg>
      </a>
      <div class="user">
        <div class="bg"></div>
        <div class="avater">
          <el-avatar src="${avater || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'}" alt="${name || 'User'}"></el-avatar>
          <div class="name" data-name="${name}">${name || 'User'}</div>
        </div>
        <div class="title">${title}</div>
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="计划名称" :rules="[
          { required: true, message: '请输入计划名称', trigger: 'blur' },
        ]">
          <el-input ${status === 'view' ? 'disabled' : ''} placeholder="需求、计划或者任务名称" v-model="form.name" clearable></el-input>
        </el-form-item>
      
        <el-form-item label="开始时间" :rules="[
          { required: true, message: '请输入开始时间', trigger: 'blur' },
        ]">
          <el-time-select
            v-model="form.time"
            ${status === 'view' ? 'disabled' : ''}
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '24:00'
            }"
            clearable
            placeholder="选择时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="具体描述">
          <el-input type="textarea" placeholder="描述一下具体的工作的进度，时间分配，遇到的问题等等" ${status === 'view' ? 'disabled' : ''} v-model="form.detail" :rows="10" clearable></el-input>
        </el-form-item>
        <el-form-item v-if=${status !== 'view'}>
          <el-button type="primary" @click="submitForm('formRef')">${status === 'add' ? '添加' : '修改'}计划</el-button>
          <el-button @click="resetForm('formRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    `, callback)
  }
}

export function deactivate() {
  clearInterval(timer)
}
