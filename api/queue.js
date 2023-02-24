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
    const { data } = await this.client.get()
    return data
  }

  async resetDelay (appId) {
    const { data } = await this.client.delete(`${appId}/delay`)
    return data
  }
}

module.exports = MarathonApiQueueEndpoints
