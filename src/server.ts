import Koa from 'koa'
import Router from 'koa-router'

export function createServer(port = 9999) {
  const app = new Koa()
  const router = new Router()

  router.get('/', (ctx, next) => {
    ctx.body = 'Hello World!'
    console.log('ssss')
    next()
  })

  app.use(router.routes())
  app.listen(port, () => {
    console.log('9999 start')
  })
}
