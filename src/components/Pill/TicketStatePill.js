import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { TimeFormat } from 'components/TimeFormat'
import { Icon } from 'components/icons/Icon'
import styles from './TicketStatePill.scss'

export const TicketStatePill = observer(({ state, snoozedUntil }) => {
  const stateName = state.charAt(0).toUpperCase() + state.slice(1)

  const cssClass = classNames(styles.TicketStatePill, styles[`TicketStatePill__${state}`])

  return !['spam', 'trash'].includes(state) ? (
    <div className={cssClass}>
      <div className={styles.TicketStatePill_iconContainer}>
        <Icon id={`state_${stateName.toLowerCase()}_s`} className={styles.TicketStatePill_icon} />
      </div>
      <span>{stateName}</span>
      <span className={styles.TicketStatePill_snoozeTime}>
        <TimeFormat time={snoozedUntil} mode='snooze' />
      </span>
    </div>
  ) : null
})
