var rp = require('request-promise');
var _ = require('lodash');

var API_VERSION = 'v2';
var PATHS_WITHOUT_PREFIX = ['/ping', '/metrics'];

var apps = require('./apps');
var deployments = require('./deployments');
var groups = require('./groups');
var tasks = require('./tasks');
var artifacts = require('./artifacts');
var events = require('./events');
var subscriptions = require('./subscriptions');
var info = require('./info');
var leader = require('./leader');
var queue = require('./queue');
var misc = require('./misc');

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

    if (opts.username && opts.password) {
        const encoded = new Buffer([opts.username, opts.password].join(':')).toString('base64');
        baseOptions.headers = {
            Authorization: ['Basic', encoded].join(' ')
        };
    }

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
                .finally(logTime);
        };
    }

    return {
        app: apps(makeRequest),
        deployments: deployments(makeRequest),
        groups: groups(makeRequest),
        tasks: tasks(makeRequest),
        artifacts: artifacts(makeRequest),
        events: events(makeRequest),
        subscriptions: subscriptions(makeRequest),
        info: info(makeRequest),
        leader: leader(makeRequest),
        queue: queue(makeRequest),
        misc: misc(makeRequest)
    };
}
