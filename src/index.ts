import * as vscode from 'vscode'
import { CreateWebview } from '@vscode-use/createwebview'
import { message } from '@vscode-use/utils'
import { initVue } from '../media/main'
import { getwebviewScript } from '../media/webview'
import { getwebviewHtml } from '../media/webviewHtml'
import { webviewProvider } from './webviewProvider'
import { addData, generateModelData, generateReport, getData, reminder, removeData, updateData } from './getData'

let timer: any = null
// 使用webview的方式来增加、修改、查看任务
export async function activate(context: vscode.ExtensionContext) {
  const { avater, name } = vscode.workspace.getConfiguration('daily-planner')
  let modelData = generateModelData(await getData())
  let switchvalue = false
  // const isClosed = false
  const provider = new CreateWebview(
    context.extensionUri,
    'Daily planner',
    [{
      enforce: 'pre',
      src: 'https://unpkg.com/vue@2/dist/vue.js',
    }, {
      enforce: 'pre',
      src: 'https://unpkg.com/element-ui/lib/index.js',
    }],
    ['reset.css', 'https://unpkg.com/element-ui/lib/theme-chalk/index.css', 'main.css'],
  )

  // 开启一个定时任务去检测是否达到计划时间，提醒开始任务 每秒检测
  timer = setInterval(() =>
    reminder(modelData), 1000)

  function createForm(status: 'add' | 'view' | 'edit', callback: (data: any) => void, form: any = {}) {
    provider.deferScript(`
    <script>
    ${initVue(form, switchvalue)}
    </script>
    `)
    const title = status === 'add'
      ? 'Daily Planner Add Page'
      : status === 'view'
        ? 'Daily Planner View Page'
        : 'Daily Planner Edit Page'
    return provider.create(`
    <div id="app" :class="[switchvalue && 'dark']">
      <div class="loading" :class="[closeLoading && 'closeLoading']">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="#ffffff"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="#ffffff"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="#ffffff"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>
      </div>
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
      <div @click="changeMode" class="mode">
        <svg v-if="switchvalue" class="inline" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.5em" height="1.5em" style="vertical-align: sub;">
          <path fill="rgb(97, 97, 97)" d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938A7.999 7.999 0 0 0 4 12z">
          </path>
        </svg>
        <svg v-else class="inline" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.5em" height="1.5em" style="vertical-align: sub;">
          <path fill="rgb(251, 133, 55)" d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636L5.636 7.05L3.515 4.93zM16.95 18.364l1.414-1.414l2.121 2.121l-1.414 1.414l-2.121-2.121zm2.121-14.85l1.414 1.415l-2.121 2.121l-1.414-1.414l2.121-2.121zM5.636 16.95l1.414 1.414l-2.121 2.121l-1.414-1.414l2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z">
          </path>
        </svg>
      </div>
    </div>
    `, callback)
  }

  const webview = webviewProvider(context,
    {
      mode: switchvalue,
      modelData,
    },
    async (data: any) => {
      const { type, value } = data
      if (type === 'view') {
        const todoItem = JSON.parse(value)
        if (provider.isActive())
          provider.destory()
        createForm('view', () => { }, todoItem)
      }
      else if (type === 'switchMode') {
        switchvalue = value
      }
      else if (type === 'update') {
        if (provider.isActive())
          provider.destory()
        const oldData = JSON.parse(value)
        createForm('edit', async (data) => {
          const { type, value } = data
          if (type === 'error') {
            message.error(value)
          }
          else if (type === 'submit') {
            // 更新文件
            await updateData(oldData, value)
            // 通知视图更新
            modelData = generateModelData(await getData())
            webview.deferScript(getwebviewScript({
              mode: switchvalue,
              modelData,
            }))
            webview.refresh(getwebviewHtml())
            message('修改成功')
            provider.destory()
          }
        }, oldData)
      }
      else if (type === 'remove') {
        await removeData(JSON.parse(value))
        // 通知视图更新
        modelData = generateModelData(await getData())
        webview.deferScript(getwebviewScript({
          mode: switchvalue,
          modelData,
        }))
        webview.refresh(getwebviewHtml())
        message('删除成功')
        provider.destory()
      }
      else if (type === 'add') {
        createForm('add', async (data) => {
          const { type, value: _value } = data
          if (type === 'error') {
            message.error(value)
          }
          else if (type === 'submit') {
            await addData(_value, value)
            // 通知视图更新
            modelData = generateModelData(await getData())
            webview.deferScript(getwebviewScript({
              mode: switchvalue,
              modelData,
            }))
            webview.refresh(getwebviewHtml())
            message('提交成功')
          }
        })
      }
      else if (type === 'report') {
        const { type, selections } = JSON.parse(value)
        await generateReport(type, selections)
      }
    })
}

export function deactivate() {
  clearInterval(timer)
}
