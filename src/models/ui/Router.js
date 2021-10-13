import { makeAutoObservable } from 'mobx'
import { createRouter } from 'router5'
import browserPlugin from 'router5-plugin-browser'

export class Router {
  route

  constructor() {
    makeAutoObservable(this)

    this.routes = [
      {
        name: 'inbox',
        path: '/inbox',
        children: [
          { name: 'ticket', path: '/ticket/:id' },
          { name: 'folder', path: '/folder/:id' },
          { name: 'draft', path: '/draft/:id' },
          { name: 'draftInbox', path: '/draft/:id?:inbox_id' },
          { name: 'split', path: '/draft/split/:id?:ticket_id&:message_id' },
          { name: 'forward', path: '/draft/forward/:id?:ticket_id' },
        ],
      },
      { name: 'chat', path: '/chat' },
      {
        name: 'dev',
        path: '/dev',
        children: [{ name: 'icons', path: '/icons' }],
      },
    ]

    this.router5 = createRouter(this.routes, {
      defaultRoute: 'inbox',
    })
    this.router5.setRootPath('/spa')
    this.router5.usePlugin(browserPlugin())
    this.router5.subscribe(transition => this.setState(transition))
    this.router5.start()
  }

  get primaryPath() {
    return this.route.name.split('.')[0]
  }

  get secondaryPath() {
    return this.route.name.split('.')[1]
  }

  navigate(name, params, options, done) {
    this.router5.navigate(name, params, options, done)
  }

  back() {
    window.history.back()
  }

  setState(transition) {
    this.route = transition.route
  }
}
