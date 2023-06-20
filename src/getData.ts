import fs from 'node:fs'
import * as vscode from 'vscode'
import { nanoid } from 'nanoid'
import ClaudeApi from 'anthropic-ai'
import { createProgress, message, openFile } from '@vscode-use/utils'
import { calculateTime, compareDay, getCurrentDate, getDayFirst, getNowTime } from './common'

const __local__ = `${process.env.HOME}/daily_planner.json`
let originData: any = {}
const DAT_TITLE = '每日提醒计划'
export function getData() {
  return new Promise((resolve) => {
    const result: any = {
      [DAT_TITLE]: {
        title: DAT_TITLE,
        id: nanoid(),
        children: [],
      },
    }
    if (!fs.existsSync(__local__)) {
      resolve(result)
      return
    }

    fs.promises.readFile(__local__, 'utf-8').then((config) => {
      if (config) {
        const _config = JSON.parse(config)
        for (const key in _config) {
          const data = _config[key]
          const { id, title, children } = data
          const temp: any = {
            id,
            title,
            children: children.map((child: any) => {
              child.isAm = calculateTime(child.time) < calculateTime('13:00')
              return child
            }),
          }
          result[key] = temp
        }
      }
      originData = result
      resolve(result)
    })
  })
}

export function generateModelData(data: any) {
  const keys = Object.keys(data)
  const modelData: any = []

  if (keys.length) {
    for (const key of keys) {
      const { children, title, id } = data[key]
      const temp: any = {
        label: title,
        id,
      }
      if (children) {
        temp.children = children.map((child: any) => {
          const { detail, label, id, name, parent, time, isAm } = child
          return {
            detail,
            label,
            id,
            name,
            parent,
            time,
            isAm,
          }
        })
      }
      else {
        temp.children = []
      }
      modelData.push(temp)
    }
  }

  return modelData
}

export async function updateData(oldData: any, data: any) {
  const { name, time, detail } = data
  const { parent, id } = oldData
  originData[parent].children.map((child: any) => {
    if (child.id === id) {
      child.name = name
      child.time = time
      child.detail = detail.replace(/\n/g, '\\n')
      child.label = `计划: ${name} --- 开始时间: ${time} --- 详情: ${detail}`
    }
    return child
  })
  // 写入文件
  try {
    await fs.writeFileSync(__local__, JSON.stringify(originData), 'utf-8')
  }
  catch (error: any) {
    throw new Error(error.message)
  }
}

export async function removeData(data: any) {
  const { parent, id } = data
  const idx = originData[parent].children.findIndex((child: any) => child.id === id)
  originData[parent].children.splice(idx!, 1)
  if (originData[parent].children.length === 0) {
    // 删除这项
    delete originData[parent]
  }
  // 写入文件
  try {
    await fs.writeFileSync(__local__, JSON.stringify(originData), 'utf-8')
  }
  catch (error: any) {
    throw new Error(error.message)
  }
}

export async function addData(data: any, type: 'day' | 'plan') {
  const { name, detail, time } = data
  const label = `计划: ${name} --- 开始时间: ${time}${detail ? ` --- 详情: ${detail}` : ''}`
  const isAm = calculateTime(time) < calculateTime('13:00')

  if (type === 'day') {
    originData[DAT_TITLE].children.push({
      name,
      detail: detail.replace(/\n/g, '\\n'),
      time,
      label,
      isAm,
      parent: DAT_TITLE,
    })
  }
  else {
    const id = nanoid()
    const today = getCurrentDate()
    const temp = {
      label,
      isAm,
      id,
      time,
      detail,
      name,
      parent: today,
    }
    if (!originData[today]) {
      originData[today] = {
        id: nanoid(),
        name: today,
        title: today,
        children: [temp],
      }
    }
    else {
      originData[today].children.push(temp)
    }
  }

  // 写入文件
  try {
    await fs.writeFileSync(__local__, JSON.stringify(originData), 'utf-8')
  }
  catch (error: any) {
    throw new Error(error.message)
  }
}

let reportIsWorking = false
let claude: ClaudeApi

export async function generateReport(type: 'day' | 'week', selections: string[]) {
  const folders = vscode.workspace.workspaceFolders
  if (!folders)
    return message.error('当前目录路径不存在')

  if (reportIsWorking) {
    message('当前正在生成中，请耐心等待...')
    return
  }
  let isDone = false
  let timer: any = null
  createProgress({
    title: '当前正在生成中...',
    done(report) {
      report({ message: '当前正在生成中...', increment: 10 })
      setTimeout(() => {
        if (!isDone)
          report({ message: '当前正在生成中...', increment: 20 })
      }, 200)
      setTimeout(() => {
        if (!isDone)
          report({ message: '当前正在生成中...', increment: 50 })
      }, 400)
      setTimeout(() => {
        if (!isDone)
          report({ message: '当前正在生成中...', increment: 70 })
      }, 800)
      return new Promise((resolve) => {
        timer = setInterval(() => {
          if (isDone) {
            clearInterval(timer)
            resolve()
          }
        }, 1000)
      })
    },
  })

  // 生成周报
  const isWeekly = type === 'week'
  const today = getCurrentDate()
  const firstDay = getDayFirst()
  let result = isWeekly
    ? '# Daily Planner 周报 \n\n'
    : '# Daily Planner 日报 \n\n'

  if (selections.length) {
    // 如果勾选了，则从勾选日期中生成报告
    Object.keys(originData).forEach((key) => {
      const value = originData[key]
      if (selections.includes(value.id)) {
        const { title, children } = value
        result += `## ${title} \n`
        children.forEach((child: any) =>
          result += `- 🎯 ${child.name} &nbsp;&nbsp;&nbsp;&nbsp; ⏰ ${child.time} ${calculateTime(child.time) > calculateTime('1:00') ? 'AM' : 'PM'} ${child.detail ? `&nbsp;&nbsp;&nbsp;&nbsp; 💬 ${child.detail}` : ''}\n`,
        )
        result += '\n'
      }
    })
  }
  else {
    // 计算周一到今天的数据生成周报
    Object.keys(originData).forEach((key) => {
      if (compareDay(key, firstDay) && compareDay(today, key)) {
        const { title, children } = originData[key]
        result += `## ${title} \n`
        children.forEach((child: any) =>
          result += `- 🎯 ${child.name} &nbsp;&nbsp;&nbsp;&nbsp; ⏰ ${child.time} ${calculateTime(child.time) > calculateTime('1:00') ? 'AM' : 'PM'} ${child.detail ? `&nbsp;&nbsp;&nbsp;&nbsp; 💬 ${child.detail}` : ''}\n`,
        )
        result += '\n'
      }
    })
  }

  reportIsWorking = true

  // 生产markdown类型周报
  try {
    // 如果第一次失败了，那么第二次如果有其他ai选择就替换，设置一个超时时间
    let pending = true
    const TIME_OUT = 20000
    if (!claude)
      claude = new ClaudeApi('')
    setTimeout(() => {
      if (pending)
        throw new Error('Claud请求超时')
    }, TIME_OUT)
    const summary = await claude.complete(`假设你是一个写${isWeekly ? '周' : '日'}报的达人,请你能根据我以下给出的markdown格式内容,进行提炼、润色和总结,给出这样的结果"## 本周计划总结: 提炼的总结\n## 工作中遇到的问题: \n如果有,则总结, 无则写无\n"\n\n注意不要生成额外冗余的信息\n\n
      ${result}`, {
      model: 'claude-v1.3-100k',
    })
    pending = false
    result += `${summary.trim()}`
  }
  catch (error) {
    // 如果claude 失败使用别的ai替代
  }

  const rootpath = folders[0].uri.fsPath
  // 根据操作的日期对应文件名
  const reportUri = `${rootpath}/daily-planner__${isWeekly ? 'week' : 'day'}-report-${today}.md`
  fs.promises.writeFile(reportUri, result, 'utf-8').then(() => {
    message.info(
      {
        message: `Daily Planner ${isWeekly ? '周' : '日'}报已生成`,
        buttons: [`打开${isWeekly ? '周' : '日'}报`],
      },
    ).then((val) => {
      reportIsWorking = false
      if (val)
        openFile(reportUri)
    })
  }).catch((err) => {
    message.error(err.message)
  }).finally(() => {
    isDone = true
  })
}
let REMIND_STATUS = false
export function reminder(data: any[]) {
  if (!data.length || REMIND_STATUS)
    return

  const target = data.find(item => item.time === getNowTime())
  if (target) {
    REMIND_STATUS = true
    message.info({
      message: `Daily Planner计划提醒: \n${target.label}`,
      buttons: ['好的'],
    })
    setTimeout(() => {
      REMIND_STATUS = false
    }, 60000)
  }
}
