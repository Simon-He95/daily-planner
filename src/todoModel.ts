import fs from 'node:fs'
import process from 'node:process'
import * as vscode from 'vscode'
import { getCurrentDate } from './common'

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

  private todos: TodoItem[] = []
  id = 0
  constructor(resolve: Function) {
    // 读取本地配置，如果没有则初始化
    if (fs.existsSync(__local__)) {
      fs.promises.readFile(__local__, 'utf-8').then((config) => {
        const date = getCurrentDate()
        const data = JSON.parse(config)[date]
        if (!data) {
          this.#init()
          return
        }
        const { id, map } = data
        this.id = id
        map.forEach((item: any) => {
          const { label, id, name, time } = item
          const treeItem = new TodoItem(label, vscode.TreeItemCollapsibleState.None) as any
          treeItem.command = {
            command: 'todoList.select',
            title: label,
            tooltip: label,
            arguments: [treeItem],
          }
          treeItem.id = String(this.id)
          treeItem.name = name
          treeItem.time = time
          this.id = id
          this.todos.push(treeItem)
        })
        this.refresh()
        resolve()
      })
    }
    else {
      this.#init()
      resolve()
    }
  }

  #init() {
    const add = '+ 添加你的计划'
    const treeItem = new TodoItem(add, vscode.TreeItemCollapsibleState.None)
    treeItem.id = 'add plan'
    treeItem.command = {
      command: 'todoList.addTodo',
      title: add,
      tooltip: add,
    }
    this.todos.push(treeItem)
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  get hasTodo() {
    return this.todos.length > 1
  }

  getTreeItem(element: TodoItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: TodoItem): Thenable<TodoItem[]> {
    if (element)
      return Promise.resolve([])

    else
      return Promise.resolve(this.todos)
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
    treeItem.id = String(this.id)
    treeItem.name = name
    treeItem.time = time
    this.id = this.id + 1
    this.todos.push(treeItem)
    this.refresh()
    this.#gerateLocalConfig()
  }

  deleteTodo(id: string): void {
    this.todos = this.todos.filter(todo => todo.id !== id)
    this.refresh()
    this.#gerateLocalConfig()
  }

  monitor() {
    const nowTime = this.#getTime()
    const arrivedPlan = this.todos.find((todo: any) => nowTime === todo.time)
    if (!arrivedPlan)
      return
    // 弹出提醒
    vscode.window.showInformationMessage(`Daily Planner计划提醒: \n${arrivedPlan.label}`)
  }

  #getTime() {
    const now = new Date()
    return `${getCurrentDate()} ${now.getHours()}:${now.getMinutes()}`
  }

  #gerateLocalConfig() {
    // 每次新增或删除都同步到本地的文件中
    const map: any[] = []
    const date = getCurrentDate()
    this.todos.forEach((item: any) => {
      const { id, time, name, label } = item
      map.push({
        id,
        time,
        name,
        label,
      })
    })
    const data = JSON.stringify({
      [date]: { map, id: this.id },
    })
    fs.promises.writeFile(__local__, data, 'utf-8')
  }
}
