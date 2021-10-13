import { action, reaction, makeAutoObservable } from 'mobx'
import debounce from 'lodash.debounce'

import { app } from 'app'
import { Ticket } from 'models/core/Ticket'

export class TicketSearch {
  query

  page

  count

  results

  constructor() {
    makeAutoObservable(this)

    this.query = ''
    this.page = 1
    this.results = []

    this.getResultsDebounced = debounce(() => {
      this.getResults()
    }, 500)

    reaction(
      () => [this.query, this.page],
      () => this.search()
    )
  }

  search() {
    if (!this.query) this.results = []

    this.getResultsDebounced()
  }

  getResults() {
    const encodedUri = encodeURIComponent(this.query)

    // &conditions=${conditions}, no sort, no pre filtering
    app.api.get(`/tickets?count=true&q=${encodedUri}&page=${this.page}&per_page=10&sort=-updated_at`).then(
      action(res => {
        this.count = res.headers['total-count']
        this.results = (res.data || []).map(ticketData => new Ticket(ticketData))
      })
    )
  }
}
