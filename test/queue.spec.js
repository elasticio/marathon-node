'use strict';

describe('queue', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('#get()', function() {
        it('should get queue', function() {
            var response = {
                queue: [
                    {
                        count: 10,
                        delay: {
                            overdue: 'true',
                            timeLeftSeconds: 784
                        },
                        app: {
                            cmd: 'tail -f /dev/null',
                            backoffSeconds: 1,
                            healthChecks: [],
                            storeUrls: [],
                            constraints: [],
                            env: {},
                            cpus: 0.1,
                            labels: {},
                            instances: 10,
                            ports: [
                                10000
                            ],
                            requirePorts: false,
                            uris: [],
                            container: null,
                            backoffFactor: 1.15,
                            args: null,
                            version: '2015-02-09T10:49:59.831Z',
                            maxLaunchDelaySeconds: 3600,
                            upgradeStrategy: {
                                minimumHealthCapacity: 1,
                                maximumOverCapacity: 1
                            },
                            dependencies: [],
                            mem: 16,
                            id: '/foo',
                            disk: 0,
                            executor: '',
                            user: null
                        }
                    }
                ]
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/queue')
                .reply(200, response);

            return marathon.queue.get().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#resetDelay()', function() {
        it('should reset application specific task launch delay', function() {
            var response = {};

            var appId = 'myapp';

            var scope = nock(MARATHON_HOST)
                .delete('/v2/queue/' + appId + '/delay')
                .reply(204, response);

            return marathon.queue.resetDelay(appId).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
