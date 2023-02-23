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
    return this.client.get()
  }

  async destroy (deploymentId, force) {
    const params = new URLSearchParams([['force', force]])
    return this.client.delete(deploymentId, { params })
  }
}

module.exports = MarathonApiDeploymentEndpoints
