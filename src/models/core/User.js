import { makeAutoObservable } from 'mobx'

export class User {
  first_name

  last_name

  preferences

  avatar_url

  constructor(data) {
    makeAutoObservable(this)

    Object.assign(this, data)
  }

  get name() {
    return `${this.first_name} ${this.last_name}`
  }
}
