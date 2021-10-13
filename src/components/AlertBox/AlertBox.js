import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import styles from './AlertBox.scss'
import { ButtonWithIcon } from '../Button/ButtonWithIcon'

export const AlertBox = observer(({ mode = 'urgent', message }) => {
  const className = classNames(styles.AlertBox, {
    [styles[`AlertBox__${mode}`]]: mode,
  })

  const iconClass = classNames({
    [styles[`AlertBox_buttonIcon__${mode}`]]: mode,
  })

  const createMessage = () => ({ __html: message })

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={createMessage()} />
      <div className={styles.AlertBox_close}>
        <ButtonWithIcon
          iconId='action_remove_xs'
          size='small'
          customClass={styles.AlertBox_button}
          iconCustomClass={iconClass}
        />
      </div>
    </div>
  )
})
