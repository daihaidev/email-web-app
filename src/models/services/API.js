import { toJS } from 'mobx'

import { app } from 'app'
import { Ticket } from '../core/Ticket'
import { Customer } from '../core/Customer'

export class API {
  constructor(token) {
    this.lastNum = 20
    this.token = token
  }

  get(url) {
    return new Promise((resolve, reject) => {
      if (url.startsWith('/customers')) {
        const result = this.pretendGet(url)
        if (result.ok === true) {
          resolve(result)
        } else {
          reject(result)
        }
      } else {
        setTimeout(() => {
          const result = this.pretendGet(url)
          if (result.ok === true) {
            resolve(result)
          } else {
            reject(result)
          }
        }, 300)
      }
    })
  }

  pretendGet(url) {
    // eslint-disable-next-line no-unused-vars
    const [slash, path, id, part1] = url.split(/[/?]/)
    const result = { ok: true }
    const query = (id || '').toLowerCase()
    let data, inboxId, searchText

    switch (true) {
      case path === 'tickets' && id.startsWith('q=customer_id'): // recent tickets
        ;[searchText, ...data] = id.slice(14).split('&')
        result.data = app.tickets
          .filter(t => t.customer_id === searchText && !['spam', 'trash', 'draft'].includes(t.state))
          .slice(0, 4)
          .map(t => toJS(t))
        return result
      case path === 'tickets' && query.startsWith('count=true&q='): // ticket search
        ;[searchText, ...data] = query.slice(13).split('&')
        searchText = searchText.replaceAll('%20', ' ')
        result.data = app.tickets
          .filter(
            t =>
              t.subject.toLowerCase().includes(searchText) ||
              t.summary.toLowerCase().includes(searchText) ||
              t.customer_name.toLowerCase().includes(searchText)
          )
          .map(t => toJS(t))
        result.headers = {
          'total-count': result.data.length,
        }
        return result
      case path === 'tickets' && part1.startsWith('embed='): // ticket load
        data = toJS(app.tickets.find(t => t.id === id))
        if (data) {
          data.customer = toJS(app.customers.find(x => x.id === data.customer_id))
          result.data = data
          return result
        }
        return {
          response: {
            status: id === 'ticket-403' ? 403 : 404,
          },
        }
      case path === 'tickets' && part1 === 'events': // events
        result.data = app.auditEvents[id] || []
        return result
      case path === 'getTicketsForFolderPage': // folder tickets
        switch (true) {
          case id === 'folder-0-1' && part1 === '1':
            data = app.tickets.slice(0, 5).map(t => toJS(t))
            break
          case id === 'folder-0-1' && part1 === '2':
            data = app.tickets.slice(5, 8).map(t => toJS(t))
            break
          case id === 'folder-0-2' && part1 === '1':
            data = app.tickets.slice(1, 6).map(t => toJS(t))
            break
          case id === 'folder-0-2' && part1 === '2':
            data = app.tickets.slice(6, 7).map(t => toJS(t))
            break
          case id === 'folder-0-3' && part1 === '1':
            data = app.tickets.slice(2, 7).map(t => toJS(t))
            break
          case id === 'spam' && part1 === '1':
            data = app.tickets.filter(t => t.state === 'spam').map(t => toJS(t))
            break
          case id === 'trash' && part1 === '1':
            data = app.tickets.filter(t => t.state === 'trash').map(t => toJS(t))
            break
          default:
            data = []
        }

        data.map(d => delete d.messages)

        result.data = data
        result.headers = {
          'total-count': data.length,
        }
        return result
      case path === 'macros' && query.startsWith('group_id='): // macros
        ;[inboxId, searchText] = query
          .slice(9)
          .replaceAll(/(&q=|&per_page)/g, ',')
          .split(',')
          .slice(0, query.includes('&q=') ? 2 : 1)
        result.data = app.macros
          .filter(m => m.inbox_id === inboxId && (!searchText || m.name.toLowerCase().match(searchText)))
          .map(t => toJS(t))
        return result
      case path === 'customers': // customers
        // eslint-disable-next-line prefer-destructuring
        searchText = query.split('q=')[1].replaceAll('%20', ' ')
        result.data = app.customers
          .filter(c => c.name.toLowerCase().match(searchText) || c.primaryContact.toLowerCase().match(searchText))
          .map(c => toJS(c))
        return result
      default:
        return null
    }
  }

  patch(url, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.pretendPatch(url, data)
        if (result.ok === true) {
          resolve(result)
        } else {
          reject(result)
        }
      }, 300)
    })
  }

  // eslint-disable-next-line no-unused-vars
  pretendPatch(url, data) {
    // eslint-disable-next-line no-unused-vars
    const [slash, path, id, part1, part2] = url.split(/[/?]/)
    const result = { ok: true, status: 200 }
    let ids, changes, ticket

    switch (true) {
      case path === 'tickets':
        ids = id.startsWith('id=') ? id.split(/[=,]/).slice(1) : [id]
        ids.forEach(tid => {
          ticket = app.tickets.find(t => t.id === tid)
          changes = {}
          this.doChangesOnTicket(ticket, data, changes)

          if (Object.keys(changes).length > 0) {
            // if anything changed, also update time
            changes.updated_at = ticket.updated_at
            ticket.updated_at = new Date().toISOString()

            const updateObj = toJS(ticket)
            updateObj.changes = changes
            // send out updates
            app.streamDispatcher.sendTicketUpdates(updateObj)
          }

          if (!id.startsWith('id=')) {
            // single ticket update, send new ticket data in result
            result.data = toJS(ticket)
          }
        })
        return result
      default:
        return null
    }
  }

  // Need to add pretend message post and patch update,
  // Need to add pretend customer post and patch update,
  // and send out update feeds from streamDispatcher

  put(url, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.pretendPut(url, data)
        if (result.ok === true) {
          resolve(result)
        } else {
          reject(result)
        }
      }, 300)
    })
  }

  // eslint-disable-next-line no-unused-vars
  pretendPut(url, data) {
    // eslint-disable-next-line no-unused-vars
    const [slash, path, id, part1, part2] = url.split(/[/?]/)
    const result = { ok: true }
    let ticket, newLabelIds, oldTicket

    switch (true) {
      case path === 'tickets' && part1 === 'labels':
        ticket = app.tickets.find(t => t.id === id)
        oldTicket = JSON.parse(JSON.stringify(ticket))

        newLabelIds = oldTicket.label_ids.slice()
        newLabelIds.push(part2)
        ticket.label_ids.replace(newLabelIds)
        ticket.updated_at = new Date().toISOString()

        result.data = toJS(ticket)
        result.data.changes = {
          label_ids: oldTicket.label_ids,
          updated_at: oldTicket.updated_at,
        }

        app.streamDispatcher.sendTicketUpdates(result.data)

        return result
      default:
        return null
    }
  }

  delete(url) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.pretendDelete(url)
        if (result.ok === true) {
          resolve(result)
        } else {
          reject(result)
        }
      }, 300)
    })
  }

  pretendDelete(url) {
    // eslint-disable-next-line no-unused-vars
    const [slash, path, id, part1, part2] = url.split(/[/?]/)
    const result = { ok: true }
    let ticket, oldTicket, newLabelIds

    switch (true) {
      case path === 'tickets' && part1 === 'labels':
        ticket = app.tickets.find(t => t.id === id)
        oldTicket = JSON.parse(JSON.stringify(ticket))

        newLabelIds = oldTicket.label_ids.slice().filter(i => i !== part2)
        ticket.label_ids.replace(newLabelIds)
        ticket.updated_at = new Date().toISOString()

        result.data = toJS(ticket)
        result.data.changes = {
          label_ids: oldTicket.label_ids,
          updated_at: oldTicket.updated_at,
        }

        app.streamDispatcher.sendTicketUpdates(result.data)

        return result
      default:
        return null
    }
  }

  post(url, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.pretendPost(url, data)
        if (result.ok === true) {
          resolve(result)
        } else {
          reject(result)
        }
      }, 300)
    })
  }

  pretendPost(url, data) {
    // eslint-disable-next-line no-unused-vars
    const [slash, path] = url.split(/[/?]/)
    const result = { ok: true, status: 200 }
    let ticket, customer

    switch (true) {
      case path === 'tickets':
        if (app.tickets.find(t => t.number === this.nextNum)) {
          // eslint-disable-next-line no-console
          console.error('cannot generate new ticket, num already exists', this.nextNum)
        }

        // Add some server generated data for new ticket
        data = Object.assign(data, {
          number: this.lastNum,
          id: `ticket-${this.lastNum}`,
          customer_name: app.customers.find(x => x.id === data.customer_id).name,
          reply_count: 0,
          inbox_id: data.group_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        ticket = new Ticket(data)
        app.tickets.push(ticket)

        result.data = toJS(ticket)
        result.data.action = 'create'
        app.streamDispatcher.sendTicketUpdates(result.data)

        this.lastNum += 1

        return result
      case path === 'customers':
        if (data.email) data.emails = [data.email]
        if (data.phone) data.phones = [data.phone]

        customer = new Customer({
          ...data,
          id: `customer-${this.lastNum}`,
        })
        app.customers.push(customer)

        result.data = toJS(customer)
        result.data.action = 'create'
        app.streamDispatcher.sendCustomerUpdates(result.data)

        this.lastNum += 1

        return result
      default:
        return null
    }
  }

  doChangesOnTicket(ticket, fields, changes) {
    Object.entries(fields).forEach(field => {
      const [key, newValue] = field
      if (key === 'add_label_ids') {
        this.doAddTicketLabels(ticket, newValue, changes)
      } else if (key === 'remove_label_ids') {
        this.doRemoveTicketLabels(ticket, newValue, changes)
      } else if (ticket[key] !== newValue) {
        changes[key] = ticket[key] // track old value
        ticket[key] = newValue
      }
    })
  }

  doAddTicketLabels(ticket, labelIds, changes) {
    const oldLabelIds = toJS(ticket.label_ids)
    const newLabelIds = toJS(ticket.label_ids)

    labelIds.forEach(id => {
      if (!newLabelIds.includes(id)) newLabelIds.push(id)
    })

    // If any labels were added
    if (oldLabelIds.length !== newLabelIds.length) {
      changes.label_ids = oldLabelIds
      changes.updated_at = ticket.updated_at
      ticket.label_ids.replace(newLabelIds)
      ticket.updated_at = new Date().toISOString()
    }
  }

  doRemoveTicketLabels(ticket, labelIds, changes) {
    const oldLabelIds = toJS(ticket.label_ids)
    let newLabelIds = toJS(ticket.label_ids)

    labelIds.forEach(removeId => {
      newLabelIds = newLabelIds.filter(id => id !== removeId)
    })

    // If any labels were removed
    if (oldLabelIds.length !== newLabelIds.length) {
      changes.label_ids = oldLabelIds
      changes.updated_at = ticket.updated_at
      ticket.label_ids.replace(newLabelIds)
      ticket.updated_at = new Date().toISOString()
    }
  }
}
