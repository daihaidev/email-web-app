import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Icon } from 'components/icons/Icon'
import styles from './ButtonActions.scss'

export const ButtonActions = observer(({ onClick, transparent, isDisabled }) => {
  const cssClass = classNames(styles.ButtonActions, {
    [styles.ButtonActions__isTransparent]: transparent,
    [styles.ButtonActions__isDisabled]: isDisabled,
  })

  const onClickHandler = () => !isDisabled && onClick()
  return (
    <button type='button' disabled={isDisabled} className={cssClass} onClick={onClickHandler}>
      <Icon id='ui_more_xs' className={styles.ButtonActions_icon} />
    </button>
  )
})
