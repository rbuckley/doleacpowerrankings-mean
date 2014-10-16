'use strict';

var _ = require('lodash');
var PowerRanking = require('./power_ranking.model');

// Get list of power_rankings
exports.index = function(req, res) {
  PowerRanking.find(function (err, power_rankings) {
    if(err) { 
       return handleError(res, err); 
    }
    return res.json(200, power_rankings);
  });
};

// Get a single power_ranking
exports.show = function(req, res) {
  PowerRanking.findById(req.params.id, function (err, power_ranking) {
    if(err) { 
       return handleError(res, err); 
    }
    if(!power_ranking){
       return res.send(404); 
    }
    return res.json(power_ranking);
  });
};

// Creates a new power_ranking in the DB.
exports.create = function(req, res) {
  PowerRanking.create(req.body, function(err, power_ranking) {
    if(err) {
       return handleError(res, err); 
    }
    return res.json(201, power_ranking);
  });
};

// Updates an existing power_ranking in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  PowerRanking.findById(req.params.id, function (err, power_ranking) {
    if (err) {
       return handleError(res, err); 
    }
    if(!power_ranking) {
       return res.send(404); 
    }
    var updated = _.merge(power_ranking, req.body);
    updated.save(function (err) {
      if (err) {
         return handleError(res, err); 
      }
      return res.json(200, power_ranking);
    });
  });
};

// Deletes a power_ranking from the DB.
exports.destroy = function(req, res) {
  PowerRanking.findById(req.params.id, function (err, power_ranking) {
    if(err) {
       return handleError(res, err); 
    }
    if(!power_ranking) {
       return res.send(404); 
    }
    power_ranking.remove(function(err) {
      if(err) {
         return handleError(res, err); 
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
