import { observable, configure, makeAutoObservable } from 'mobx'
import moment from 'moment'

import { app } from 'app'
import { Account } from './core/Account'
import { User } from './core/User'
import { Customer } from './core/Customer'
import { Session } from './core/Session'
import { Inbox } from './core/Inbox'
import { Folder } from './core/Folder'
import { Label } from './core/Label'
import { Router } from './ui/Router'
import { Device } from './ui/Device'
import { Scheduler } from './services/Scheduler'
import { StreamDispatcher } from './services/StreamDispatcher'
import { AlertProvider } from './services/AlertProvider'
import { API } from './services/API'
import { Http } from './services/Http'
import { UI } from './ui/UI'
import { sortable, weightComparator, caseInsensitiveNameComparator } from './core/sortable'

configure({ enforceActions: 'never' })

export class App {
  appMenuVisible

  initialized

  viewport

  hasNotifications

  currentUser

  currentTime

  production

  constructor() {
    makeAutoObservable(this, {
      initialData: false,
    })

    this.production = window.location.hostname.toLowerCase().endsWith('enchant.com')

    this.initialized = false
    this.appMenuVisible = false
    this.viewport = null
    this.hasNotifications = false
    this.primaryNav = [
      { id: 'inboxTab', route: 'inbox', icon: 'nav_inbox_m', label: 'Inbox' },
      { id: 'chatTab', route: 'chat', icon: 'nav_chat_m', label: 'Live Chat' },
      { id: 'knowledgeBaseTab', icon: 'nav_knowledgeBase_m', label: 'Knowledge Base' },
      { id: 'reportsTab', icon: 'nav_reports_m', label: 'Reports' },
      { id: 'settings', icon: 'nav_settings_m', label: 'Settings' },
    ]
  }

  init() {
    this.router = new Router()
    this.ui = new UI()
  }

  get touchOptimized() {
    return this.viewport === 'xs' || this.currentUser.preferences.touchOptimized
  }

  get activeInboxes() {
    return app.inboxes.filter(inbox => !inbox.deleted)
  }

  initialData(payload) {
    payload = this.transformPayload(payload)

    this.PAGE_SIZE = 5

    // static data
    this.account = new Account(payload.account)
    this.currentSession = new Session(payload.session)

    this.users = sortable(observable([]), caseInsensitiveNameComparator)
    this.users.push(...payload.users.map(data => new User(data)))
    this.currentUser = this.users.find(u => u.id === this.currentSession.currentUserId)
    this.isOwner = payload.isOwner

    this.customers = observable([])
    this.customers.push(...payload.customers.map(data => new Customer(data)))

    this.inboxes = sortable(observable([]), weightComparator, target => target.map(item => item.weight).join())
    this.inboxes.push(...payload.inboxes.map(data => new Inbox(data)))
    this.folders = observable({})
    this.createFolders(payload.folder_specs)

    this.labels = sortable(observable([]), caseInsensitiveNameComparator)
    this.labels.push(...payload.labels.map(data => new Label(data)))

    this.sidebarApps = sortable(observable([]), weightComparator)
    this.sidebarApps.push(...payload.sidebarApps.map(data => new Inbox(data)))

    this.tickets = observable(payload.tickets)
    this.auditEvents = payload.auditEvents
    this.macros = payload.macros

    // services and utilities
    this.device = new Device()
    this.api = new API(payload.session.apiToken)
    this.http = new Http()
    this.scheduler = new Scheduler()
    this.streamDispatcher = new StreamDispatcher(payload.channels)
    this.alertProvider = new AlertProvider({ billing_status: payload.account.billingStatus })

    this.setCurrentTime()
    setInterval(() => {
      this.setCurrentTime()
    }, 30000) // TODO can slow it down if user not active

    app.streamDispatcher.start()

    this.initialized = true
  }

  transformPayload(payload) {
    const config = {
      isOwner: payload.is_owner,
      inboxes: payload.inboxes,
      labels: payload.labels,
      folder_specs: payload.filter_specs,
      sidebarApps: payload.remote_widgets,
      channels: payload.channels,
      customers: payload.customers,
      tickets: payload.tickets,
      auditEvents: payload.auditEvents,
      macros: payload.macros,
    }

    config.account = {
      id: payload.mailbox_id,
      plan: payload.plan,
      billingStatus: payload.billing_status,
      maxTicketDigits: payload.maxTicketDigits,
      defaultTicketType: { send_email: 'email', track_call: 'phone' }[payload.ticket_create_action],
      defaultReplyAction: payload.reply_action,
    }

    config.session = {
      apiToken: payload.api_token,
      version: payload.version,
      environment: payload.env,
      isMobile: payload.is_mobile,
      currentUserId: payload.user_id,
    }

    payload.users.forEach(user => {
      user.preferences = {
        animation: true,
        compactTickets: true,
        availableForChat: user.available_for_chat,
      }
      delete user.available_for_chat
      delete user.name
    })
    config.users = payload.users

    return config
  }

  addFolder(inbox, config) {
    const folder = new Folder(config)
    app.folders[folder.id] = folder
    inbox.folders.push(folder)
  }

  createFolders(folder_spec) {
    folder_spec.forEach(section => {
      if (section.group_id) {
        const inbox = app.inboxes.find(item => item.id === section.group_id)
        section.filters.forEach(config => this.addFolder(inbox, config))
      } else {
        // Unified inbox
        section.id = 'unified'
        delete section.group_id
        app.unifiedInbox = new Inbox(section)
        section.filters.forEach(config => this.addFolder(app.unifiedInbox, config))
      }
    })
  }

  getCurrentTime() {
    // Moment object is mutable, added to avoid mutation of app.currentTime
    return this.currentTime.clone()
  }

  setAppMenuVisible(value) {
    app.appMenuVisible = value
  }

  setCurrentTime() {
    app.currentTime = moment().utcOffset(app.currentUser.utc_offset)
  }
}
