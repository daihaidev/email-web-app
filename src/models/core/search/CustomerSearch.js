import { action, reaction, makeAutoObservable } from 'mobx'

import { app } from 'app'
import { Customer } from 'models/core/Customer'

export class CustomerSearch {
  query

  results

  constructor() {
    makeAutoObservable(this)

    this.query = ''
    this.results = []

    reaction(
      () => [this.query, this.page],
      () => this.search()
    )
  }

  search() {
    if (!this.query) {
      this.results = []
      return
    }

    // console.log('query in search model:', this.query)
    const encodedUri = encodeURIComponent(`${this.query}*`)

    app.api.get(`/customers?q=${encodedUri}`).then(
      action(res => {
        this.results = (res.data || []).map(data => new Customer(data))
        // console.log('got from server', JSON.parse(JSON.stringify(this.results)))
      })
    )
  }
}
