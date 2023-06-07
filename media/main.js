// @ts-check

export function initVue(form = {
  name: '',
  time: '',
  detail: '',
}, switchvalue) {
  const { name = '', time = '', detail = '' } = form
  return `
  const vscode = acquireVsCodeApi()

  setTimeout(()=>{
    new Vue({
      el: '#app',
      data() {
        return {
          switchvalue: ${switchvalue},
          form: {
            name: "${name}",
            time: "${time}",
            detail: "${detail}"
          },
        }
      },
      methods: {
        changeMode(){
          this.switchvalue = !this.switchvalue
          vscode.postMessage({ type: 'switchMode', value: this.switchvalue })
        },
        submitForm() {
          if (!this.form.name) {
            this.$message({
              message: '请先填写计划名称!',
              type: 'error',
            })
            vscode.postMessage({ type: 'error', value: '请先填写计划名称!' })
          }
          else if (!this.form.time) {
            this.$message({
              message: '请先填写开始时间!',
              type: 'error',
            })
            vscode.postMessage({ type: 'error', value: '请先填写开始时间!' })
          }
          else {
            vscode.postMessage({ type: 'submit', value: this.form })
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            this.resetForm()
          }
        },
        resetForm() {
          this.form.name = ''
          this.form.time = ''
          this.form.detail = ''
        },
      },
    })
  })
 
  `
}
