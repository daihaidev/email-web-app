import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Icon } from 'components/icons/Icon'
import styles from './TextWithIconPill.scss'

export const TextWithIconPill = observer(({ text, iconId, fill, mode }) => {
  const pillClass = classNames(styles.TextWithIconPill, {
    [styles.TextWithIconPill__fill]: fill,
    [styles[`TextWithIconPill__${mode}`]]: mode,
  })

  return (
    <div className={pillClass}>
      <Icon id={iconId} className={styles.TextWithIconPill_icon} />
      <span className={styles.TextWithIconPill_label}>{text}</span>
    </div>
  )
})
