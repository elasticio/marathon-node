'use strict';

describe('misc', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    function expectError() {
        throw new Error('Error is expected');
    }

    describe('#ping()', function() {
        it('should make ping', function() {
            var response = 'pong';

            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .reply(200, response);

            return marathon.misc.ping()
                .then(onSuccess);

            function onSuccess(data) {
                expect(data).to.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });

        it('should make ping with timeout & reply pong', function() {
            var response = 'pong';

            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .delayConnection(10)
                .reply(200, response);

            return marathon.misc.ping({timeout: 20})
                .then(onSuccess);

            function onSuccess(data) {
                expect(data).to.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });

        it('should report ETIMEDOUT on timeout', function() {
            var response = 'pong';

            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .delayConnection(30)
                .reply(200, response);

            return marathon.misc.ping({timeout: 10})
                .then(expectError)
                .catch(onError);

            function onError(err) {
                expect(err.message).to.equal('Error: ETIMEDOUT');
                expect(scope.isDone()).to.be.true;
            }
        });

        it('should make ping with timeout', function() {
            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .reply(400, 'no-response');

            function onError(err) {
                expect(scope.isDone()).to.be.true;
                expect(err.name).to.equal('StatusCodeError');
                expect(err.message).to.equal('400 - "no-response"');
                expect(err.statusCode).to.equal(400);
                expect(err.options.url).to.equal('http://01.02.03.04:5678/ping');
                expect(err.options.timeout).to.equal(2000);
            }

            return marathon.misc.ping({timeout: 2000})
                .then(expectError)
                .catch(onError);
        });
    });
});
