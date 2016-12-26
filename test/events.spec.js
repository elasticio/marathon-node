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
            var response = {};

            var scope = nock(MARATHON_HOST)
                .get('/v2/events')
                .reply(200, response);

            return marathon.events.attach().then(onSuccess);

            function onSuccess(data) {
                expect(data).to.deep.equal(response);
                expect(scope.isDone()).to.be.true;
            }
        });
    });
});
