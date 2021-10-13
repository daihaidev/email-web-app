import { action, reaction, autorun, makeAutoObservable } from 'mobx'
import intersection from 'lodash.intersection'

import { app } from 'app'

export class LabelSearch {
  query

  results

  context

  constructor() {
    makeAutoObservable(this, {
      updateSelections: action,
    })

    this.query = ''
    this.context = {}
    this.results = []

    reaction(
      () => [this.query, this.context, (this.context.tickets || []).map(t => t.inbox_id)],
      () => this.search()
    )

    autorun(() => {
      if (this.context && (this.context.tickets || []).map(t => t.label_ids)) {
        this.updateSelections()
      }
    })
  }

  get inboxIds() {
    const uniqInboxIds = []

    if (this.context && this.context.tickets && this.context.tickets.length > 0) {
      this.context.tickets.forEach(ticket => {
        if (!uniqInboxIds.includes(ticket.inbox_id)) uniqInboxIds.push(ticket.inbox_id)
      })
    }

    return uniqInboxIds
  }

  get selectedLabels() {
    if (this.inboxIds.length === 0) return []

    const selectedForAll = intersection(...this.context.tickets.map(ticket => ticket.label_ids))
    return app.labels
      .filter(label => selectedForAll.includes(label.id))
      .map(label => ({ id: label.id, selected: true }))
  }

  get availableLabels() {
    if (this.inboxIds.length === 0) return []

    return app.labels
      .filter(label => label.archived === false && this.inboxIds.every(id => label.group_ids.includes(id)))
      .map(label => ({ id: label.id }))
  }

  get suggestedIds() {
    if (this.inboxIds.length === 0) return []

    const suggestionLists = this.context.tickets.map(ticket =>
      (ticket.suggestions || []).filter(s => s.type === 'label').map(s => s.label_id)
    )
    return intersection(...suggestionLists)
  }

  search() {
    if (this.context && this.context.tickets && this.context.tickets.length > 0) {
      if (this.query === '') {
        const suggestions = this.suggestedIds
          .map(id => ({ id, suggestion: true }))
          .filter(s => !this.selectedLabels.find(sel => sel.id === s.id))

        const output = [...suggestions, ...this.selectedLabels]

        const rest = this.availableLabels.filter(r => !output.find(o => o.id === r.id)).map(l => ({ id: l.id }))

        this.results = [...output, ...rest]
      } else {
        // query was provided
        const availableForSearch = [...this.availableLabels.map(a => a.id), ...this.selectedLabels.map(s => s.id)]
        this.results = app.labels
          .filter(label => availableForSearch.find(id => id === label.id))
          .filter(label => label.name.toLowerCase().includes(this.query.toLowerCase()))
          .map(label => ({
            id: label.id,
            selected: this.selectedLabels.some(s => s.id === label.id),
          }))
      }
    } else {
      this.results = [] // no tickets in context
    }
  }

  updateSelections() {
    this.results.forEach(label => {
      label.selected = this.selectedLabels.find(s => s.id === label.id)
      if (label.selected && label.suggestion) {
        label.suggestion = false
      }
    })
  }
}
