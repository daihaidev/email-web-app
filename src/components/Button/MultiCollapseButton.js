import React from 'react'
import { observer } from 'mobx-react'

import styles from './MultiCollapseButton.scss'

export const MultiCollapseButton = observer(({ onClick, text }) => (
  <div role='button' className={styles.MultiCollapseButton} onClick={onClick}>
    <div className={styles.MultiCollapseButton_block}>
      <div className={styles.MultiCollapseButton_text}>{text}</div>
    </div>
    <div className='uTopShadow' />
    <div className='uBottomShadow' />
  </div>
))
