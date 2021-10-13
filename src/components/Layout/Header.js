import React from 'react'
import { observer } from 'mobx-react'
import { SecondaryNav } from 'components/SecondaryNav/SecondaryNav'
import styles from './Header.scss'

export const Header = observer(({ title, children, headingSlot }) => {
  return (
    <div className={styles.Header}>
      <div className={styles.Header_heading}>
        <h1 className={styles.Header_title}>{title}</h1>
        {headingSlot}
      </div>
      {children}
      <div className={styles.Header_divider} />
      <SecondaryNav />
    </div>
  )
})
