import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { Svg } from 'components/Svg'
import roundedRectangle from './roundedRectangle.svg'
import add from './add.svg'
import styles from './AddButton.scss'

export const AddButton = observer(() => {
  const onClick = () => app.router.navigate('inbox.draft', { id: 'new' })
  return (
    <button type='button' className={styles.AddButton} onClick={onClick}>
      <Svg data={roundedRectangle} className={styles.AddButton_bg} />
      <Svg data={add} className={styles.AddButton_icon} />
    </button>
  )
})
