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

  private todos: Record<string, { id: string; name?: string;children?: TodoItem[] }> = {}
  id = 0
  constructor(resolve: Function) {
    // 读取本地配置，如果没有则初始化
    // if (fs.existsSync(__local__)) {
    //   fs.promises.readFile(__local__, 'utf-8').then((config) => {
    //     const date = getCurrentDate()
    //     const data = JSON.parse(config)[date]
    //     if (!data) {
    //       this.#init()
    //       return
    //     }
    //     const { id, map } = data
    //     this.id = id
    //     map.forEach((item: any) => {
    //       const { label, id, name, time } = item
    //       if (id === 'add plan')
    //         return this.#init()

    //       const treeItem = new TodoItem(label, vscode.TreeItemCollapsibleState.None) as any
    //       treeItem.command = {
    //         command: 'todoList.select',
    //         title: label,
    //         tooltip: label,
    //         arguments: [treeItem],
    //       }
    //       treeItem.id = String(this.id)
    //       treeItem.name = name
    //       treeItem.time = time
    //       this.id = id
    //       this.todos.push(treeItem)
    //     })
    //     this.refresh()
    //     setTimeout(() => resolve())
    //   })
    // }
    // else {
    this.#init()
    setTimeout(() => {
      resolve()
    })
    // }
  }

  #init() {
    const add = '+ 添加你的计划'
    const treeItem = new TodoItem(add, vscode.TreeItemCollapsibleState.None) as any
    treeItem.id = 'add plan'
    treeItem.command = {
      command: 'todoList.addTodo',
      title: add,
      tooltip: add,
    }
    return treeItem
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  get hasTodo() {
    return Object.keys(this.todos).length > 1
  }

  getTreeItem(element: any): vscode.TreeItem {
    return element.id === 'root' ? element.treeItem : element
  }

  getChildren(element?: any): Thenable<TodoItem[]> {
    if (element) {
      return element.children
    }
    else {
      const result = Object.keys(this.todos).map((key) => {
        return this.todos[key]
      })
      result.unshift(this.#init())
      return result as any
      // return Promise.resolve()
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
    treeItem.id = String(this.id)
    treeItem.name = name
    treeItem.time = time
    const date = getCurrentDate()
    treeItem.parent = date

    let temp: any = {
      id: 'root',
      title: date,
      children: [],
      treeItem: new vscode.TreeItem(getCurrentDate(), vscode.TreeItemCollapsibleState.Expanded),
    }
    if (!this.todos[date])
      this.todos[date] = temp
    else
      temp = this.todos[date]

    temp.children.push(treeItem)

    this.id = this.id + 1
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
    // const date = getCurrentDate()
    // Object.keys(this.todos).forEach(todo=>{
    //   const
    // })
    // this.todos.forEach((item: any) => {
    //   const { id, time, name, label } = item
    //   map.push({
    //     id,
    //     time,
    //     name,
    //     label,
    //   })
    // })
    debugger
    const data = JSON.stringify(this.todos)
    fs.promises.writeFile(__local__, data, 'utf-8')
  }
}
