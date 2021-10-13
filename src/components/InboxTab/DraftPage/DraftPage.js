import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { app } from 'app'

import { CustomerProfile, toggleCustomerProfileEditor } from 'components/CustomerProfile/CustomerProfile'
import { Page } from 'components/Layout/Page'
import { Sidebar } from 'components/Layout/Sidebar'
import { Draft } from './Draft'
import { DraftPageHeader } from './DraftPageHeader'
import styles from './DraftPage.scss'

export const DraftPage = observer(() => {
  const pageClass = classNames({
    uHidden: !app.ui.inboxTab.draftPageIsActive,
  })

  const onSelectCustomer = customer => {
    // console.log('setting customer', customer, customer.name)
    app.ui.inboxTab.draft.setCustomer(customer)
  }

  const onCreateCustomer = customer => {
    app.ui.inboxTab.draft.findOrCreateCustomer(customer)
  }

  const onSaveCustomer = customer => {
    app.ui.inboxTab.draft.setCustomer(customer)
    toggleCustomerProfileEditor(false)
  }

  const renderSidebar = () => (
    <Sidebar>
      <div className={styles.DraftPage_sidebar}>
        <CustomerProfile
          customer={app.ui.inboxTab.draft.customer}
          onSave={onSaveCustomer}
          ticketId={app.ui.inboxTab.draft.id}
        />
      </div>
    </Sidebar>
  )

  const renderHeader = () => <DraftPageHeader />

  return (
    <Page header={renderHeader()} sidebar={renderSidebar()} customClass={pageClass}>
      <Draft onSelectCustomer={onSelectCustomer} onCreateCustomer={onCreateCustomer} />
    </Page>
  )
})
