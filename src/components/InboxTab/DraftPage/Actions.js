import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'

import { ButtonWithIcon } from 'components/Button/ButtonWithIcon'
import { Dropdown } from 'components/Dropdown/Dropdown'
import { UserDropdown } from 'components/Dropdown/UserDropdown'
import { LabelSearchDropdown } from 'components/Dropdown/LabelSearchDropdown'

import styles from './Actions.scss'

export const Actions = observer(() => {
  return (
    <div className={styles.Actions}>
      <ButtonWithIcon iconId='ui_back_m' onClick={() => app.router.back()} />
      <Dropdown
        position='bottomLeft'
        trigger={isActive => <ButtonWithIcon iconId='action_assign_m' isActive={isActive} />}
      >
        <UserDropdown onClick={() => {}} />
      </Dropdown>
      <LabelSearchDropdown
        trigger={isActive => <ButtonWithIcon iconId='action_label_m' isActive={isActive} />}
        context={{ tickets: [app.ui.inboxTab.draft] }}
        onAddLabelClick={labelId => app.ui.inboxTab.draft.addLabel(labelId)}
        onRemoveLabelClick={labelId => app.ui.inboxTab.draft.removeLabel(labelId)}
      />
    </div>
  )
})
