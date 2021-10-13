import React from 'react'
import { observer } from 'mobx-react'

import { TextWithIconPill } from './TextWithIconPill'

export const InboxPill = observer(({ model }) => {
  return <TextWithIconPill iconId='ticket_inboxThin_s' text={model.name} />
})
