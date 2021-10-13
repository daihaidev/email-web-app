import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import activeTabBg from 'components/PrimaryNav/activeTabBg.svg'
import { Icon } from 'components/icons/Icon'
import { Svg } from 'components/Svg'
import styles from './PrimaryNav.scss'
import logo from './logo.svg'

const renderNavItems = () => {
  return app.primaryNav
    .filter(({ id }) => id !== 'settings')
    .map(({ id, route, icon }) => {
      const isActive = app.ui[id] && app.ui[id].active
      const navItemClass = classNames(styles.PrimaryNav_navItem, {
        [styles.PrimaryNav_navItem__isActive]: isActive,
      })

      const navItemIconClass = classNames(styles.PrimaryNav_navItemIcon, {
        [styles.PrimaryNav_navItemIcon__isActive]: isActive,
      })

      return (
        <button type='button' key={id} className={navItemClass} onClick={() => route && app.router.navigate(route)}>
          {isActive && <Svg data={activeTabBg} className={styles.PrimaryNav_activeTabBg} />}
          <Icon id={icon} className={navItemIconClass} />
        </button>
      )
    })
}

const logoClass = classNames(styles.PrimaryNav_navItem, styles.PrimaryNav_navItem__logo)

export const PrimaryNav = observer(() => {
  const primaryNavCss = classNames(styles.PrimaryNav, {
    [styles.PrimaryNav__hasAlert]: app.alertProvider.alert,
  })

  return (
    <div className={primaryNavCss}>
      <div className={styles.PrimaryNav_navBar}>
        <button type='button' className={logoClass}>
          <Svg data={logo} className={styles.PrimaryNav_logoIcon} />
        </button>
        {renderNavItems()}
      </div>
      <div className={styles.PrimaryNav_settings}>
        <button type='button' className={styles.PrimaryNav_navItem}>
          <Icon id='nav_settings_m' className={styles.PrimaryNav_navItemIcon} />
        </button>
      </div>
    </div>
  )
})
