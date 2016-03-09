describe('marathon', function() {

    var Marathon = require('../lib/marathon.js');
    var nock = require('nock');
    var MARATHON_HOST = 'http://01.02.03.04:5678';
    var expect = require('chai').expect;

    var marathon;

    beforeEach(function(){
        marathon = new Marathon(MARATHON_HOST);
    });

    describe('ping', function() {

        it('should make ping', function (done) {
            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .reply(200, 'pong');

            marathon.misc.ping().then(onSuccess).done();

            function onSuccess(data) {
                expect(data).to.equal('pong');
                expect(scope.isDone()).to.equal(true);
                done();
            }
        });

        it('should make ping with timeout & rely pong', function (done) {
            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .delayConnection(1000)
                .reply(200, 'pong');

            marathon.misc.ping({timeout: 2000}).then(onSuccess).done();

            function onSuccess(data) {
                expect(data).to.equal('pong');
                expect(scope.isDone()).to.equal(true);
                done();
            }
        });

        it('should report ETIMEDOUT on timeout', function (done) {

            this.timeout(4000);  // set mocha timeout longer then the testing timeout

            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .delayConnection(3000)
                .reply(200, 'pong');

            marathon.misc.ping({timeout: 2000}).catch(onError).done();

            function onError(err) {
                expect(err.message).to.equal('Marathon response was: Error: ETIMEDOUT');
                expect(scope.isDone()).to.equal(true);
                done();
            }
        });

        it('should make ping with timeout', function (done) {
            var scope = nock(MARATHON_HOST)
                .get('/ping')
                .reply(400, 'no-response');

            marathon.misc.ping({timeout: 2000}).catch(onError).done();

            function onError(err) {
                expect(scope.isDone()).to.equal(true);
                expect(err.name).to.equal('StatusCodeError');
                expect(err.message).to.equal('Marathon response was: 400 - no-response');
                expect(err.statusCode).to.equal(400);
                expect(err.options.url).to.equal('http://01.02.03.04:5678/ping');
                expect(err.options.timeout).to.equal(2000);
                done();
            }
        });

    });



});
