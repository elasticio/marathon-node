'use strict';

var rp = require('request-promise');
var request = require('request');
var Promise = require('bluebird');
var _ = require('lodash');
var EventSource = require('eventsource');
var nodeUrl = require('url');
var nodePath = require('path');

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
function Marathon(baseUrl, opts) {
    opts = opts || {};

    var baseOptions = {
        json: true
    };

    _.assign(baseOptions, _.omit(opts, 'logTime'));

    function getRequestUrl(path) {
        if (PATHS_WITHOUT_PREFIX.indexOf(path) < 0) {
            path = nodePath.join('/', API_VERSION, path);
        }

        var result = nodeUrl.parse(baseUrl);
        result.pathname = nodePath.join(result.pathname, path);
        return result;
    }

    function makeRequest(method, path, addOptions, requestStream) {
        return function closure(query, body) {
            var requestOptions = _.cloneDeep(baseOptions);

            requestOptions.method = method;
            requestOptions.qs = query;
            requestOptions.url = nodeUrl.format(getRequestUrl(path));

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

            if (requestStream) {
                return new Promise(function createPromise(resolve, reject) {
                    request[method.toLowerCase()](requestOptions)
                        .on('error', function onError(err) {
                            return reject(err);
                        })
                        .on('response', function onResponse(readableStream) {
                            readableStream.on('end', function onEnd() {
                                logTime();
                            });
                            return resolve(readableStream);
                        });
                });
            }

            return rp(requestOptions).finally(logTime);
        };
    }

    var client = {
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

    client.apps = client.app;
    client.events.createEventSource = function createEventSource(opts) {
        var url = getRequestUrl('/events');
        opts = opts || {};

        url.query = url.query || {};

        var eventType = opts.eventType;
        if (eventType) {
            if (!_.isString(eventType) && !_.isArray(eventType)) {
                throw new Error('"eventType" should be a string or an array');
            }

            url.query.event_type = eventType;
        }
        return new EventSource(nodeUrl.format(url), opts);
    };

    return client;
}

module.exports = Marathon;
