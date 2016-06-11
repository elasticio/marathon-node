var rp = require('request-promise');
var _ = require('lodash');

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

    function makeRequest(method, path, addOptions, skipVersion) {
        return function closure(query, body) {
            var requestOptions = _.cloneDeep(baseOptions);
            path = (skipVersion ? '/' : '/v2/') + path;

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
                return makeRequest('GET', 'apps')(query);
            },
            create: function create(body) {
                return makeRequest('POST', 'apps')(null, body);
            },

            // /v2/apps/{app_id}
            getOne: function getOne(id, query) {
                return makeRequest('GET', 'apps/' + id)(query);
            },
            update: function update(id, body, force) {
                return makeRequest('PUT', 'apps/' + id)({force: force}, body);
            },
            destroy: function destroy(id, force) {
                return makeRequest('DELETE', 'apps/' + id)({force: force});
            },

            // /v2/apps/{app_id}/restart
            restart: function restart(id, force) {
                return makeRequest('POST', 'apps/' + id + '/restart')({force: force});
            },

            // /v2/apps/{app_id}/tasks
            getTasks: function getTasks(id) {
                return makeRequest('GET', 'apps/' + id + '/tasks')();
            },

            killTasks: function killTasks(id, parameters) {
                return makeRequest('DELETE', 'apps/' + id + '/tasks')(parameters);
            },

            // /v2/apps/{app_id}/tasks/{task_id}
            killTask: function killTask(id, task, scale) {
                return makeRequest('DELETE', 'apps/' + id + '/tasks/' + task)({scale: scale});
            },

            // /v2/apps/{app_id}/versions
            getVersions: function getVersions(id) {
                return makeRequest('GET', 'apps/' + id + '/versions')();
            },

            // /v2/apps/{app_id}/versions/{version}
            getVersion: function getVersion(id, version) {
                return makeRequest('GET', 'apps/' + id + '/versions/' + version)();
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
            getList: makeRequest('GET', 'eventSubscriptions'),
            create: function create(url) {
                return makeRequest('POST', 'eventSubscriptions')({callbackUrl: url});
            },
            delete: function deleteSubscription(url) {
                return makeRequest('DELETE', 'eventSubscriptions')({callbackUrl: url});
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
                return makeRequest('GET', 'ping', addOptions, true)();
            }
            // /metrics todo
        }
    };
}
