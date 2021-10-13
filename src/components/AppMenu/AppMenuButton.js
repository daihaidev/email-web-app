import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import styles from './AppMenuButton.scss'

export const AppMenuButton = observer(() => {
  const shouldHideButton = app.router.route.name === 'inbox.ticket'

  const appMenuButtonClassName = classNames({
    [styles.AppMenuButton__hasNotifications]: app.hasNotifications,
  })

  const appMenuButtonWrapperClassName = classNames(styles.AppMenuButton_wrapper, {
    [styles.AppMenuButton__isHidden]: shouldHideButton,
  })

  const openMenu = () => {
    app.setAppMenuVisible(true)
  }

  return (
    <ButtonWithIcon
      iconId='ui_appMenu_m'
      customWrapperClass={appMenuButtonWrapperClassName}
      customClass={appMenuButtonClassName}
      onClick={openMenu}
    />
  )
})
