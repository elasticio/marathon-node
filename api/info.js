'use strict'

class MarathonApiInfoEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/info`
    this.client = ctx.http
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async get (timeout = 1000) {
    const { data } = await this.client.get('', { timeout })
    return data
  }
}

module.exports = MarathonApiInfoEndpoints
