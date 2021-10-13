import React from 'react'
import { observer } from 'mobx-react'

import { Icon } from 'components/icons/Icon'
import styles from './Search.scss'

export const Search = observer(({ value, onChange }) => {
  return (
    <div className={styles.Search}>
      <Icon id='ui_searchThick_s' className={styles.Search_magnifierIcon} />
      <input type='text' value={value} className={styles.Search_input} onChange={onChange} />
    </div>
  )
})
