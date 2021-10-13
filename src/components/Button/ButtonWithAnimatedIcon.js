import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Icon } from 'components/icons/Icon'
import styles from './ButtonWithAnimatedIcon.scss'
import { Button } from './Button'

export const ButtonWithAnimatedIcon = observer(({ onClick, size, animation }) => {
  const { transitionName, iconFromId, iconToId, state } = animation

  const renderIcon = () => {
    return (
      <>
        <Icon
          id={iconFromId}
          className={classNames(styles.ButtonWithAnimatedIcon_icon, {
            [styles[`ButtonWithAnimatedIcon_icon__${transitionName}`]]: state,
          })}
        />
        <Icon
          id={iconToId}
          className={classNames(styles.ButtonWithAnimatedIcon_icon, {
            [styles[`ButtonWithAnimatedIcon_icon__${transitionName}`]]: !state,
          })}
        />
      </>
    )
  }

  return (
    <Button customClass={styles.ButtonWithAnimatedIcon} onClick={onClick} size={size}>
      {renderIcon()}
    </Button>
  )
})
