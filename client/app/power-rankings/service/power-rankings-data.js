(function() {
'use strict';

angular.module('powerRankings').factory('powerRankingData', powerRankingDataFactory);

powerRankingDataFactory.$inject = [ '$resource', '$q' ];

function powerRankingDataFactory($resource, $q) {

   var mongoLabAPIKey = '3UmxkX7nCOOMUN0_nA8kUp0SOP-oDd_H';
   var mongoLabBaseURI = 'https://api.mongolab.com/api/1/databases/power_rankings/collections/:league_id';
   var  mongoResource = $resource(mongoLabBaseURI, 
         {apiKey: mongoLabAPIKey }
   );

	var powerRankingData = {
      submitRankings:      _submitRankings,
      getRankings:         _getRankings
   };

	return powerRankingData;

   //////////////////// Function Implementation //////////////////

   function _getRankings(data) {
      var deferred = $q.defer();

      mongoResource.query(
         { league_id: data.league_id,
            q: {'user_id': data.user_id, 'period': data.period} 
         },
         { isArray: false }
      ).$promise.then(function(result) {
         if (result.length) {
            deferred.resolve(result);
         } else {
            deferred.reject('nothing found');
         }
      });
      return deferred.promise;
   }

   // Submitting rankings for the week
   // 1. Check if the user has already submitted for the week
   //    a. this could also be done when the user clicks on the power ranking link
   //    b. requires the current perdiod, user id and league id
   function _submitRankings(rankings) {
      console.log(rankings);
      return mongoResource.save({league_id: rankings.league_id}, rankings);
   }

}
})();
