import { action, makeAutoObservable } from 'mobx'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'

import { app } from 'app'

export class Message {
  id

  created_at

  updated_at

  collapsed

  body

  editing

  delivery_failure

  isDraft

  static TYPES = {
    reply: 'reply',
    note: 'note',
    event: 'event',
  }

  constructor(data) {
    makeAutoObservable(this)

    this.collapsed = !data.isDraft

    Object.assign(this, data)
  }

  get ccEmails() {
    return this.cc && this.cc.length > 0 ? this.cc.split(', ') : []
  }

  get bccEmails() {
    return this.bcc && this.bcc.length > 0 ? this.bcc.split(', ') : []
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed
  }

  onUpdate(type, data) {
    if (data.id !== this.id) return

    Object.assign(this, data)
  }

  setRecipients(field, emails) {
    this[field] = emails.join(', ')
    this.saveDraftHeaders = true
  }

  saveDraft(ticket, newBody, mode) {
    // eslint-disable-next-line no-console
    console.log('in save draft', new Date().getTime(), 'editing', this.editing, mode)
    // don't try to save draft if ticket is not saved, or submit is in progress,
    // or no longer editing but we are here due to debounce
    // or if this is an existing message (drafts are not supported)
    if (!ticket.isPersisted || this.submitInProgress || !this.editing || !this.isDraft) {
      return
    }
    // eslint-disable-next-line no-console
    console.log('actually saving draft')

    if (this.body !== newBody || this.saveDraftHeaders) {
      this.body = newBody
      this.savingDraft = true

      const data = {
        type: this.type,
        body: newBody,
        to: this.to,
        cc: this.cc,
        bcc: this.bcc,
        forward_ticket_id: this.forwardId,
      }
      app.http.post(`/ticket/${ticket.id}/save_draft`, app.http.formData(data)).then(
        action(() => {
          this.savingDraft = false
          this.saveDraftHeaders = false
        })
      )
    }
  }

  saveDraftThrottled = throttle(
    (ticket, newBody) => {
      this.saveDraft(ticket, newBody, 'throttle')
    },
    5000,
    { leading: false }
  )

  saveDraftDebounced = debounce((ticket, newBody) => {
    this.saveDraft(ticket, newBody, 'debounce')
  }, 700)

  cancelEditing(ticket) {
    // stop debounced functions from getting called
    this.editing = false
    this.removeDraft(ticket)
  }

  removeDraft(ticket) {
    // if (this.mode != 'create') {
    // this.draft = null
    // this.$('.saved').removeClass('active')
    // this.$('.attachments').empty()
    // this.$('.uploads').empty()
    // }

    // TODO cancel on going uploads

    // var uploads = this.filesBeingUploaded;
    // this.filesBeingUploaded = [];
    // _.each(uploads, function(upload){
    //   upload.jqXHR.abort();
    // }, this);

    if (ticket.isPersisted) {
      app.http.post(`/ticket/${ticket.id}/delete_draft`).then(
        action(() => {
          ticket.setDraft(null)
        })
      )
    }
  }

  submitMessage(ticket, latestBody) {
    this.submitInProgress = true

    const data = {
      user_id: app.currentUser.id,
      type: this.type,
      htmlized: false,
      attachment_ids: this.attachment_ids,
      direction: 'out',
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      body: latestBody,
    }

    app.api
      .post(`/tickets/${ticket.id}/messages`, data)
      .then(
        action(res => {
          this.cancelEditing(ticket)
          ticket.processNewMessage(res.data)
          app.streamDispatcher.getUpdatesAndResetUpdateTimer()
        })
      )
      .catch(
        // eslint-disable-next-line no-unused-vars
        action(error => {
          // that.enableSubmit()
        })
      )
      .then(
        action(() => {
          this.submitInProgress = false
        })
      )
  }
}
