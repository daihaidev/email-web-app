import PubSub from 'pubsub-js'

export class StreamDispatcher {
  start() {
    // dummy function
  }

  getUpdatesAndResetUpdateTimer() {
    // dummy function
  }

  sendTicketUpdates(data) {
    delete data.messages // don't send messages in ticket updates
    delete data.draft // don't send draft in ticket updates

    if (!data.action) data.action = 'update'

    PubSub.publish(`StreamDispatcher_ticketUpdate`, data)
  }

  sendCustomerUpdates(data) {
    if (!data.action) data.action = 'update'

    PubSub.publish(`StreamDispatcher_customerUpdate`, data)
  }
}
