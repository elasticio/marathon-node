var rp = require('request-promise');
var _ = require('lodash');
var nodeUrl = require('url');

/**
 * https://mesosphere.github.io/marathon/docs/rest-api.html
 */

module.exports = Marathon;

function Marathon(url) {
    var OPTIONS = {
        url: url,
        json: true
    };

    function makeRequest(method, path, addOptions, skipVersion) {
        return function (query, body) {
            var options = _.cloneDeep(OPTIONS);
            options.method = method;
            options.qs = query;
            options.url = nodeUrl.resolve(options.url, (skipVersion ? '/' : '/v2/') + path);
            if (addOptions) {
                options = _.extend(options, addOptions);
            }
            options.body = body;
            return rp(options).catch(formatError);
        };

        function formatError(err){
            var error = new Error('Marathon response was: ' + err.message);
            error.name = err.name;
            error.statusCode = err.statusCode;
            error.options = err.options;
            throw error;
        }
    }

    return {
        app: {
            getList: function (parameters) {
                return makeRequest('GET', 'apps')(parameters);
            },
            getOne: function (id) {
                return makeRequest('GET', 'apps/' + id)();
            },
            getVersions: function (id) {
                return makeRequest('GET', 'apps/' + id + '/versions')();
            },
            getVersion: function (id, version) {
                return makeRequest('GET', 'apps/' + id + '/versions/' + version)();
            },
            getTasks: function (id) {
                return makeRequest('GET', 'apps/' + id + '/tasks')();
            },
            create: function (body) {
                return makeRequest('POST', 'apps')(null, body);
            },
            update: function (id, body, force) {
                return makeRequest('PUT', 'apps/' + id)({force: force}, body);
            },
            restart: function (id, force) {
                return makeRequest('POST', 'apps/' + id + '/restart')({force: force});
            },
            destroy: function (id) {
                return makeRequest('DELETE', 'apps/' + id)();
            },
            killTasks: function (id, parameters) {
                return makeRequest('DELETE', 'apps/' + id + '/tasks')(parameters);
            },
            killTask: function (id, task, scale) {
                return makeRequest('DELETE', 'apps/' + id + '/tasks/' + task)({scale: scale});
            }
        },
        groups: {},
        tasks: {},
        deployments: {},
        subscriptions: {
            getList: makeRequest('GET', 'eventSubscriptions'),
            create: function (url) {
                return makeRequest('POST', 'eventSubscriptions')({callbackUrl: url});
            }
        },
        queue: {},
        info: {},
        misc: {
            ping: function (addOptions) {
                return makeRequest('GET', 'ping', addOptions, true)();
            }
        }
    };
}