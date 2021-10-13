import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import { TicketSummary } from 'components/InboxTab/TicketSummary/TicketSummary'
import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { Svg } from 'components/Svg'
import MergeArrowDown from './MergeArrowDown.svg'

import styles from './MergeContent.scss'

export const MergeContent = observer(() => {
  const goToNext = () => {
    app.ui.inboxTab.ticketsModal.destinationIndex += 1
  }

  const goToPrev = () => {
    app.ui.inboxTab.ticketsModal.destinationIndex -= 1
  }

  const renderNextButton = () => {
    if (app.ui.inboxTab.ticketsModal.showNextButton) {
      return (
        <ButtonWithIcon
          iconId='ui_next_m'
          onClick={goToNext}
          customClass={styles.MergeContent_button}
          customWrapperClass={styles.MergeContent_next}
        />
      )
    }
    return null
  }

  const renderPrevButton = () => {
    if (app.ui.inboxTab.ticketsModal.showPrevButton) {
      return (
        <ButtonWithIcon
          iconId='ui_next_m'
          onClick={goToPrev}
          iconCustomClass={styles.MergeContent_prevIcon}
          customClass={styles.MergeContent_button}
          customWrapperClass={styles.MergeContent_prev}
        />
      )
    }
    return null
  }

  return (
    <div className={styles.MergeContent}>
      <TicketSummary model={app.ui.inboxTab.ticketsModal.source} />
      <Svg data={MergeArrowDown} className={styles.MergeContent_arrow} />
      <div className={styles.MergeContent_destination}>
        {renderNextButton()}
        <TicketSummary model={app.ui.inboxTab.ticketsModal.destination} />
        {renderPrevButton()}
      </div>
    </div>
  )
})
