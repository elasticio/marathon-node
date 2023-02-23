'use strict'

class MarathonApiTaskEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/tasks`
    this.client = ctx.http.create()
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async getList () {
    return this.client.get()
  }

  async kill (data, scale, wipe) {
    const params = new URLSearchParams(Object.entries({ scale, wipe }))
    return this.client.post('delete', { json: data }, { params })
  }
}

module.exports = MarathonApiTaskEndpoints
