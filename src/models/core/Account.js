import { makeAutoObservable } from 'mobx'

export class Account {
  id

  constructor(data) {
    makeAutoObservable(this)

    Object.assign(this, data)
  }
}
