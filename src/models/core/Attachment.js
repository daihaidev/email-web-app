import { makeAutoObservable } from 'mobx'

export class Attachment {
  size

  uploading

  constructor(data) {
    makeAutoObservable(this)

    Object.assign(this, data)
  }

  get humanSize() {
    let i = 0
    const units = ['B', 'KB', 'MB', 'GB']
    while (this.size > 1024) {
      this.size /= 1024
      i += 1
    }

    return (Math.round(this.size * 100) / 100).toString() + units[i]
  }

  upload() {
    this.uploading = true
    setTimeout(() => {
      this.uploaded()
    }, 700)
    // upload attachment
  }

  uploaded() {
    this.uploading = false
    // upload attachment
  }

  download() {
    // download attachment
  }

  delete() {
    // delete attachment
  }
}
