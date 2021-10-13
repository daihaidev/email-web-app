import React from 'react'
import { observer } from 'mobx-react'

import { app } from 'app'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import styles from './NavControls.scss'

export const NavControls = observer(() => {
  return (
    <div className={styles.NavControls}>
      {app.ui.inboxTab.activeFolder ? (
        <ButtonWithIcon
          iconId='ui_previous_m'
          isDisabled={app.ui.inboxTab.activeFolder.indexOfPrevTicket === -1}
          onClick={() => app.ui.inboxTab.activeFolder.goToPrevTicket()}
        />
      ) : null}
      {app.ui.inboxTab.activeFolder ? (
        <ButtonWithIcon
          iconId='ui_next_m'
          isDisabled={app.ui.inboxTab.activeFolder.indexOfNextTicket === -1}
          onClick={() => app.ui.inboxTab.activeFolder.goToNextTicket()}
        />
      ) : null}
    </div>
  )
})
