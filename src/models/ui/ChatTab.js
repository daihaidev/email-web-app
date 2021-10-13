import { makeAutoObservable } from 'mobx'
import { app } from 'app'

export class ChatTab {
  constructor() {
    makeAutoObservable(this)
  }

  get active() {
    return app.router.route.name === 'chat'
  }
}
