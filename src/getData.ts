import fs from 'node:fs'
import { nanoid } from 'nanoid'
import { calculateTime, getCurrentDate } from './common'

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
      const { children, title } = data[key]
      const temp: any = {
        label: title,
        id: nanoid(),
      }
      if (children) {
        temp.children = children.map((child: any) => {
          const { detail, label, id, name, parent, time } = child
          return {
            detail,
            label,
            id,
            name,
            parent,
            time,
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
  debugger
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
