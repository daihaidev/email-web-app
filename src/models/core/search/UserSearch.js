import { reaction, makeAutoObservable } from 'mobx'
import intersection from 'lodash.intersection'

import { app } from 'app'

export class UserSearch {
  query

  results

  context

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

  get inboxIds() {
    const uniqInboxIds = []

    if (this.context && this.context.tickets && this.context.tickets.length > 0) {
      this.context.tickets.forEach(ticket => {
        if (!uniqInboxIds.includes(ticket.inbox_id)) uniqInboxIds.push(ticket.inbox_id)
      })
    }

    return uniqInboxIds
  }

  get suggestedIds() {
    if (this.inboxIds.length === 0) return []

    const suggestionLists = this.context.tickets.map(ticket =>
      (ticket.suggestions || []).filter(s => s.type === 'user').map(s => s.user_id)
    )
    return intersection(...suggestionLists)
  }

  search() {
    if (this.inboxIds.length === 0) {
      this.results = [this.getAssignToMe(), this.getUnassign()]
      return
    }

    // Get users for that are in all of the context inboxes
    const users = app.users
      .filter(user => this.inboxIds.every(id => user.group_ids.includes(id)))
      .map(user => ({
        key: user.id,
        id: user.id,
        name: user.name.toLowerCase(),
      }))

    if (this.query && this.query !== '') {
      // search name among the inboxes users
      this.results = users
        .filter(u => u.name.includes(this.query.toLowerCase()))
        .map(u => ({
          key: u.key,
          id: u.id,
        }))
    } else {
      // no search query, so filter out suggestions to the front
      const suggestions = users
        .filter(u => this.suggestedIds.includes(u.id))
        .map(u => ({ key: u.key, id: u.id, suggestion: true }))
      const rest = users
        .filter(u => !this.suggestedIds.includes(u.id))
        .map(u => ({
          key: u.key,
          id: u.id,
        }))

      this.results = [this.getAssignToMe(), ...suggestions, ...rest, this.getUnassign()]
    }
  }

  getAssignToMe() {
    return { key: 'me', id: app.currentUser.id }
  }

  getUnassign() {
    return { key: 'unassign', id: '' }
  }
}
