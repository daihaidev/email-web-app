import { action, toJS, makeAutoObservable } from 'mobx'
import PubSub from 'pubsub-js'

import { app } from 'app'
import { Message } from './Message'
import { Customer } from './Customer'
import { AuditEvent } from './AuditEvent'

export class Ticket {
  id

  activityShown

  checked

  colliders

  created_at

  customer

  customer_id

  draft

  flashCounter

  has_attachment

  inbox_id

  inProgress

  kbFocus

  label_ids

  loaded

  messages

  notFoundReason

  number

  rating

  reply_count

  state

  snoozed_until

  subject

  summary

  summaryIsNote

  type

  updated_at

  user_id

  static TYPES = {
    phone: 'phone',
    email: 'email',
    twitter: 'twitter',
    chat: 'chat',
    web: 'web',
  }

  constructor(data) {
    makeAutoObservable(this)

    let ticketData = data

    this.checked = false
    this.loaded = false

    // TODO WARN: implement a better toJS by excluding GUI flags
    if (data instanceof Ticket) ticketData = toJS(data)

    this.loadCustomer(ticketData, true)
    delete ticketData.customer

    Object.assign(this, ticketData)

    this.loadDraft(ticketData.draft)
  }

  get isPersisted() {
    return this.id !== 'new'
  }

  get user() {
    return this.user_id ? app.users.find(x => x.id === this.user_id) : null
  }

  get userWritingReply() {
    if ((this.colliders || []).length === 0) return null
    return app.users.find(x => x.id === this.colliders[0].user_id).first_name
  }

  get collisionState() {
    if (this.colliders) {
      const flags = {}
      this.colliders.forEach(x => {
        flags[x.activity] = true
      })

      if (flags.reply) {
        return 'reply'
      }
      if (flags.note) {
        return 'note'
      }
      if (flags.view) {
        return 'view'
      }
    }

    return null
  }

  toggleChecked() {
    this.checked = !this.checked
  }

  load(options = {}) {
    if (!this.loaded) {
      app.api
        .get(`/tickets/${this.id}?embed=${options.embedCustomer ? 'customer' : ''},messages&signed_urls=true`)
        .then(res => {
          if (options.embedCustomer) {
            this.loadCustomer(res.data.customer)
            delete res.data.customer
          }

          this.messages = res.data.messages ? res.data.messages.map(m => new Message(m)) : []
          delete res.data.messages

          this.loadDraft(res.data.draft)
          delete res.data.draft

          Object.assign(this, res.data)
          this.loaded = true

          PubSub.subscribe('StreamDispatcher_ticketUpdate', (type, data) => this.onUpdate(type, data))
          PubSub.subscribe('StreamDispatcher_messageUpdate', (type, data) => this.onMessageUpdate(type, data))
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.notFoundReason = 'notFound'
          } else if (error.response.status === 403) {
            this.notFoundReason = 'forbidden'
          }
        })
    }
  }

  static getRecentForCustomer(customer, ticketId) {
    if (!customer.recentTicketsCache) {
      customer.recentTicketsCache = [] // mark that we are already loading
      app.api
        .get(`/tickets?q=customer_id:${customer.id}&per_page=4&fields=id,subject,state,updated_at&sort=-updated_at`)
        .then(res => {
          customer.recentTicketsCache = (res.data || [])
            .filter(t => t.id !== ticketId)
            .slice(0, 3)
            .map(data => new Ticket(data))
        })
    }
  }

  onUpdate(type, data, context = {}) {
    if (data.id !== this.id) return

    if (data.action === 'set_customer') {
      if (this.loaded) {
        this.loadCustomer(data.changes.customer)
      } else {
        this.loadCustomer(data, true)
      }
    }

    if (!this.loaded && context.flash) this.flashCounter += 1

    Object.assign(this, data)
  }

  onMessageUpdate(type, msgData) {
    if (msgData.ticket_id !== this.id) return

    const message = this.messages.find(m => {
      return m.id === msgData.id
    })

    if (msgData.action === 'create' && !message) {
      this.processNewMessage(msgData)
    }

    if (msgData.action === 'update' && message) {
      message.onUpdate(type, msgData)
    }
  }

  loadCustomer(data, loadFromTicketData = false) {
    if (loadFromTicketData) {
      // create customer object for ticket summary
      if (data.customer_id) {
        const names = (data.customer_name || '').split(' ')
        this.customer = new Customer({
          id: data.customer_id,
          first_name: names.shift(),
          last_name: names.join(' '),
          avatar_url: data.customer_avatar_url,
        })
      }
    } else if (!this.customer || this.customer.id !== data.id) {
      this.customer = new Customer(data)
    } else {
      // preserve recent tickets as we are just updating the customer fields
      if (this.customer.recentTickets) data.recentTicketsCache = this.customer.recentTicketsCache
      this.customer.onUpdate('customerUpdate', data)
    }
  }

  loadDraft(data) {
    if (data) {
      this.draft = new Message({ ...data, isDraft: true, editing: true })
    } else if (this.state === 'draft' && !this.draft) {
      this.setDraft(this.type === Ticket.TYPES.phone ? Message.TYPES.note : Message.TYPES.reply)
    }
  }

  setDraft(mode) {
    if (mode === null) {
      this.draft = null
      return
    }

    const initData = {
      type: mode,
      isDraft: true,
      from_name: app.currentUser.name,
      user_id: app.currentUser.id,
      editing: true,
      body: '',
    }
    if (mode === Message.TYPES.reply && this.type !== 'twitter') {
      initData.to = this.reply_to
      initData.cc = this.reply_cc
    }
    this.draft = new Message(initData)
  }

  showActivity() {
    app.api.get(`/tickets/${this.id}/events`).then(
      action(res => {
        this.activityShown = true

        if (res.data.length > 0) {
          const events = res.data.map(eventData => new AuditEvent(eventData))
          const msgsAndEvents = this.messages.slice().concat(events)
          msgsAndEvents.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
          this.messages.replace(msgsAndEvents)
        }
      })
    )
  }

  hideActivity() {
    this.activityShown = false
    this.messages.replace(this.messages.slice().filter(m => m.type !== Message.TYPES.event))
  }

  setSubject(subject) {
    this.updateWithPatchAPI({ subject })
  }

  setState(state, snoozed_until = null) {
    this.updateWithPatchAPI({ state, snoozed_until })
  }

  assignUser(user_id) {
    this.updateWithPatchAPI({ user_id })
  }

  moveToInbox(inbox_id) {
    this.updateWithPatchAPI({ inbox_id })
  }

  setType(type) {
    if (this.draft) {
      // TODO: this needs to be updated in DB when ticket type is updated
      this.draft.type = type === Ticket.TYPES.phone ? Message.TYPES.note : Message.TYPES.email
    }
    this.updateWithPatchAPI({ type })
  }

  setReplyTo(reply_to) {
    this.updateWithPatchAPI({ reply_to })
  }

  setCustomer(customer) {
    if (this.customer_id !== customer.id) {
      if (this.isPersisted) {
        this.updateWithPatchAPI({ customer_id: customer.id })
      } else {
        // eslint-disable-next-line no-console
        console.assert(customer instanceof Customer, 'Customer type must of class type Customer')
        this.customer = customer // customer search sends a fresh Customer object
        this.customer_id = this.customer.id
        this.createDraftTicket()
      }
    }
  }

  updateWithPatchAPI(fields) {
    if (this.isPersisted) {
      app.api.patch(`/tickets/${this.id}`, fields).then(
        action(res => {
          Object.keys(fields).forEach(field => {
            this[field] = res.data[field]
          })
          app.streamDispatcher.getUpdatesAndResetUpdateTimer()
        })
      )
    } else {
      Object.entries(fields).forEach(entry => {
        const [field, value] = entry
        this[field] = value
      })
    }
  }

  addLabel(labelId) {
    app.api.put(`/tickets/${this.id}/labels/${labelId}`, null).then(
      action(res => {
        this.label_ids = res.data.label_ids
        app.streamDispatcher.getUpdatesAndResetUpdateTimer()
      })
    )
  }

  removeLabel(labelId) {
    app.api.delete(`/tickets/${this.id}/labels/${labelId}`).then(
      action(res => {
        this.label_ids = res.data.label_ids
        app.streamDispatcher.getUpdatesAndResetUpdateTimer()
      })
    )
  }

  findOrCreateCustomer(data) {
    const namePieces = data.name.split(' ')
    const payload = {
      first_name: namePieces.shift(),
      last_name: namePieces.join(' '),
    }
    payload.email = data.email
    payload.phone = data.phone

    app.api
      .post('/customers', payload)
      .then(
        action(res => {
          this.customer = new Customer(res.data)
          this.setCustomer(this.customer)
        })
      )
      .catch(
        // eslint-disable-next-line no-unused-vars
        action(error => {
          // console.log(error, error.response)
        })
      )
  }

  createDraftTicket() {
    if (this.isPersisted) return
    // ticketReplyBoxView.disableSubmit();
    const data = {
      subject: this.subject,
      customer_id: this.customer_id,
      reply_to: this.reply_to,
      group_id: this.inbox_id,
      user_id: app.currentUser.id,
      type: this.type,
      state: 'draft',
    }

    if (!data.reply_to && this.customer && this.customer.primaryContact) {
      data.reply_to = this.customer.primaryEmail
    }
    // eslint-disable-next-line no-console
    console.log('saving', data)
    app.api
      .post('/tickets', data)
      .then(
        action(res => {
          // save customer if it is the same
          if (data.customer_id === this.customer_id) res.data.customer = this.customer
          Object.assign(this, res.data)

          // on page we need to show draft labels & draft user etc
          // this.user_id = ticket.draft_user_id
          // this.label_ids = ticket.draft_labels
          // ticketReplyBoxView.enableSubmit()
          app.ui.inboxTab.updateDraftUrl(this.id)
        })
      )
      .catch(
        // eslint-disable-next-line no-unused-vars
        action(error => {
          // do something to show errors
        })
      )
  }

  processNewMessage(msgData) {
    if (!this.messages.find(m => m.id === msgData.id)) {
      this.messages.push(new Message(msgData))
    }
  }
}
