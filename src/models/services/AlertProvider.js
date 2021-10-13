import PubSub from 'pubsub-js'
import { makeAutoObservable } from 'mobx'

import { app } from 'app'

export class AlertProvider {
  outOfSync

  newVersion

  connectionFailure

  daysLeft

  billingStatus

  connecting

  static TYPES = {
    info: 'info', // blue
    error: 'error', // orange
  }

  constructor(params) {
    makeAutoObservable(this)

    PubSub.subscribe('StreamDispatcher_newVersion', (type, data) => this.processNewVersion(type, data))
    PubSub.subscribe('StreamDispatcher_outOfSync', (type, data) => this.processOutOfSync(type, data))
    PubSub.subscribe('StreamDispatcher_status', (type, data) => this.processStatus(type, data))

    if (app.timeTracker) {
      PubSub.subscribe('TimeTracker_connecting', (type, data) => this.processConnecting(type, data))
    }

    this.processBillingStatus('initialLoad', params.billing_status)
    PubSub.subscribe('StreamDispatcher_billingstatus_update', (type, data) => this.processBillingStatus(type, data))
  }

  processOutOfSync() {
    this.outOfSync = true
  }

  processNewVersion() {
    this.newVersion = true
  }

  processStatus(type, status) {
    if (status === 'down') {
      this.connectionFailure = true
    } else {
      this.connectionFailure = false
    }
  }

  processConnecting(type, connecting) {
    this.connecting = connecting
  }

  processBillingStatus(type, msg) {
    this.billingStatus = msg.status
    this.daysLeft = msg.days_left
  }

  get alert() {
    let alert
    const refreshPage = 'window.location.reload(true)'

    if (this.connecting === true || this.connectionFailure === true) {
      alert = { type: AlertProvider.TYPES.error, message: 'Reconnecting...' }
    } else if (this.newVersion === true) {
      alert = {
        type: AlertProvider.TYPES.info,
        message: `A new version is out: <a href='javascript:${refreshPage}'><strong>Get It</strong></a>`,
      }
    } else if (this.outOfSync === true) {
      alert = {
        type: AlertProvider.TYPES.error,
        message: `Oops! We've lost sync: <a href='javascript:${refreshPage}'><strong>Refresh</strong></a>`,
      }
    } else {
      alert = this.billingAlert
    }

    return alert
  }

  get billingAlert() {
    let alert, msg

    if (this.billingStatus === 'fail' || this.billingStatus === 'overdue') {
      msg = 'There has been a billing issue on your account.'
      if (app.isOwner) {
        msg += ' Please <a href="/settings/billing/update_card">update your credit card</a> or'
        msg += ' <a href="http://www.enchant.com/contact">contact us</a>.'
      } else {
        msg += ' Please ask your account owner to contact us.'
      }
      alert = { type: AlertProvider.TYPES.error, message: msg }
    } else if (this.billingStatus === 'trial' && this.daysLeft < 15) {
      msg = `You have ${this.daysLeft} day${this.daysLeft > 1 ? 's' : ''} left on your Enchant trial.`
      if (app.isOwner) {
        msg += ' <a href="/settings/billing">Upgrade</a> to a full account today!'
      } else {
        msg += ' Please remind your account owner to sign up for a full account!'
      }
      alert = { type: AlertProvider.TYPES.info, message: msg }
    } else if (this.billingStatus === 'expired') {
      msg = 'Your trial has expired.'
      if (app.isOwner) {
        msg += ' Please <a href="/settings/billing/update_card">activate</a> your account.'
      } else {
        msg += ' Please ask your account owner to activate your account.'
      }
      alert = { type: AlertProvider.TYPES.error, message: msg }
    } else {
      alert = null
    }

    return alert
  }
}
