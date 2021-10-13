import React from 'react'
import { observer } from 'mobx-react'

import { Icon } from 'components/icons/Icon'

export const Rating = observer(({ rating, className }) => {
  return <Icon id={rating} className={className} />
})
