'use strict'

class MarathonApiGroupEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/groups`
    this.client = ctx.http.create()
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async getList () {
    return this.client.get()
  }

  create (data) {
    return this.client.post('', { json: data })
  }

  getOne (groupId) {
    return this.client.get(groupId)
  }

  update (groupId, data, force) {
    const params = new URLSearchParams([['force', force]])
    return this.client.put(groupId, { json: data }, { params })
  }

  async destroy (groupId, force) {
    const params = new URLSearchParams([['force', force]])
    return this.client.delete(groupId, undefined, { params })
  }
}

module.exports = MarathonApiGroupEndpoints
