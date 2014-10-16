// load in the power rankings project

require('angular-mocks');
var chai = require('chai');
chai.use('chai-as-promised');
chai.use('sinon-chai');

var sinon = require('sinon');

beforeEach(function() {
   this.sinon = sinon.sandbox.create();
});

afterEach(function() {
   this.sinon.restore();
});

module.exports = {
   rootUrl: 'http://localhost:9000/',
   expect: chai.expect
}
