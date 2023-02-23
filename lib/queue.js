'use strict'

class MarathonApiQueueEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/queue`
    this.client = ctx.http.create()
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async get () {
    return this.client.get()
  }

  async resetDelay (appId) {
    return this.client.delete(`${appId}/delay`)
  }
}

module.exports = MarathonApiQueueEndpoints
