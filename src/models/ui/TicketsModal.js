import { reaction, makeAutoObservable } from 'mobx'

import { app } from 'app'
import { Ticket } from '../core/Ticket'

export class TicketsModal {
  isVisible

  mode

  ticket

  destinationIndex

  MODES = {
    list: 'list',
    single_history: 'single_history',
    single_direct: 'single_direct',
    merge: 'merge',
    merge_from_preview: 'merge_from_preview',
  }

  constructor() {
    makeAutoObservable(this)

    this.isVisible = false
    this.mode = null
    this.ticket = null
    this.destinationIndex = 0

    reaction(
      () => this.isVisible,
      () => {
        if (this.isVisible) {
          app.ui.inboxTab.ticketSearch.query = ''
        }
      }
    )
  }

  setVisible(value) {
    this.isVisible = value
  }

  setTicket(ticket) {
    if (ticket) {
      this.ticket = new Ticket(ticket)
      this.ticket.load()
    } else {
      this.ticket = null
    }
  }

  setListMode() {
    this.mode = this.MODES.list
  }

  setSingleHistoryMode() {
    this.mode = this.MODES.single_history
  }

  setSingleDirectMode() {
    this.mode = this.MODES.single_direct
  }

  setMergeMode() {
    this.mode = this.MODES.merge
  }

  setMergeFromPreviewMode() {
    this.mode = this.MODES.merge_from_preview
  }

  get showPrevButton() {
    return this.mode === this.MODES.merge && !!app.ui.inboxTab.ticket.customer.recentTickets[this.destinationIndex - 1]
  }

  get showNextButton() {
    return this.mode === this.MODES.merge && !!app.ui.inboxTab.ticket.customer.recentTickets[this.destinationIndex + 1]
  }

  get destination() {
    return this.mode === this.MODES.merge
      ? app.ui.inboxTab.ticket.customer.recentTickets[this.destinationIndex]
      : app.ui.inboxTab.ticket
  }

  get source() {
    return this.mode === this.MODES.merge ? app.ui.inboxTab.ticket : this.ticket
  }
}
