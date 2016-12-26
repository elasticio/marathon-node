'use strict';

describe('groups', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('#getList()', function() {
        it('should get list of groups', function() {
            var response = {
                apps: [],
                dependencies: [],
                groups: [
                    {
                        apps: [
                            {
                                args: null,
                                backoffFactor: 1.15,
                                backoffSeconds: 1,
                                maxLaunchDelaySeconds: 3600,
                                cmd: 'sleep 30',
                                constraints: [],
                                container: null,
                                cpus: 1.0,
                                dependencies: [],
                                disk: 0.0,
                                env: {},
                                executor: '',
                                healthChecks: [],
                                id: '/test/app',
                                instances: 1,
                                mem: 128.0,
                                ports: [
                                    10000
                                ],
                                requirePorts: false,
                                storeUrls: [],
                                upgradeStrategy: {
                                    minimumHealthCapacity: 1.0
                                },
                                uris: [],
                                user: null,
                                version: '2014-08-28T01:05:40.586Z'
                            }
                        ],
                        dependencies: [],
                        groups: [],
                        id: '/test',
                        version: '2014-08-28T01:09:46.212Z'
                    }
                ],
                id: '/',
                version: '2014-08-28T01:09:46.212Z'
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/groups')
                .reply(200, response);

            return marathon.groups.getList().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#create()', function() {
        it('should create new group', function() {
            var groupConfig = {
                id: 'product',
                apps: [
                    {
                        id: 'myapp',
                        cmd: 'ruby app2.rb',
                        instances: 1
                    }
                ]
            };

            var response = {
                version: '2014-03-01T23:29:30.158Z'
            };

            var scope = nock(MARATHON_HOST)
                .post('/v2/groups', groupConfig)
                .reply(200, response);

            return marathon.groups.create(groupConfig).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#getOne()', function() {
        it('should get one group by id', function() {
            var response = {
                apps: [
                    {
                        args: null,
                        backoffFactor: 1.15,
                        backoffSeconds: 1,
                        maxLaunchDelaySeconds: 3600,
                        cmd: 'sleep 30',
                        constraints: [],
                        container: null,
                        cpus: 1.0,
                        dependencies: [],
                        disk: 0.0,
                        env: {},
                        executor: '',
                        healthChecks: [],
                        id: '/test/app',
                        instances: 1,
                        mem: 128.0,
                        ports: [
                            10000
                        ],
                        requirePorts: false,
                        storeUrls: [],
                        upgradeStrategy: {
                            minimumHealthCapacity: 1.0
                        },
                        uris: [],
                        user: null,
                        version: '2014-08-28T01:05:40.586Z'
                    }
                ],
                dependencies: [],
                groups: [],
                id: '/test',
                version: '2014-08-28T01:09:46.212Z'
            };

            var groupId = 'test';

            var scope = nock(MARATHON_HOST)
                .get('/v2/groups/' + groupId)
                .reply(200, response);

            return marathon.groups.getOne(groupId).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#update()', function() {
        it('should update existing group', function() {
            var groupConfig = {
                apps: [
                    {
                        cmd: 'ruby app2.rb',
                        constraints: [],
                        container: null,
                        cpus: 0.2,
                        env: {},
                        executor: '//cmd',
                        healthChecks: [
                            {
                                initialDelaySeconds: 15,
                                intervalSeconds: 5,
                                path: '/health',
                                portIndex: 0,
                                protocol: 'HTTP',
                                timeoutSeconds: 15
                            }
                        ],
                        id: 'app',
                        instances: 6,
                        mem: 128.0,
                        ports: [
                            19970
                        ],
                        uris: []
                    }
                ]
            };

            var response = {
                deploymentId: '5ed4c0c5-9ff8-4a6f-a0cd-f57f59a34b43',
                version: '2015-09-29T15:59:51.164Z'
            };

            var groupId = 'test/project';

            var scope = nock(MARATHON_HOST)
                .put('/v2/groups/' + groupId, groupConfig)
                .query({
                    force: true
                })
                .reply(200, response);

            return marathon.groups.update(groupId, groupConfig, true).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#destroy()', function() {
        it('should destroy group by id', function() {
            var response = {
                deploymentId: '5ed4c0c5-9ff8-4a6f-a0cd-f57f59a34b43',
                version: '2015-09-29T15:59:51.164Z'
            };

            var groupId = '/product/service/app';

            var scope = nock(MARATHON_HOST)
                .delete('/v2/groups/' + groupId)
                .query({
                    force: true
                })
                .reply(200, response);

            return marathon.groups.destroy(groupId, true).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
