var rp = require('request-promise');
var _ = require('lodash');

var API_VERSION = 'v2';
var PATHS_WITHOUT_PREFIX = ['/ping', '/metrics'];

/**
 * https://mesosphere.github.io/marathon/docs/rest-api.html
 */

module.exports = Marathon;

function Marathon(url, opts) {
    opts = opts || {};

    var baseOptions = {
        url: url.replace(/\/$/, ''),
        json: true,
        timeout: opts.timeout
    };

    function makeRequest(method, path, addOptions) {
        return function closure(query, body) {
            var requestOptions = _.cloneDeep(baseOptions);

            if (PATHS_WITHOUT_PREFIX.indexOf(path) < 0) {
                path = '/' + API_VERSION + path;
            }

            requestOptions.method = method;
            requestOptions.qs = query;
            requestOptions.url = requestOptions.url + path;

            if (addOptions) {
                requestOptions = _.extend(requestOptions, addOptions);
            }

            requestOptions.body = body;

            var consoleTimeToken = 'Request to Marathon ' + path;

            if (opts.logTime) {
                console.time(consoleTimeToken);
            }

            function logTime() {
                if (opts.logTime) {
                    console.timeEnd(consoleTimeToken);
                }
            }

            return rp(requestOptions)
                .catch(formatError)
                .finally(logTime);
        };

        function formatError(err) {
            var error = new Error('Marathon response was: ' + err.message);
            error.name = err.name;
            error.statusCode = err.statusCode;
            error.options = err.options;
            throw error;
        }
    }

    return {
        app: {
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
        },
        deployments: {
            // /v2/deployments todo
            // /v2/deployments/{deployment_id} todo
        },
        groups: {
            // /v2/groups todo
            // /v2/groups/versions todo
            // /v2/groups/{group_id} todo
            // /v2/groups/{group_id}/versions todo
        },
        tasks: {
            // /v2/tasks todo
            // /v2/tasks/delete todo
        },
        artifacts: {
            // /v2/artifacts todo
            // /v2/artifacts/{path} todo
        },
        events: {
            // /v2/events todo
        },
        //eventSubscriptions
        subscriptions: {
            getList: makeRequest('GET', '/eventSubscriptions'),
            create: function create(callbackUrl) {
                return makeRequest('POST', '/eventSubscriptions')({callbackUrl: callbackUrl});
            },
            delete: function deleteSubscription(callbackUrl) {
                return makeRequest('DELETE', '/eventSubscriptions')({callbackUrl: callbackUrl});
            }
        },
        info: {
            // /v2/info todo
        },
        leader: {
            // /v2/leader todo
        },
        queue: {
            // /v2/queue todo
            // /v2/queue/{app_id}/delay todo
        },
        misc: {
            ping: function ping(addOptions) {
                return makeRequest('GET', '/ping', addOptions)();
            }
            // /metrics todo
        }
    };
}
