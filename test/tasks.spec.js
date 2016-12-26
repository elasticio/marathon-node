'use strict';

describe('tasks', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('#getList()', function() {
        it('should get list of tasks', function() {
            var response = {
                tasks: [
                    {
                        appId: '/bridged-webapp',
                        host: '10.141.141.10',
                        id: 'bridged-webapp.eb76c51f-4b4a-11e4-ae49-56847afe9799',
                        ports: [
                            31000
                        ],
                        stagedAt: '2014-10-03T22:16:27.811Z',
                        startedAt: '2014-10-03T22:57:41.587Z',
                        version: '2014-10-03T22:16:23.634Z'
                    },
                    {
                        appId: '/bridged-webapp',
                        host: '10.141.141.10',
                        id: 'bridged-webapp.ef0b5d91-4b4a-11e4-ae49-56847afe9799',
                        ports: [
                            31001
                        ],
                        stagedAt: '2014-10-03T22:16:33.814Z',
                        startedAt: '2014-10-03T22:57:41.593Z',
                        version: '2014-10-03T22:16:23.634Z'
                    }
                ]
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/tasks')
                .reply(200, response);

            return marathon.tasks.getList().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#kill()', function() {
        it('should kill tasks', function() {
            var tasks = {
                ids: [
                    'task.25ab260e-b5ec-11e4-a4f4-685b35c8a22e',
                    'task.5e7b39d4-b5f0-11e4-8021-685b35c8a22e',
                    'task.a21cb64a-b5eb-11e4-a4f4-685b35c8a22e'
                ]
            };

            var response = {};

            var scope = nock(MARATHON_HOST)
                .post('/v2/tasks/delete', tasks)
                .query({
                    scale: false,
                    wipe: false
                })
                .reply(200, response);

            return marathon.tasks.kill(tasks, false, false).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
