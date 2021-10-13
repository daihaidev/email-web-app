export class Scheduler {
  constructor() {
    this.queue = []
    this.processing = false
  }

  eventually(callback) {
    this.queue.push(callback)
    this.processQueueAsync()
  }

  processQueueAsync() {
    if (!this.processing) {
      window.setTimeout(() => {
        this.processQueue()
      }, 1)
    }
  }

  processQueue() {
    if (this.queue.length > 0) {
      this.processing = true
      const callback = this.queue.shift()
      callback()

      if (this.queue.length > 0) {
        this.processQueueAsync()
      } else {
        this.processing = false
      }
    } else {
      this.processing = false
    }
  }
}
