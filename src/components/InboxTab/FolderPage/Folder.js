import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'
import { VerticalLine } from 'components/InboxTab/VerticalLine'
import styles from './Folder.scss'

/* we use an unanimated version ofscreen to smartly to calculate height */
export const Folder = observer(({ model, animated = true, onNavigate }) => {
  const folderClass = classNames(styles.Folder, {
    [styles.Folder__notAnimated]: !animated,
    [styles.Folder__active]: model.active,
    uHidden: !model.visible,
    [styles.Folder__highlighted]: model.transient && model.count > 0,
  })

  const handleClick = () => {
    if (onNavigate) {
      onNavigate()
    }
    app.router.navigate('inbox.folder', { id: model.id })
  }

  return (
    <div className={folderClass} onClick={handleClick}>
      {model.kbFocus ? <VerticalLine modifier={styles.Folder__focus} /> : null}
      <div className={styles.Folder_name}>{model.name}</div>
      <div>{model.count}</div>
    </div>
  )
})
