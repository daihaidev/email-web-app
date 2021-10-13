import React from 'react'
import { observer } from 'mobx-react'

import { DropdownItemsList } from './DropdownItemsList'
import { DropdownItemLabeledIcon } from './DropdownItemLabeledIcon'

export const StateDropdown = observer(({ onClick, inModal }) => {
  return (
    <DropdownItemsList fullWidth={inModal}>
      <DropdownItemLabeledIcon iconId='state_open_s' label='Open' onClick={() => onClick('open')} />
      <DropdownItemLabeledIcon iconId='state_hold_s' label='Hold' onClick={() => onClick('hold')} />
      <DropdownItemLabeledIcon iconId='state_closed_s' label='Closed' onClick={() => onClick('closed')} />
    </DropdownItemsList>
  )
})
