module.exports = function createMethods(makeRequest) {
    return {
        // /v2/deployments
        getList: function getList() {
            return makeRequest('GET', '/deployments')();
        },
        // /v2/deployments/{deployment_id}
        destroy: function destroy(deploymentId, force) {
            return makeRequest('DELETE', '/deployments/' + deploymentId)({force: force});
        }
    };
};
