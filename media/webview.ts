export function getwebviewScript(props: Record<string, any>) {
  const { modelData, mode } = props

  return `
  <script>
  const vscode = acquireVsCodeApi()

  const App = {
    data() {
      return {
        mode: ${mode},
        large: true,
        maxWidth:'auto',
        dataSource: ${JSON.stringify(modelData)},
      }
    },
    mounted(){
      this.maxWidth = this.setLarge()
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

      },
      dayReport(e,node){
        e.stopPropagation()
        this.$message({
          type:"success",
          message:"调用日报api"
        })
      }
    }
  };
  const app = Vue.createApp(App);
  app.use(ElementPlus);
  app.mount("#app");
  </script>
  `
}
