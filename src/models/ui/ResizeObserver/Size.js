import { autorun, makeAutoObservable } from 'mobx'

export class Size {
  width

  height

  named

  constructor(namedSizes) {
    makeAutoObservable(this)

    this.namedSizes = namedSizes
    this.named = {}

    autorun(() => {
      if (this.namedSizes) {
        Object.keys(this.namedSizes).forEach(key => {
          this.named[key] = this.namedSizes[key](this)
        })
      }
    })
  }
}
