import { toJS, makeAutoObservable } from 'mobx'

import { validatable } from 'models/core/validate'

export class Customer {
  id

  first_name

  last_name

  emails

  phones

  twitters

  notes

  avatar_url

  recentTicketsCache

  static fieldTypes = {
    firstName: 'first_name',
    lastName: 'last_name',
    notes: 'notes',
    emails: 'emails',
    phones: 'phones',
    twitters: 'twitters',
  }

  static validationRules = {
    // first_name: 'required',
    emails: 'emailRegex',
    // emails: 'required|emailRegex',
  }

  constructor(data, options = {}) {
    makeAutoObservable(this)

    this.transformFieldNames(data)
    Object.assign(this, data)

    if (options.validate) validatable(this)
  }

  // @action
  onUpdate(type, data) {
    if (data.id !== this.id) return

    this.transformFieldNames(data)
    Object.assign(this, data)
  }

  transformFieldNames(data) {
    this.emails = []
    this.phones = []
    this.twitters = []

    if (data.contacts) {
      data.contacts.forEach(item => {
        this[Customer.fieldTypes[`${item.type}s`]].push(item.value)
      })
    }

    this.notes = data.summary || ''
  }

  get primaryContact() {
    if (this.emails.length > 0) return this.emails[0]

    if (this.twitters.length > 0) return this.twitters[0]

    if (this.phones.length > 0) return this.phones[0]

    return null
  }

  get primaryEmail() {
    return this.emails.length > 0 ? this.emails[0] : ''
  }

  get name() {
    return `${this.first_name ? this.first_name : ''} ${this.last_name ? this.last_name : ''}`.trim()
  }

  get recentTickets() {
    return this.recentTicketsCache || []
  }

  setField(key, value) {
    this[key] = value

    this.validate(key, Customer.validationRules[key])
  }

  setContactField(type, index, value) {
    this[type][index] = value
    if (Customer.validationRules[type] && this.validate) {
      this.validate(type, Customer.validationRules[type], { customErrorKey: `${type}-${index}`, value })
    }
  }

  addContactField(type) {
    this[type].push('')
  }

  cloneForProfileEdit() {
    const data = toJS(this)
    if (data.emails.length === 0) data.emails.push('')
    if (data.phones.length === 0) data.phones.push('')
    if (data.twitters.length === 0) data.twitters.push('')

    return new Customer(data, { validate: true })
  }
}
