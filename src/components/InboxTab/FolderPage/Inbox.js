import React, { useState, useRef, useMemo, useLayoutEffect } from 'react'
import { observer } from 'mobx-react'
import { action } from 'mobx'
import classNames from 'classnames'
import { app } from 'app'

import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import styles from './Inbox.scss'
import { Folder } from './Folder'

const collapseInbox = action('collapseInbox', (id, value) => {
  app.inboxes.forEach(i => {
    if (i.id === id) {
      i.collapsed = value
    }
  })
  if (id === 'unified') {
    app.unifiedInbox.collapsed = value
  }
})

export const Inbox = observer(({ model, onNavigate }) => {
  const [height, setHeight] = useState(0)
  const inboxFoldersRef = useRef(null)
  const inboxStyle = useMemo(() => {
    if (height === 0) {
      return {}
    }
    return {
      height: `${height}px`,
    }
  }, [height])

  useLayoutEffect(() => {
    if (inboxFoldersRef.current != null) {
      const foldersHeight = inboxFoldersRef.current.clientHeight
      const closedHeight = app.touchOptimized ? 65 : 52 // Height of heading (padding-top: 17 + line-height: 18 + padding-bottom: 17)
      const openHeight = (app.touchOptimized ? 50 : 38) + foldersHeight // Height of heading (padding-top: 17 + line-height: 18 + padding-bottom: 3) + foldersHeight

      setHeight(!model.collapsed ? openHeight : closedHeight)
    }
  }, [model.collapsed, model.visibleFoldersLength, app.touchOptimized])

  const folders = animated =>
    model.folders
      ? model.folders.map(entry => <Folder key={entry.id} model={entry} animated={animated} onNavigate={onNavigate} />)
      : null

  const renderBtnGroup = inbox => (
    <div className={classNames(styles.Inbox_btnGroup)}>
      <ButtonWithIcon
        iconId='ui_add_xs'
        onClick={() => app.router.navigate('inbox.draftInbox', { id: 'new', inbox_id: inbox.id })}
        size='small'
      />
      <ButtonWithIcon
        iconId='ui_more_xs'
        onClick={e => {
          e.stopPropagation()
        }}
        size='small'
      />
    </div>
  )

  return (
    <div
      className={classNames(styles.Inbox, {
        [styles.Inbox__closed]: model.collapsed,
      })}
      style={inboxStyle}
    >
      <div className={styles.Inbox_heading} onClick={() => collapseInbox(model.id, !model.collapsed)}>
        <h3 className={styles.Inbox_title}>{model.name}</h3>
        {renderBtnGroup(model)}
      </div>
      <div className={styles.Inbox_foldersWrap}>
        <div
          className={classNames(styles.Inbox_folders, {
            [styles.Inbox_folders__opened]: !model.collapsed,
            [styles.Inbox_folders__closed]: model.collapsed,
          })}
        >
          {folders()}
        </div>
        <div ref={inboxFoldersRef} className={styles.Inbox_foldersClone}>
          {folders(false)}
        </div>
      </div>
    </div>
  )
})
