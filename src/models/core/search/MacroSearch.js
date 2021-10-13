import { action, reaction, makeAutoObservable } from 'mobx'
import intersection from 'lodash.intersection'

import { app } from 'app'
import { Macro } from 'models/core/Macro'

export class MacroSearch {
  query

  results

  context

  showSearch = true

  constructor() {
    makeAutoObservable(this)

    this.query = ''
    this.context = {}
    this.results = []

    reaction(
      () => [this.query, this.context, (this.context.tickets || []).map(t => t.inbox_id)],
      () => this.search()
    )
  }

  get isDisabled() {
    return this.inboxId === null
  }

  get inboxId() {
    if (this.context && this.context.tickets && this.context.tickets.length > 0) {
      const inboxIds = this.context.tickets.map(t => t.inbox_id)
      const uniqInboxId = inboxIds[0]

      if (inboxIds.some(id => id !== uniqInboxId)) return null

      return uniqInboxId
    }
    return null
  }

  get suggestedIds() {
    if (!this.inboxId) return []

    const suggestionLists = this.context.tickets.map(ticket =>
      (ticket.suggestions || []).filter(s => s.type === 'macro').map(s => s.macro_id)
    )
    return intersection(...suggestionLists)
  }

  search() {
    if (this.isDisabled) {
      this.results = []
      return
    }

    let url = `group_id=${this.inboxId}`

    if (this.query && this.query !== '') {
      url += `&q=${encodeURIComponent(`${this.query}*`)}`

      app.api.get(`/macros?${url}&per_page=50`).then(
        action(res => {
          this.results = (res.data || []).map(data => new Macro(data))
        })
      )
    } else {
      // no search query, so get all macros for inbox
      app.api.get(`/macros?${url}&per_page=100`).then(res => this.loadDefaultResults(res.data || []))
    }
  }

  loadDefaultResults(allResults) {
    const suggestions = allResults.filter(r => this.suggestedIds.includes(r.id)).map(m => ({ ...m, suggestion: true }))
    const rest = allResults.filter(r => !this.suggestedIds.includes(r.id))

    this.results = [...suggestions, ...rest].map(data => new Macro(data))
  }
}
