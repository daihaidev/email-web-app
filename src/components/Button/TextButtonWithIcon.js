import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Icon } from 'components/icons/Icon'
import { Button } from './Button'
import styles from './TextButtonWithIcon.scss'

export const TextButtonWithIcon = observer(
  ({ onClick, size, children, customClass, isActive, type, icon, isDisabled, customWrapperClass }) => {
    const buttonClass = classNames(styles.TextButtonWithIcon, type ? styles[`TextButtonWithIcon__${type}`] : '', {
      [customClass]: customClass,
      [styles.TextButtonWithIcon__isDisabled]: isDisabled,
    })

    return (
      <Button
        onClick={onClick}
        size={size}
        isActive={isActive}
        type={type}
        customClass={buttonClass}
        customWrapperClass={customWrapperClass}
        isDisabled={isDisabled}
      >
        <Icon id={icon} className={styles.TextButtonWithIcon_icon} />
        {children}
      </Button>
    )
  }
)
