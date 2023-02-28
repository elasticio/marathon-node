'use strict'

class MarathonApiLeaderEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/leader`
    this.client = ctx.http
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async get () {
    const { data } = await this.client.get()
    return data
  }

  async abdicate () {
    const { data } = await this.client.delete()
    return data
  }
}

module.exports = MarathonApiLeaderEndpoints
