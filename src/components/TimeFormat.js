import React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'

import { app } from 'app'

const humanize = ts => {
  const time = moment.utc(ts).utcOffset(app.currentUser.utc_offset)
  const now = app.currentTime

  const distance = now - time
  const seconds = Math.abs(distance) / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const startOfDay = now.clone().startOf('day')
  const startOfLastSixMonths = now.clone().subtract(6, 'months')

  let mini = ''
  let full = ''
  let micro = time.format('h a')
  let log = time.format('MMM D, h:mm a')
  let hybridExtra = ''
  let snooze = time.format('MMM D, ha')
  let snoozeMini = time.format('MMM D')
  let val

  if (minutes < 5) {
    mini = 'now'
    full = mini
  } else if (minutes < 50) {
    val = Math.round(minutes)
    mini = `${val} mins ago`
    full = `${val} minutes ago`
  } else if (minutes < 90) {
    mini = '1 hour ago'
    full = mini
  } else if (hours < 5.5) {
    val = Math.round(hours)
    mini = `${val} hours ago`
    full = mini
  } else if (time.isAfter(startOfDay)) {
    // within current calendar day
    mini = time.format('h:mm a')
    full = mini
  } else if (time.isAfter(startOfLastSixMonths)) {
    // within last 6 months
    micro = time.format('MMM D')
    mini = time.format('MMM D, ha')
    full = time.format('MMM D, h:mm a')
  } else {
    micro = time.format('MMM YYYY')
    mini = time.format('MMM D YYYY')
    full = mini
    log = time.format('MMM D YYYY, h:mm a')
  }

  if (hours < 5.5) {
    hybridExtra = ` (${full})`
  } else if (hours < 24) {
    hybridExtra = ` (${Math.round(hours)} hours ago)`
  } else if (hours < 40) {
    hybridExtra = ' (1 day ago)'
  } else if (days < 30.5) {
    hybridExtra = ` (${Math.round(days)} days ago)`
  }

  if (hours <= 24) {
    snooze = time.minutes() === 0 ? time.format('ha') : time.format('h:mm a')
    snoozeMini = time.format('ha')
  } else if (time.minutes() !== 0) {
    snooze = time.format('MMM D, h:mm a')
  }

  return {
    micro,
    mini,
    full,
    hybrid: log + hybridExtra,
    snooze,
    snoozeMini,
    log,
  }
}

const humanizeChat = time => {
  const distance = moment() - moment(time)
  const duration = moment.duration(Math.abs(distance))

  if (duration.asSeconds() < 60) {
    return `${duration.seconds()}s`
  }
  if (duration.asMinutes() < 60) {
    return `${duration.minutes()}m${duration.seconds()}s`
  }
  if (duration.asHours() < 24) {
    return `${duration.hours()}h${duration.minutes()}m`
  }
  return '>1d'
}

const localTimeStr = ts => {
  return moment.utc(ts).utcOffset(app.currentUser.utc_offset).format('MMM D YYYY, h:mm a')
}

const formattedTime = (time, mode) => {
  if (!time) {
    return null
  }

  switch (mode) {
    case 'micro':
      return humanize(time).micro
    case 'mini':
      return humanize(time).mini
    case 'full':
      return humanize(time).full
    case 'hybrid':
      return humanize(time).hybrid
    case 'snooze':
      return humanize(time).snooze
    case 'snoozeMini':
      return humanize(time).snoozeMini
    case 'log':
      return humanize(time).log
    case 'chat':
      return humanizeChat(time)
    default:
      return null
  }
}

// Micro in customer recent ticket sidebar widget
// Message(desktop) - created and updated in note both hybrid
// Message(ipad) - created FULL and updated can stay hybrid
// Message(mobile) - created should be mini and updated can be full
// no one uses log
// AuditEvent uses Hybrid - will be same decision as message for sizes
// Snooze and Snooze mini
// TicketSummary - Mobile and Desktop(compact view) is mini, desktop extended view is full

export const TimeFormat = observer(({ time, mode = 'full' }) => {
  if (time) {
    return <span title={localTimeStr(time)}>{formattedTime(time, mode)}</span>
  }
  return null
})
