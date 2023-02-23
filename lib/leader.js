'use strict'

class MarathonApiLeaderEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/leader`
    this.client = ctx.http.create()
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async get () {
    return this.client.get()
  }

  async abdicate () {
    return this.client.delete()
  }
}

module.exports = MarathonApiLeaderEndpoints
