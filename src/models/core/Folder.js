import { observable, action, autorun, reaction, makeAutoObservable } from 'mobx'
import PubSub from 'pubsub-js'
import moment from 'moment'
import intersection from 'lodash.intersection'

import { Ticket } from 'models/core/Ticket'
import { sortable } from 'models/core/sortable'
import { app } from 'app'

export class Folder {
  id

  name

  count

  page

  transient

  tickets

  loaded

  inProgress

  constructor(data) {
    makeAutoObservable(this, {
      loadTickets: action,
    })

    this.page = 1
    this.count = null
    this.loaded = false

    Object.assign(this, data)

    // set up tickets after object is assigned
    this.tickets = sortable(observable([]), this.ticketComparator, target => {
      return target.map(ticket => this.sortFields.map(field => ticket[field]).join()).join()
    })

    autorun(() => {
      if (this.active && !this.loaded) {
        this.loadTickets()
      }
    })

    reaction(
      () => this.page,
      () => {
        this.resetTickets()
      }
    )

    reaction(
      () => this.active,
      () => {
        if (!this.active && this.activeTicket) this.activeTicket.kbFocus = false
      }
    )

    this.setupCriteria()
    PubSub.subscribe('StreamDispatcher_ticketUpdate', (type, ticket) => this.onUpdate(type, ticket))
  }

  get active() {
    return app.ui.inboxTab.activeFolder && app.ui.inboxTab.activeFolder.id === this.id
  }

  get visible() {
    if (this.transient) {
      return this.active || !!this.count
    }
    return true
  }

  get activeTicket() {
    return this.tickets.find(ticket => ticket.kbFocus === true)
  }

  get hasCurrPage() {
    return this.page <= Math.ceil(this.count / app.PAGE_SIZE)
  }

  get hasPrevPage() {
    return this.page > 1
  }

  get hasNextPage() {
    return this.page < Math.ceil(this.count / app.PAGE_SIZE)
  }

  get checkedTickets() {
    return this.tickets.filter(ticket => ticket.checked === true)
  }

  get checkedTicketsInboxId() {
    const inboxIds = new Set(this.checkedTickets.map(t => t.inbox_id))
    return inboxIds.size === 1 ? inboxIds.entries().next().value[0] : null
  }

  goToPrevPage() {
    if (this.hasPrevPage) {
      this.page -= 1
    }
  }

  goToNextPage() {
    if (this.hasNextPage) {
      this.page += 1
    }
  }

  resetTickets() {
    this.loaded = false
    this.tickets.replace([])
  }

  get timeField() {
    if (this.sort.includes('created_at')) return 'created_at'
    if (this.sort.includes('updated_at')) return 'updated_at'
    return 'waiting_since'
  }

  get sortFields() {
    const fields = [this.timeField]
    if (this.sort.includes('user_id')) fields.push('user_id')
    if (this.sort.includes('group_id')) fields.push('group_id')
    return fields
  }

  get indexOfPrevTicket() {
    const idx = this.activeTicket ? this.tickets.findIndex(ticket => ticket.id === this.activeTicket.id) : 0
    return idx - 1
  }

  get indexOfNextTicket() {
    const idx = this.activeTicket
      ? this.tickets.findIndex(ticket => ticket.id === this.activeTicket.id)
      : this.tickets.length

    return idx + 1 < this.tickets.length ? idx + 1 : -1
  }

  goToPrevTicket() {
    if (this.indexOfPrevTicket !== -1) {
      const model = this.tickets[this.indexOfPrevTicket]
      app.ui.inboxTab.setPreLoadedTicket(model)
      app.router.navigate('inbox.ticket', { id: model.id })
    }
  }

  goToNextTicket() {
    if (this.indexOfNextTicket !== -1) {
      const model = this.tickets[this.indexOfNextTicket]
      app.ui.inboxTab.setPreLoadedTicket(model)
      app.router.navigate('inbox.ticket', { id: model.id })
    }
  }

  loadTickets() {
    let url = `/tickets?nocache=${new Date().getTime()}&per_page=${app.PAGE_SIZE}&page=${this.page}&sort=${this.sort}`

    if (this.conditions) {
      url = `${url}&q=&conditions=${encodeURIComponent(JSON.stringify(this.conditions))}`
    } else {
      url = `${url}&${this.query}`
    }
    url += this.count === null ? '&count=true' : ''
    url = `/getTicketsForFolderPage/${this.id}/${this.page}`
    app.api.get(url).then(
      action(res => {
        this.tickets.push(...(res.data || []).map(ticketData => new Ticket(ticketData)))
        this.count = this.count === null ? res.headers['total-count'] : this.count
        this.loaded = true
      })
    )
  }

  onUpdate(type, data) {
    app.scheduler.eventually(() => {
      this.processUpdate(data)
    })
  }

  processUpdate(data) {
    const criteria = this.criteria(data)

    // handle inclusion in list
    if (this.loaded) {
      const ticket = this.tickets.find(t => t.id === data.id)

      if (ticket) {
        if (criteria && data.action !== 'delete') {
          if (this.fitsOnCurrentPage(data)) {
            const fields = Object.keys(data.changes)
            const silent = fields.length === 2 && fields.includes('marker_ids') && fields.includes('checksum')
            ticket.onUpdate('FolderList_ticketUpdate', data, { flash: !silent })
          } else {
            this.tickets.replace(this.tickets.slice().filter(t => t.id !== ticket.id))
          }
        } else {
          this.tickets.replace(this.tickets.slice().filter(t => t.id !== ticket.id))
        }
      } else if (criteria) {
        if (this.fitsOnCurrentPage(data)) {
          // slice to last but one, if it is already 50, we pop last one and then add new one
          const newTickets = this.tickets.slice(0, app.PAGE_SIZE - 1)
          newTickets.push(new Ticket(data))
          this.tickets.replace(newTickets)
        }
      }
    }

    // handle count update
    if (this.count !== null) {
      if (data.action === 'create') {
        if (criteria) this.count += 1
      } else if (data.action === 'delete') {
        if (criteria) this.count -= 1
      } else {
        const dataTemp = JSON.parse(JSON.stringify(data))
        const before_criteria = this.criteria(Object.assign(dataTemp, data.changes))

        if (before_criteria && !criteria) this.count -= 1
        if (!before_criteria && criteria) this.count += 1
      }
    }

    // Load next page if the current list is empty.
    if (this.tickets.length === 0 && this.loaded && this.hasCurrPage) {
      this.resetTickets()
      this.loadTickets()
    }
  }

  setupCriteria() {
    if (this.conditions) {
      this.criteria = data => {
        if (!app.currentUser.group_ids.includes(data.inbox_id)) return false

        let result
        return this.conditions.every(condition => {
          result = null
          switch (condition.type) {
            case 'user':
              result = condition.list.some(user => {
                if (user === '*') {
                  return data.user_id != null && data.user_id !== ''
                }
                if (user === '') {
                  return data.user_id === null || data.user_id === ''
                }
                return data.user_id === user
              })
              return condition.op === '!=' ? !result : result
            case 'group':
              result = condition.list.indexOf(data.group_id) !== -1
              return condition.op === '!=' ? !result : result
            case 'labels':
              result = intersection(condition.list, data.label_ids).length > 0
              return condition.op === '!=' ? !result : result
            case 'no_labels':
              return !data.label_ids || data.label_ids.length === 0
            case 'label_colors':
              result = intersection(condition.list, data.label_colors).length > 0
              return condition.op === '!=' ? !result : result
            case 'state':
              result = condition.list.includes(data.state)
              return condition.op === '!=' ? !result : result
            case 'ticket_type':
              result = condition.list.includes(data.type)
              return condition.op === '!=' ? !result : result
            case 'rating':
              result = condition.list.includes(data.rating)
              return condition.op === '!=' ? !result : result
            case 'outbox':
              return data.has_failed_messages === true
            case 'marker':
              return (data.marker_ids || []).includes(condition.value)
            case 'primary_states':
              return ['open', 'hold', 'snoozed', 'closed'].includes(data.state)
            default:
              // eslint-disable-next-line no-alert
              alert(`invalid condition type: ${condition.type}`)
              return false
          }
        })
      }
    } else if (this.id === 'spam') {
      this.discard = true
      this.criteria = data => {
        if (!app.currentUser.group_ids.includes(data.inbox_id)) return false
        return data.state === 'spam'
      }
    } else if (this.id === 'trash') {
      this.discard = true
      this.criteria = data => {
        if (!app.currentUser.group_ids.includes(data.inbox_id)) return false
        return data.state === 'trash'
      }
    }
  }

  fitsOnCurrentPage(data) {
    if (this.tickets.length === 0 || this.count < app.PAGE_SIZE) {
      return true
    }

    const model = new Ticket(data)
    const a = this.tickets[0] // first
    const b = this.tickets[this.tickets.length - 1] // last
    const ca = this.ticketComparator(a, model)
    const cb = this.ticketComparator(b, model)

    if (ca <= 0 && cb >= 0) {
      // a < model < b
      return true
    }
    if (ca >= 0 && this.page === 1) {
      // model < a
      return true
    }

    return false
  }

  get ticketComparator() {
    if (this.sort) {
      return (ticketA, ticketB) => {
        const sortFields = this.sort.split(',')

        let has_multi = false
        let field_ascending, field, extra, a, b, ea, eb

        if (sortFields.length === 1) {
          field_ascending = sortFields[0].indexOf('-') !== 0
          field = field_ascending ? sortFields[0] : sortFields[0].replace('-', '')
        } else {
          has_multi = true
          const extra_ascending = sortFields[0].indexOf('-') !== 0
          extra = extra_ascending ? sortFields[0] : sortFields[0].replace('-', '')
          field_ascending = sortFields[1].indexOf('-') !== 0
          field = field_ascending ? sortFields[1] : sortFields[1].replace('-', '')
        }

        if (field === 'updated_at' || field === 'created_at' || field === 'waiting_since') {
          a = parseInt(moment.utc(ticketA[field]).format('X'))
          b = parseInt(moment.utc(ticketB[field]).format('X'))
        }
        if (!field_ascending) {
          const tmp = a
          a = b
          b = tmp
        }

        if (extra === 'user_id') {
          ea = ticketA.user_id || ''
          eb = ticketB.user_id || ''
        } else if (extra === 'group_id') {
          ea = ticketA.group_id
          eb = ticketB.group_id
        }

        if (!has_multi || ea === eb) {
          if (a < b) return -1
          return b < a ? 1 : 0
        }

        if (ea < eb) return -1
        return eb < ea ? 1 : 0
      }
    }

    return (ticketA, ticketB) => {
      const ua = ticketA.user_id
      const ub = ticketB.user_id
      const a = parseInt(moment.utc(ticketA.updated_at).format('X'))
      const b = parseInt(moment.utc(ticketB.updated_at).format('X'))

      if (ua === ub) {
        if (a > b) return -1
        return b > a ? 1 : 0
      }
      if (ua < ub) return -1
      return ub < ua ? 1 : 0
    }
  }

  toggleCheckAllTickets() {
    const check = this.checkedTickets.length === this.tickets.length
    this.tickets.forEach(ticket => {
      ticket.checked = !check
    })
  }

  setActiveTicket(ticketId) {
    if (this.activeTicket) {
      this.activeTicket.kbFocus = false
    }

    this.tickets.find(ticket => ticket.id === ticketId).kbFocus = true
    // TODO need to handle ticket updates and keyboard shortcuts here
  }

  setStateBulk(state, snoozed_until = null) {
    this.bulkUpdatePatch({ state, snoozed_until })
  }

  assignUserBulk(user_id) {
    this.bulkUpdatePatch({ user_id })
  }

  moveToInboxBulk(inbox_id) {
    this.bulkUpdatePatch({ inbox_id })
  }

  addLabelBulk(label_id) {
    this.bulkUpdatePatch({ add_label_ids: [label_id] })
  }

  removeLabelBulk(label_id) {
    this.bulkUpdatePatch({ remove_label_ids: [label_id] })
  }

  bulkUpdatePatch(fields) {
    this.markBulkUpdate('start')
    app.api.patch(`/tickets?id=${this.checkedTickets.map(t => t.id).join()}`, fields).then(
      action(res => {
        if (res.status >= 200 && res.status <= 299) this.markBulkUpdate('end')
        app.streamDispatcher.getUpdatesAndResetUpdateTimer()
      })
    )
  }

  markBulkUpdate(mode = 'start') {
    this.inProgress = mode === 'start'
    this.checkedTickets.forEach(ticket => {
      ticket.inProgress = mode === 'start'
      if (mode === 'end') ticket.checked = false
    })
  }
}
