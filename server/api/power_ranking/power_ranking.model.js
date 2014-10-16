'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Scheme to describe an owner in the power ranking context
 * contains the id of the owner, and an array of owner_ids which represents a ranking submitted by the owner with id
 */
var OwnerSchema = new Schema({
   id: String,
   ranking: [{owner_id: String}]
});

/**
 * Schema that describes one scoring period during the season. Has a number for the period is represents and an array of sub docs which consist of the owners ranks for that period
 */
var PeriodSchema = new Schema({
   period: Number,
   owners: [OwnerSchema]
});

/**
 * The main schema which has a league id and an array of periods
 */
var PowerRankingSchema = new Schema({
   league_id: String,
   periods: [PeriodSchema]
});

module.exports = mongoose.model('PowerRanking', PowerRankingSchema);
