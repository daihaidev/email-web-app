import React from 'react'
import { observer } from 'mobx-react'
import { app } from 'app'
import { ErrorBoundary } from './ErrorBoundary'
import { AppContainer } from './AppContainer'

export const App = observer(() => {
  if (!app.initialized) {
    return <div>Loading</div>
  }
  return (
    <ErrorBoundary>
      <AppContainer />
    </ErrorBoundary>
  )
})
