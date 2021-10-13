import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import { Avatar } from 'components/Avatar/Avatar'
import TextareaAutosize from 'react-textarea-autosize'
import { TextButton } from 'components/Button/TextButton'

import styles from './MergeNote.scss'

export const MergeNote = observer(() => {
  const textarea = useRef(null)

  const focusTextarea = () => {
    if (textarea.current) {
      textarea.current.focus()
    }
  }

  return (
    <div className={styles.MergeNote}>
      <div className={styles.MergeNote_avatar}>
        <Avatar model={app.currentUser} size='medium' />
      </div>
      <div className={styles.MergeNote_content}>
        <div className={styles.MergeNote_label}>Note to be added to #124567</div>
        <div className={styles.MergeNote_body} onClick={focusTextarea}>
          <div
            className={styles.MergeNote_info}
            dangerouslySetInnerHTML={{ __html: '1 reply and 1 note have been merged in from ticket #124585.' }}
          />
          <TextareaAutosize inputRef={textarea} className={styles.MergeNote_textarea} />
        </div>
        <div className={styles.MergeNote_actions}>
          <TextButton type='primaryText' size='large' onClick={() => app.ui.inboxTab.ticketsModal.setVisible(false)}>
            Cancel
          </TextButton>
          <TextButton
            type='alertText'
            size='large'
            isDisabled={app.ui.inboxTab.ticketsModal.source.id === app.ui.inboxTab.ticketsModal.destination.id}
          >
            Merge the tickets above
          </TextButton>
        </div>
      </div>
    </div>
  )
})
