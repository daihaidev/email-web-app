import React, { useState } from 'react'
import { observer } from 'mobx-react'

import { validateEmailComplex } from 'models/core/validate'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'

import styles from './MultiEmailInput.scss'

export const MultiEmailInput = observer(({ emails, onChange }) => {
  const [mails, setMails] = useState(emails)
  const [currentMail, setCurrentMail] = useState('')

  const deleteEmail = i => {
    mails.splice(i, 1)
    setMails([...mails])
    onChange(mails)
  }

  const addMail = () => {
    const error = validateEmailComplex(currentMail.trim())
    if (error === '') {
      mails.push(currentMail.trim())
      setMails([...mails])
      setCurrentMail('')
      onChange(mails)
    }
  }

  const addOnSpace = e => {
    if (e.keyCode === 32) {
      addMail()
    }
  }

  const renderMails = () => {
    return mails.map((mail, i) => {
      return (
        <div className={styles.MultiEmailInput_mail} key={mail}>
          {mail}
          <ButtonWithIcon
            customClass={styles.MultiEmailInput_delete}
            iconId='action_close_xs'
            onClick={() => deleteEmail(i)}
          />
        </div>
      )
    })
  }

  return (
    <div className={styles.MultiEmailInput}>
      {renderMails()}
      <input
        className={styles.MultiEmailInput_input}
        value={currentMail}
        onKeyUp={addOnSpace}
        onBlur={addMail}
        onChange={e => {
          setCurrentMail(e.target.value)
        }}
      />
    </div>
  )
})
