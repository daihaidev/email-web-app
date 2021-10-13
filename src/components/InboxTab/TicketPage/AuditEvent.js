import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { TimeFormat } from 'components/TimeFormat'
import { Icon } from 'components/icons/Icon'
import styles from './AuditEvent.scss'

export const AuditEvent = observer(({ event, styling }) => {
  const className = classNames(styles.AuditEvent, {
    [styles.AuditEvent__withHiddenBorder]: styling.hideBorder,
  })

  return (
    <div className={className}>
      <Icon id='state_open_s' className={styles.AuditEvent_icon} />
      <div className={styles.AuditEvent_text} dangerouslySetInnerHTML={{ __html: event.summary }} />
      <div className={styles.AuditEvent_date}>
        <TimeFormat time={event.created_at} mode='hybrid' />
      </div>
      <div className='uClear' />
    </div>
  )
})
