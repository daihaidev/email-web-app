export class Http {
  formData(data) {
    const params = new URLSearchParams()
    Object.entries(data).forEach(field => {
      const [key, value] = field
      params.append(key, value)
    })
    return params
  }

  post(url, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.pretendPost(url, data)
        if (result.ok === true) {
          resolve(result)
        } else {
          reject(result)
        }
      }, 300)
    })
  }

  pretendPost(url, data) {
    const result = { ok: true, status: 200, url, data }
    return result
  }
}
