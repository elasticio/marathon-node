'use strict';

describe('config', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    it('should allow marathon urls with paths', function() {
        var pathedUrl = MARATHON_HOST + '/service/marathon';

        var scope = nock(MARATHON_HOST)
            .get('/service/marathon/ping')
            .reply(200, 'pong');

        var marathon = new Marathon(pathedUrl);

        function onSuccess(data) {
            expect(data).to.equal('pong');
            expect(scope.isDone()).to.be.true;
        }

        return marathon.misc.ping()
            .then(onSuccess);
    });

    it('should support HTTP Authentication', function() {
        var scope = nock(MARATHON_HOST)
            .matchHeader('Authorization', 'Basic dXNlcjE6cGFzczE=')
            .get('/ping')
            .reply(200, 'pong');

        var marathon = new Marathon(MARATHON_HOST, {
            auth: {
                user: 'user1',
                pass: 'pass1'
            }
        });

        function onSuccess(data) {
            expect(data).to.equal('pong');
            expect(scope.isDone()).to.be.true;
        }

        return marathon.misc.ping()
            .then(onSuccess);
    });
});
