(function() {
   'use strict';

   angular.module('CBSSportsAPI').factory('cbsAPI', cbsAPIFactory);

   cbsAPIFactory.$inject = ['$resource', '$location', '$log', '$q'];

   function parseCBSSportsURL(url) {
      var tokens = [];
      var queries = url.split('?');
      if (queries[1]) {
         var tokensList = url.split('?')[1].split('#')[0].split('&');
         for (var i = 0; i < tokensList.length; i++)
         {
            var pair = tokensList[i].split('=');
            tokens[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
         }
      }
      return tokens;
   }

   function cbsAPIFactory($resource, $location, $log, $q) {
      var apiVers = '3.0';
      var basePath = 'http://api.cbssports.com/fantasy/';

      var cbssportsTokens = parseCBSSportsURL($location.absUrl());

      var leagueInfo = {};

      var cbssportsApi = {
         test:             _test,
         getOwners:        _getOwners,
         getLeagueInfo:    _getLeagueInfo,
         getStandings:     _getStandings,
         getPowerRankInfo: _getPowerRankInfo,
         getUserId:        _getUserId,
         getLeagueId:      _getLeagueId,
         getLeagueDates:   _getLeagueDates
      };

      return cbssportsApi;

      //////////////Function Implementations////////////////

      function _test() {
         return 'hello api';
      }

      function _getUserId() {
         return cbssportsTokens.user_id;
      }

      function _getLeagueId() {
         return cbssportsTokens.league_id;
      }

      function _get(url) {
         return $resource(basePath + url, {
               access_token: cbssportsTokens['access_token'],
               response_format: 'JSON',
               callback: 'JSON_CALLBACK'
         }, {
            get: {
               method: 'JSONP'
            }
         });
      }

      function _getLeagueDates() {
         var deferred = $q.defer();
         if (leagueInfo.dates) {
            deferred.resolve(leagueInfo.dates);
         } else {
            _get('league/dates').get().$promise.then(function(data) {
               var dates = data.body.dates;
               leagueInfo.dates = {};
               leagueInfo.dates.currentPeriod = dates.current_period;
               deferred.resolve(leagueInfo.dates);
            });
         }
         return deferred.promise;
      }

      function _getLeagueInfo() {
         var deferred = $q.defer();
         if (leagueInfo.name) {
            deferred.resolve(leagueInfo);
         } else {
            _get('league/details').get().$promise.then(function(data) {
               var details = data.body.league_details;
               leagueInfo.name = details.name;
               leagueInfo.numOfDivisions = details.num_divisions;
               leagueInfo.numOfTeams = details.num_teams;
               leagueInfo.numWeeks = details.regular_season_periods;
               deferred.resolve(leagueInfo);
            });
         }
         return deferred.promise;
      }

      function _getOwners(){
         var deferred = $q.defer();

         _get('league/owners').get().$promise.then(function(data) {
            var leagueOwners = [];
            var i = 0;
            var owners = data.body.owners;
            for (var owner in owners) {
               if (owners.hasOwnProperty(owner)) {
                  leagueOwners[i] = {};
                  leagueOwners[i].name = owners[owner].name;
                  leagueOwners[i].id = owners[owner].id;
                  leagueOwners[i].logo = owners[owner].team.logo;
                  leagueOwners[i].divID = owners[owner].team.division;
                  leagueOwners[i].teamID = owners[owner].team.id;
                  leagueOwners[i++].team = owners[owner].team.name;
               }
            }
            deferred.resolve(leagueOwners);
         });
         return deferred.promise;
      }

      function _getStandings() {
         var deferred = $q.defer();
         _get('league/standings/overall').get().$promise.then(function(data) {
            deferred.resolve(data.body.overall_standings);
         });
         return deferred.promise;
      }

      function _getPowerRankInfo() {
         var deferred = $q.defer();
         var powerRankPromises = [_getOwners(), _getStandings(), _getLeagueDates()];

         $q.all(powerRankPromises).then(function(result) {
            var owners = result[0];
            var standings = result[1];
            var dates = result[2];
            var prData = {};
            prData.owners = [];
            prData.currentPeriod = dates.currentPeriod;
            var divisions = standings.divisions;
            var owner, team;
            var teams = [];
            if (!divisions) {
               for (owner = 0; owner < owners.length; owner++) {
                  teams = standings.teams;
                  for (team = 0; team < teams.length; team++) {
                     if (teams[team].id === owners[owner].teamID) {
                        prData.owners[owner] = {};
                        prData.owners[owner] = owners[owner];
                        prData.owners[owner].wins = teams[team].wins;
                        prData.owners[owner].losses = teams[team].losses;
                        prData.owners[owner].ties = teams[team].ties;
                        prData.owners[owner].pointsScored = teams[team].points_scored;
                        prData.owners[owner].pointsAgainst = teams[team].points_against;
                     }
                  }
               }
            } else {
               for (var div = 0; div < divisions.length; div++) {
                  for (owner = 0; owner < owners.length; owner++) {
                     if (owners[owner].divID === divisions[div].id) {
                        teams = divisions[div].teams;
                        for (team = 0; team < teams.length; team++) {
                           if (teams[team].id === owners[owner].teamID) {
                              prData.owners[owner] = {};
                              prData.owners[owner] = owners[owner];
                              prData.owners[owner].wins = teams[team].wins;
                              prData.owners[owner].losses = teams[team].losses;
                              prData.owners[owner].ties = teams[team].ties;
                              prData.owners[owner].pointsScored = teams[team].points_scored;
                              prData.owners[owner].pointsAgainst = teams[team].points_against;
                           }
                        }
                     }
                  }
               }
            }
            deferred.resolve(prData);
         });
         return deferred.promise;
      }
   }
})();
