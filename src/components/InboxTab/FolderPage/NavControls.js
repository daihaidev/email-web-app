import React from 'react'
import { observer } from 'mobx-react'

import { app } from 'app'
import { ButtonWithAnimatedIcon } from 'components/Button/ButtonWithAnimatedIcon'
import { Pagination } from 'components/Pagination/Pagination'
import styles from './NavControls.scss'

export const NavControls = observer(({ folder }) => {
  const currentViewMode = app.currentUser.preferences.compactTickets

  const setViewMode = () => {
    app.currentUser.preferences.compactTickets = !currentViewMode
  }

  return (
    <div className={styles.NavControls}>
      <ButtonWithAnimatedIcon
        animation={{
          transitionName: 'verticalSlide',
          iconFromId: 'ticket_viewExpanded_m',
          iconToId: 'ticket_viewCompact_m',
          state: currentViewMode,
        }}
        onClick={setViewMode}
      />
      <div className={styles.NavControls_pageNav}>
        <Pagination
          onNext={() => folder.goToNextPage()}
          onPrev={() => folder.goToPrevPage()}
          value={folder.page > 99 ? '' : folder.page}
          nextDisabled={!folder.hasNextPage}
          prevDisabled={!folder.hasPrevPage}
        />
      </div>
    </div>
  )
})
