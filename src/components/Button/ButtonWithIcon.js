import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { Icon } from 'components/icons/Icon'
import styles from './ButtonWithIcon.scss'
import { Button } from './Button'

export const ButtonWithIcon = observer(
  ({
    iconId,
    onClick,
    size,
    isActive,
    isDisabled,
    type,
    customClass,
    customWrapperClass,
    touchWidth,
    touchHeight,
    width,
    height,
    iconCustomClass,
  }) => {
    const buttonClass = classNames(styles.ButtonWithIcon, {
      [styles[`ButtonWithIcon__${size}`]]: size,
      [customClass]: customClass,
    })

    const iconClass = classNames(styles.ButtonWithIcon_icon, {
      [styles[`ButtonWithIcon_icon__${type}`]]: type,
      [styles[`ButtonWithIcon_icon__${size}`]]: size,
      [styles.ButtonWithIcon_icon__isActive]: isActive,
      [styles.ButtonWithIcon_icon__isDisabled]: isDisabled,
      [iconCustomClass]: iconCustomClass,
    })

    return (
      <Button
        onClick={onClick}
        size={size}
        isActive={isActive}
        isDisabled={isDisabled}
        type={type}
        customClass={buttonClass}
        customWrapperClass={customWrapperClass}
        touchWidth={touchWidth}
        touchHeight={touchHeight}
        width={width}
        height={height}
      >
        <Icon id={iconId} className={iconClass} />
      </Button>
    )
  }
)
