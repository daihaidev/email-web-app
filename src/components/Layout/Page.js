import React, { forwardRef } from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'

import { app } from 'app'
import styles from './Page.scss'

export const Page = observer(
  forwardRef(({ header, sidebar, customClass, children }, ref) => {
    const pageCss = classNames(styles.Page, {
      [customClass]: customClass,
    })

    const pageMainCss = classNames(styles.Page_main, {
      [styles.Page_main__hasAlert]: app.alertProvider.alert,
    })

    const pageSidebarCss = classNames(styles.Page_sidebar, {
      [styles.Page_sidebar__hasAlert]: app.alertProvider.alert,
    })

    return (
      <div className={pageCss}>
        {header}
        <div className={styles.Page_content}>
          <aside className={pageSidebarCss}>{sidebar}</aside>

          <main className={pageMainCss}>
            <div className={styles.Page_scroll} ref={ref}>
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  })
)
