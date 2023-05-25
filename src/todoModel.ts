import fs from 'node:fs'
import process from 'node:process'
import * as vscode from 'vscode'
import type { ExtensionContext } from 'vscode'
import { nanoid } from 'nanoid'
import { calculateTime, getCurrentDate, getDay } from './common'

export class TodoItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState)
  }
}

const __local__ = `${process.env.HOME}/daily_planner.json`
export class TodoDataProvider implements vscode.TreeDataProvider<TodoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TodoItem | undefined | void> = new vscode.EventEmitter<TodoItem | undefined | void>()
  readonly onDidChangeTreeData: vscode.Event<TodoItem | undefined | void> = this._onDidChangeTreeData.event

  private todos: Record<string, { id: string; name?: string; children?: TodoItem[]; time: string; datetime: string }> = {}
  id = '0'
  public pending = false
  extensionContext: ExtensionContext
  constructor(extensionContext: ExtensionContext, resolve: Function) {
    this.extensionContext = extensionContext
    // 读取本地配置，如果没有则初始化
    if (fs.existsSync(__local__)) {
      fs.promises.readFile(__local__, 'utf-8').then((config) => {
        if (!config) {
          setTimeout(() => resolve())
          return
        }
        const _config = JSON.parse(config)
        for (const key in _config) {
          const data = _config[key]
          const { id, title, children } = data
          const temp: any = {
            id,
            title,
            children: children.map((child: any) => {
              const { label, name, time, parent, id } = child
              const treeItem = new TodoItem(label, vscode.TreeItemCollapsibleState.None) as any
              treeItem.command = {
                command: 'todoList.select',
                title: label,
                tooltip: label,
                arguments: [treeItem],
              }
              treeItem.iconPath = {
                light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/plan.svg')),
                dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/plan.svg')),
              }
              this.id = id
              treeItem.id = String(id)
              treeItem.name = name
              treeItem.time = time
              treeItem.parent = parent
              return treeItem
            }),
            treeItem: new vscode.TreeItem(title, vscode.TreeItemCollapsibleState.Expanded),
          }
          this.todos[key] = temp
        }

        this.refresh()
        setTimeout(() => resolve())
      })
    }
    else {
      setTimeout(() => {
        resolve()
      })
    }
  }

  #init() {
    const add = '添加你的计划'
    const treeItem = new TodoItem(add, vscode.TreeItemCollapsibleState.None) as any
    treeItem.id = 'add plan'
    treeItem.command = {
      command: 'todoList.addTodo',
      title: add,
      tooltip: add,
    }

    treeItem.iconPath = {
      light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/add.svg')),
      dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/add.svg')),
    }

    return treeItem
  }

  #dailyInit() {
    const add = '添加每日提醒计划'
    const treeItem = new TodoItem(add, vscode.TreeItemCollapsibleState.None) as any
    treeItem.id = 'add dailyplan'
    treeItem.command = {
      command: 'todoList.addDailyTodo',
      title: add,
      tooltip: add,
    }

    treeItem.iconPath = {
      light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/add.svg')),
      dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/add.svg')),
    }

    return treeItem
  }

  #report() {
    const title = '生成本周周报'
    const treeItem = new TodoItem(title, vscode.TreeItemCollapsibleState.None) as any
    treeItem.id = 'generate report'
    treeItem.command = {
      command: 'todoList.generateReport',
      title,
      tooltip: title,
      arguments: [this.todos],
    }
    treeItem.iconPath = {
      light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/report.svg')),
      dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/report.svg')),
    }
    return treeItem
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  get hasTodo() {
    // 查看今日的计划是否有指定
    return !!this.todos[getCurrentDate()] || !!this.todos['每日提醒计划']?.children?.length
  }

  getTreeItem(element: any): vscode.TreeItem {
    return element.id === 'root' ? element.treeItem : element
  }

  getChildren(element?: any): Thenable<TodoItem[]> {
    if (element) {
      // sort: 做一个按照时间的排序
      return element.children && element.children.sort((a: any, b: any) => calculateTime(a.time) - calculateTime(b.time))
    }
    else {
      let maxNameLength = 0
      const label = '每日提醒计划'
      const treeItem = new TodoItem(label, vscode.TreeItemCollapsibleState.Expanded)
      const daily = {
        id: 'root',
        title: label,
        treeItem,
        children: [],
      }
      const today = getCurrentDate()
      const data = { [label]: daily, ...this.todos }
      const result = Object.keys(data).map((key: string) => {
        const item = (data as any)[key]
        if (key !== today && key !== label)
          item.treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        else
          item.treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Expanded

        const children = item.children!
        if (children.length) {
          children.forEach((child: any) => {
            maxNameLength = Math.max(child.name.length, maxNameLength)
          })
        }
        return item
      })

      // format:格式化内容 根据最长label整齐展示
      if (maxNameLength > 0) {
        result.map((item) => {
          if (item.children) {
            item.children = item.children.map((child: any) => {
              const num = maxNameLength - child.name.length
              if (num > 0) {
                const before = `计划: ${child.name}`
                child.label = child.label.replace(before, before + ' '.repeat(num))
              }
              return child
            })
          }
          return item
        })
      }
      // 添加每日循环计划
      result.unshift(this.#dailyInit())
      if (Object.keys(result).length) {
        // button: 添加生成周报
        result.unshift(this.#report())
      }

      // button: 添加你的计划
      result.unshift(this.#init())
      return result as any
    }
  }

  addTodo(option: { name: string; time: string }): void {
    const { name, time } = option
    const label = `计划: ${name}  ---  开始时间: ${time}`
    const treeItem = new TodoItem(label, vscode.TreeItemCollapsibleState.None) as any
    treeItem.command = {
      command: 'todoList.select',
      title: label,
      tooltip: label,
      arguments: [treeItem],
    }
    treeItem.iconPath = {
      light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/plan.svg')),
      dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/plan.svg')),
    }
    this.id = nanoid()

    treeItem.id = this.id
    treeItem.name = name
    treeItem.time = time
    const date = getCurrentDate()
    treeItem.datetime = `${date} ${time}`
    treeItem.parent = date
    const title = `${date} ${getDay()}`
    let temp: any = {
      id: 'root',
      title,
      children: [],
      treeItem: new vscode.TreeItem(title, vscode.TreeItemCollapsibleState.Expanded),
    }
    if (!this.todos[date])
      this.todos[date] = temp
    else
      temp = this.todos[date]

    temp.children.push(treeItem)

    this.refresh()
    this.#gerateLocalConfig()
  }

  addDailyTodo(option: { name: string; time: string }): void {
    const { name, time } = option
    const label = `计划: ${name}  ---  开始时间: ${time}`
    const treeItem = new TodoItem(label, vscode.TreeItemCollapsibleState.None) as any
    treeItem.command = {
      command: 'todoList.select',
      title: label,
      tooltip: label,
      arguments: [treeItem],
    }
    treeItem.iconPath = {
      light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/plan.svg')),
      dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/plan.svg')),
    }
    this.id = nanoid()

    treeItem.id = this.id
    treeItem.name = name
    treeItem.time = time
    const date = getCurrentDate()
    treeItem.datetime = `${date} ${time}`
    const title = '每日提醒计划'
    treeItem.parent = title
    let temp: any = {
      id: 'root',
      title,
      children: [],
      treeItem: new vscode.TreeItem(title, vscode.TreeItemCollapsibleState.Expanded),
    }
    if (!this.todos[title])
      this.todos[title] = temp
    else
      temp = this.todos[title]

    temp.children.push(treeItem)

    this.refresh()
    this.#gerateLocalConfig()
  }

  deleteTodo(item: any): void {
    const { parent, id } = item
    const idx = this.todos[parent]?.children?.findIndex((child: any) => child.id === id)
    this.todos[parent]?.children?.splice(idx!, 1)
    if (this.todos[parent]?.children?.length === 0) {
      // 删除这项
      delete this.todos[parent]
    }
    this.refresh()
    this.#gerateLocalConfig()
  }

  monitor() {
    const _datetime = this.#getTime()
    let arrivedPlan: any
    for (const key in this.todos) {
      const { children } = this.todos[key]
      arrivedPlan = children?.find((child: any) => child.datetime === _datetime)
      if (arrivedPlan)
        break
    }
    const now = new Date()
    const minutes = now.getMinutes().toString()
    const nowtime = `${now.getHours()}:${minutes.length < 2 ? `0${minutes}` : minutes}`
    if (!arrivedPlan) {
      this.todos['每日提醒计划']?.children?.some((child: any) => {
        if (child.time === nowtime) {
          arrivedPlan = child
          return true
        }
        return false
      })
    }
    this.pending = false
    if (!arrivedPlan)
      return Promise.resolve('no match')
    this.pending = true

    // 弹出提醒
    return new Promise((resolve) => {
      vscode.window.showInformationMessage(`Daily Planner计划提醒: \n${arrivedPlan.label}`, '好的')
      resolve('match')
    })
  }

  #getTime() {
    const now = new Date()
    return `${getCurrentDate()} ${now.getHours()}:${now.getMinutes()}`
  }

  #gerateLocalConfig() {
    // 每次新增或删除都同步到本地的文件中
    const data = JSON.stringify(Object.keys(this.todos).reduce((result, key) => {
      const { title, id, children } = this.todos[key] as any
      result[key] = {
        title,
        id,
        children: children?.map((child: any) => ({ id: child.id, label: child.label, name: child.name, time: child.time, parent: child.parent })),
      }
      return result
    }, {} as any))
    fs.promises.writeFile(__local__, data, 'utf-8')
  }
}
