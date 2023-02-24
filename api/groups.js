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
    const { data } = await this.client.get()
    return data
  }

  async create (data) {
    const { data: result } = await this.client.post('', { json: data })
    return result
  }

  async getOne (groupId) {
    const { data } = await this.client.get(groupId)
    return data
  }

  async update (groupId, data, force) {
    const params = new URLSearchParams([['force', force]])
    const { data: result } = await this.client.put(groupId, { json: data }, { params })
    return result
  }

  async destroy (groupId, force) {
    const params = new URLSearchParams([['force', force]])
    const { data } = await this.client.delete(groupId, undefined, { params })
    return data
  }
}

module.exports = MarathonApiGroupEndpoints
