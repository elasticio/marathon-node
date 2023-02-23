'use strict'

class MarathonApiInfoEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/info`
    this.client = ctx.http.create()
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async get () {
    return this.client.get()
  }
}

module.exports = MarathonApiInfoEndpoints
