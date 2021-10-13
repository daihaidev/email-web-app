import { autorun, makeAutoObservable } from 'mobx'
import { app } from 'app'

export class DevTab {
  activePage

  get active() {
    return app.router.primaryPath === 'dev'
  }

  constructor() {
    makeAutoObservable(this)

    autorun(() => {
      if (this.active) {
        this.activePage = app.router.secondaryPath
      }
    })
  }
}
