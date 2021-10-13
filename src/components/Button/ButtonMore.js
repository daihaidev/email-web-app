import React from 'react'
import { observer } from 'mobx-react'

import { Icon } from 'components/icons/Icon'
import styles from './ButtonMore.scss'

export const ButtonMore = observer(({ onClick }) => (
  <button type='button' className={styles.ButtonMore} onClick={onClick}>
    <Icon id='ui_more_xs' className={styles.ButtonMore_icon} />
  </button>
))
