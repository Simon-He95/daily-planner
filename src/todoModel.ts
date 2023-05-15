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

export class TodoDataProvider implements vscode.TreeDataProvider<TodoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TodoItem | undefined | void> = new vscode.EventEmitter<TodoItem | undefined | void>()
  readonly onDidChangeTreeData: vscode.Event<TodoItem | undefined | void> = this._onDidChangeTreeData.event

  private todos: TodoItem[] = []
  id = 0
  constructor() {
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
  }

  deleteTodo(id: string): void {
    this.todos = this.todos.filter(todo => todo.id !== id)
    this.refresh()
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
}
