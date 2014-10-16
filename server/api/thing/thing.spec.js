'use strict';
/*jshint expr: true*/
var should = require('chai').should();
var expect = require('chai').expect;

var app = require('../../app');
var request = require('supertest');

describe('GET /api/things', function() {

   it('should respond with JSON array', function(done) {
      request(app)
      .get('/api/things')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
         if (err) return done(err);
         res.body.should.be.instanceof(Array);
         done();
      });
   });

   it('should PASS', function() {
      expect(true).to.be.true;
   });
});
