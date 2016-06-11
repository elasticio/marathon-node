module.exports = function createMethods(makeRequest) {
    return {
        // /v2/apps
        getList: function getList(query) {
            return makeRequest('GET', '/apps')(query);
        },
        create: function create(body) {
            return makeRequest('POST', '/apps')(null, body);
        },

        // /v2/apps/{app_id}
        getOne: function getOne(appId, query) {
            return makeRequest('GET', '/apps/' + appId)(query);
        },
        update: function update(appId, body, force) {
            return makeRequest('PUT', '/apps/' + appId)({force: force}, body);
        },
        destroy: function destroy(appId, force) {
            return makeRequest('DELETE', '/apps/' + appId)({force: force});
        },

        // /v2/apps/{app_id}/restart
        restart: function restart(appId, force) {
            return makeRequest('POST', '/apps/' + appId + '/restart')({force: force});
        },

        // /v2/apps/{app_id}/tasks
        getTasks: function getTasks(appId) {
            return makeRequest('GET', '/apps/' + appId + '/tasks')();
        },

        killTasks: function killTasks(appId, parameters) {
            return makeRequest('DELETE', '/apps/' + appId + '/tasks')(parameters);
        },

        // /v2/apps/{app_id}/tasks/{task_id}
        killTask: function killTask(appId, taskId, scale) {
            return makeRequest('DELETE', '/apps/' + appId + '/tasks/' + taskId)({scale: scale});
        },

        // /v2/apps/{app_id}/versions
        getVersions: function getVersions(appId) {
            return makeRequest('GET', '/apps/' + appId + '/versions')();
        },

        // /v2/apps/{app_id}/versions/{version}
        getVersion: function getVersion(appId, versionId) {
            return makeRequest('GET', '/apps/' + appId + '/versions/' + versionId)();
        }
    };
};
