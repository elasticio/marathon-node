'use strict';

describe('info', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('#get()', function() {
        it('should get info about the Marathon instance', function() {
            var response = {
                frameworkId: '20140730-222531-1863654316-5050-10422-0000',
                leader: '127.0.0.1:8080',
                http_config: {
                    assets_path: null,
                    http_port: 8080,
                    https_port: 8443
                },
                event_subscriber: {
                    type: 'http_callback',
                    http_endpoints: [
                        'localhost:9999/events'
                    ]
                },
                marathon_config: {
                    checkpoint: false,
                    executor: '//cmd',
                    failover_timeout: 604800,
                    ha: true,
                    hostname: '127.0.0.1',
                    local_port_max: 49151,
                    local_port_min: 32767,
                    master: 'zk://localhost:2181/mesos',
                    mesos_leader_ui_url: 'http://mesos.vm:5050',
                    mesos_role: null,
                    mesos_user: 'root',
                    reconciliation_initial_delay: 30000,
                    reconciliation_interval: 30000,
                    task_launch_timeout: 60000
                },
                name: 'marathon',
                version: '0.7.0-SNAPSHOT',
                zookeeper_config: {
                    zk: 'zk://localhost:2181/marathon',
                    zk_timeout: 10000,
                    zk_session_timeout: 1800000,
                    zk_max_version: 5
                }
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/info')
                .reply(200, response);

            return marathon.info.get().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
