'use strict';

describe('deployments', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('#getList()', function() {
        it('should get list of deployments', function() {
            var response = {
                affectedApps: [
                    "/tools/docker/registry"
                ],
                currentStep: 2,
                currentActions: [
                    {
                        action: "RestartApplication",
                        app: "/tools/docker/registry"
                    }
                ],
                totalSteps: 9,
                id: '5ed4c0c5-9ff8-4a6f-a0cd-f57f59a34b43',
                steps: [
                    [
                        {
                            action: "RestartApplication",
                            app: "/tools/docker/registry"
                        },
                        {
                            action: "KillAllOldTasksOf",
                            app: "/tools/docker/registry"
                        },
                        {
                            action: "ScaleApplication",
                            app: "/tools/docker/registry"
                        }
                    ]
                ],
                version: '2015-09-29T15:59:51.164Z'
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/deployments')
                .reply(200, response);

            return marathon.deployments.getList().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#destroy()', function() {
        it('should destroy deployment by id', function() {
            var response = {
                deploymentId: '0b1467fc-d5cd-4bbc-bac2-2805351cee1e',
                version: '2015-09-29T15:59:51.164Z'
            };

            var deploymentId = '5ed4c0c5-9ff8-4a6f-a0cd-f57f59a34b43';

            var scope = nock(MARATHON_HOST)
                .delete('/v2/deployments/' + deploymentId)
                .query({
                    force: false
                })
                .reply(200, response);

            return marathon.deployments.destroy(deploymentId, false).then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
