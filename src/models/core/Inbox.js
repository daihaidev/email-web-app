import { observable, makeAutoObservable } from 'mobx'

import { sortable, weightComparator } from 'models/core/sortable'

export class Inbox {
  weight

  collapsed

  constructor(data) {
    makeAutoObservable(this)

    this.folders = sortable(observable([]), weightComparator)

    Object.assign(this, data)
  }

  get visibleFoldersLength() {
    return this.folders.filter(f => f.visible).length
  }
}
