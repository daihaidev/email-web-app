import React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { app } from 'app'

import { DropdownItemsList } from './DropdownItemsList'
import { DropdownItemExtended } from './DropdownItemExtended'

const formatItem = item => {
  const output = { ...item }
  const now = moment(app.currentTime)
  switch (output.code) {
    case '4-hours':
      output.value = now.add(4, 'hours')
      output.human = output.value.format('h:mm a')
      break
    case 'next-day-8am':
      output.value = now.add(1, 'days').startOf('day').add(8, 'hours')
      output.human = output.value.format('h:mm a')
      break
    case 'next-day-1pm':
      output.value = now.add(1, 'days').startOf('day').add(13, 'hours')
      output.human = output.value.format('h:mm a')
      break
    case '2-days':
      output.value = now.add(2, 'days').startOf('day').add(8, 'hours')
      output.human = output.value.format('MMM D, h:mm a')
      break
    case '4-days':
      output.value = now.add(4, 'days').startOf('day').add(8, 'hours')
      output.human = output.value.format('MMM D, h:mm a')
      break
    case '1-week':
      output.value = now.add(1, 'weeks').startOf('day').add(8, 'hours')
      output.human = output.value.format('MMM D, h:mm a')
      break
    case '2-weeks':
      output.value = now.add(2, 'weeks').startOf('day').add(8, 'hours')
      output.human = output.value.format('MMM D, h:mm a')
      break
    default:
      break
  }
  return output
}

export const SnoozeDropdown = observer(({ inModal, onClick }) => {
  return (
    <DropdownItemsList fullWidth={inModal}>
      {app.ui.inboxTab.snoozeItems.map(item => {
        const formattedItem = formatItem(item)
        return (
          <DropdownItemExtended
            textPrimary={formattedItem.label}
            textSecondary={formattedItem.human}
            key={formattedItem.label}
            extended
            onClick={() => onClick(formattedItem.value.toISOString())}
          />
        )
      })}

      <DropdownItemExtended
        textPrimary='Custom'
        textSecondary='Pick a Date'
        key='custom'
        extended
        onClick={() => app.ui.inboxTab.setCustomSnooze(snoozeUntil => onClick(snoozeUntil))}
      />
    </DropdownItemsList>
  )
})
