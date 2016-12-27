'use strict';

describe('events', function() {
    var expect = require('chai').expect;
    var Marathon = require('../lib/marathon');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';

    var marathon;

    beforeEach(function() {
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('#attach()', function() {
        it('should attach to the event stream', function() {
            var scope = nock(MARATHON_HOST)
                .matchHeader('Accept', 'text/event-stream')
                .get('/v2/events')
                .reply(200);

            function onSuccess(stream) {
                expect(stream.statusCode).to.equal(200);
                expect(scope.isDone()).to.be.true;
            }

            return marathon.events.attach().then(onSuccess);
        });
    });
});
