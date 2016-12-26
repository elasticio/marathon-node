'use strict';

describe('leader', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('#get()', function() {
        it('should get the current leader', function() {
            var response = {
                leader: '127.0.0.1:8080'
            };

            var scope = nock(MARATHON_HOST)
                .get('/v2/leader')
                .reply(200, response);

            return marathon.leader.get().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });

    describe('#abdicate()', function() {
        it('should cause the current leader to abdicate', function() {
            var response = {
                message: 'Leadership abdicated'
            };

            var scope = nock(MARATHON_HOST)
                .delete('/v2/leader')
                .reply(200, response);

            return marathon.leader.abdicate().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
