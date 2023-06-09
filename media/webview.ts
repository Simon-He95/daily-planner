export function getwebviewScript(props: Record<string, any>) {
  const { modelData, mode } = props

  return `
  <script>
  const vscode = acquireVsCodeApi()

  const App = {
    data() {
      return {
        closeLoading: false,
        mode: ${mode},
        large: true,
        maxWidth:'auto',
        dataSource: ${JSON.stringify(modelData)},
      }
    },
    mounted(){
      this.maxWidth = this.setLarge()
      setTimeout(()=>{
        this.closeLoading = true
      }, 500)
      window.addEventListener('resize',()=>{
        this.maxWidth = this.setLarge()
      })
    },
    methods:{
      setLarge(){
        const width = window.innerWidth;
        if(width < 480){
          this.large = false
        }else {
          this.large = true
        }
        return width - 220 + 'px'
      },
      getTitle(data){
        const { name, time, detail } = data
        let result = ''
        if(name){
          result += "计划: " + name
        }
        if(time){
          result += " --- 开始时间: " + time
        }
        if(detail){
          result += " --- 详情: " + detail
        }
        return result
      },
      switchMode(){
        this.mode = !this.mode
        vscode.postMessage({ type: 'switchMode', value: this.mode })
      },
      view(node, data){
        if(!data.children)
          vscode.postMessage({ type: 'view', value: JSON.stringify(data) })
      },
      update(node, data){
        vscode.postMessage({ type: 'update', value: JSON.stringify(data) })
      },
      remove(node, data){
        this.$alert('是否删除该计划 ?', {
          confirmButtonText: "确认",
          showCancelButton:true,
          cancelButtonText:"取消",
          callback: action => {
            if(action === 'confirm')
              vscode.postMessage({ type: 'remove', value: JSON.stringify(data) })
          }
        });
      },
      add(value){
        vscode.postMessage({ type: 'add', value })
      },
      weekReport(){
        const treeEl = this.$refs.treeEl
        if(!treeEl)
          return
        const filterTopNode = []
        const checkKeys = treeEl.getCheckedKeys()
        this.dataSource.forEach(item => {
          if(checkKeys.includes(item.id))
            filterTopNode.push(item.id)
        })
        const value = {
          type: 'week',
          selections: filterTopNode
        }
        vscode.postMessage({ type: 'report', value: JSON.stringify(value) })
      },
      dayReport(e,node,data){
        e.stopPropagation()
        const value = {
          type: 'day',
          selections: [data.id]
        }
        vscode.postMessage({ type: 'report', value: JSON.stringify(value) })
      }
    }
  };
  const app = Vue.createApp(App);
  app.use(ElementPlus);
  app.mount("#app");
  </script>
  `
}
