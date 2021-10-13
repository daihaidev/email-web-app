import React from 'react'
import { observer } from 'mobx-react'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import styles from './DeliveryFailure.scss'

export const DeliveryFailure = observer(({ message }) => {
  const { text } = message
  return text && text.length !== 0 ? (
    <div className={styles.DeliveryFailure}>
      <div className={styles.DeliveryFailure_content}>
        <div className={styles.DeliveryFailure_title}>Delivery failed:</div>
        {text}
      </div>
      <div className={styles.DeliveryFailure_actions}>
        <ButtonWithIcon
          iconId='ui_retry_m'
          customClass={styles.DeliveryFailure_button}
          iconCustomClass={styles.DeliveryFailure_buttonIcon}
        />
        <ButtonWithIcon
          iconId='action_trash_m'
          customClass={styles.DeliveryFailure_button}
          iconCustomClass={styles.DeliveryFailure_buttonIcon}
        />
      </div>
    </div>
  ) : null
})
