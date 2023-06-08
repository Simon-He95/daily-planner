export function getwebviewScript(mode: 'light' | 'dark') {
  return `
  <script>
  const vscode = acquireVsCodeApi()

  const App = {
    data() {
      return {
        mode: "${mode}",
        large: true,
        maxWidth:'auto',
        dataSource: [
          {
            id: 1,
            label: 'Level one 1',
            children: [
              {
                id: 9,
                label: 'Level three 1-1-1',
                time:'10:00',
                detail:'吃早饭'
              },
              {
                id: 10,
                label: 'Level three 1-1-2',
              },
            ],
          },
          {
            id: 2,
            label: 'Level one 2',
            children: [
              {
                id: 5,
                label: 'Level two 2-1',
              },
              {
                id: 6,
                label: 'Level two 2-2',
              },
            ],
          },
        ]
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
        return width - 250 + 'px'
      },
      getTitle(data){
        const { label, time, detail } = data
        let result = ''
        if(label){
          result += "计划: " + label
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
        if(this.mode==='light')
          this.mode = 'dark'
        else
          this.mode = 'light'
        vscode.postMessage({ type: 'switchMode', value: this.mode })
      },
      view(node, data){
        if(node.isLeaf)
          vscode.postMessage({ type: 'view', value:JSON.stringify(data) })

          this.$message({
            type:"success",
            message:"调用详情api"
          })
      },
      update(node){
        this.$message({
          type:"success",
          message:"调用修改api"
        })
      },
      remove(node){
        this.$message({
          type:"success",
          message:"调用删除api"
        })
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
