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
    const { data } = await this.client.get()
    return data
  }

  async kill (data, scale, wipe) {
    const params = new URLSearchParams(Object.entries({ scale, wipe }))
    const { data: result } = await this.client.post('delete', { json: data }, { params })
    return result
  }
}

module.exports = MarathonApiTaskEndpoints
