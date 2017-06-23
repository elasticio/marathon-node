'use strict';

describe('events', function() {
    var EventSource = require('eventsource');
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

    describe('#createEventSource()', function () {
        it('should return event source object', function () {
            var es = marathon.events.createEventSource();
            expect(es instanceof EventSource).to.be.true;
            expect(es.url).to.equal('http://01.02.03.04:5678/v2/events');
        });

        it('should accept eventType option as string', function () {
            var es = marathon.events.createEventSource({
                eventType: 'type_1'
            });
            expect(es instanceof EventSource).to.be.true;
            expect(es.url).to.equal('http://01.02.03.04:5678/v2/events?event_type=type_1');
        });

        it('should accept eventType option as array', function () {
            var es = marathon.events.createEventSource({
                eventType: ['type_1', 'type_2']
            });
            expect(es instanceof EventSource).to.be.true;
            expect(es.url).to.equal('http://01.02.03.04:5678/v2/events?event_type=type_1&event_type=type_2');
        });

        it('should not accept eventType option as object', function () {
            function fn() {
                marathon.events.createEventSource({
                    eventType: {
                        a: 1
                    }
                });
            }
            expect(fn).to.throw('"eventType" should be a string or an array');
        });
    });
});
