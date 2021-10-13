import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { AvatarWithStatus } from 'components/Avatar/AvatarWithStatus'
import { Icon } from 'components/icons/Icon'
import { Svg } from 'components/Svg'
import { StatusSwitcher } from 'components/SecondaryNav/StatusSwitcher'
import logo from 'components/PrimaryNav/logo.svg'
import styles from './AppMenu.scss'

const renderNavItems = () => {
  return app.primaryNav.map(({ id, route, icon, label }) => {
    const isActive = app.ui[id] && app.ui[id].active
    const navItemClass = classNames(styles.AppMenu_navItem, {
      [styles.AppMenu_navItem__isActive]: isActive,
    })

    return (
      <button type='button' key={id} className={navItemClass} onClick={() => route && app.router.navigate(route)}>
        <Icon id={icon} className={styles.AppMenu_navItemIcon} />
        {label}
      </button>
    )
  })
}

export const AppMenu = observer(() => {
  const className = classNames(styles.AppMenu, {
    [styles.AppMenu__isActive]: app.appMenuVisible,
  })

  const notificationClassName = classNames(styles.AppMenu_notification, {
    [styles.AppMenu_notification__hasNotification]: app.hasNotifications,
  })

  const toggleMenu = () => app.setAppMenuVisible(false)

  const notificationIcon = app.hasNotifications ? 'ui_notificationActive_m' : 'ui_notification_m'

  return (
    <div className={className}>
      <div className={styles.AppMenu_overlay} onClick={toggleMenu} />
      <div className={styles.AppMenu_menu}>
        <div className={styles.AppMenu_scroll}>
          <button type='button' className={styles.AppMenu_logo}>
            <Svg data={logo} className={styles.AppMenu_logoIcon} />
          </button>
          <Icon id={notificationIcon} className={notificationClassName} />
          <div className={styles.AppMenu_user}>
            <AvatarWithStatus size='large' model={app.currentUser} />
          </div>
          <div className={styles.AppMenu_statusSwitcher}>
            <StatusSwitcher />
          </div>
          {renderNavItems()}
        </div>
        <div className={styles.AppMenu_bottom}>
          <a className={styles.AppMenu_bottomLink} href='#logout'>
            Log Out
          </a>
          <a className={styles.AppMenu_bottomLink} href='#whats-new'>
            What’s New!
          </a>
        </div>
      </div>
    </div>
  )
})
