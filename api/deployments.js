'use strict'

class MarathonApiDeploymentEndpoints {
  constructor (ctx) { // accepts a parent context
    this.parent = ctx
    this.baseURL = ctx.baseURL
    this.baseURL.pathname = `${ctx.basePath}/deployments`
    this.client = ctx.http.create()
    this.client.defaults.baseURL = this.baseURL.toString()
  }

  async getList () {
    const { data } = await this.client.get()
    return data
  }

  async destroy (deploymentId, force) {
    const params = new URLSearchParams([['force', force]])
    const { data } = await this.client.delete(deploymentId, { params })
    return data
  }
}

module.exports = MarathonApiDeploymentEndpoints
