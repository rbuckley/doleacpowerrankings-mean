(function() {
'use strict';

angular.module('powerRankings').controller('PowerRankingsCtrl', PowerRankingsCtrl);

PowerRankingsCtrl.$inject= ['$filter', '$location', '$window', '$q', 'cbsAPI', 'powerRankingData'];

function shuffle(array) {
   var currentIndex = array.length, temporaryValue, randomIndex ;

   while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
   }
   return array;
}

function PowerRankingsCtrl($filter, $location, $window, $q, cbsAPI, powerRankingData) {
   var vm = this;

   vm.period = 0;
   vm.isLoading = true;
   vm.order = order;
   vm.owners = {};
   vm.sortableOptions = {};
   vm.submitRankings = submitRankings;
   vm.sortableOptions.containment = '#sortable-owners';

   cbsAPI.getPowerRankInfo().then(function(data) {
      getRankings().then(function(result) {
         $location.path('/powerrankingsresults');
      }, function(reason) {
         vm.owners = shuffle(data.owners);
         vm.period = data.currentPeriod;
         vm.isLoading = false;
      });
   });

   function order(predicate, reverse) {
      var orderBy = $filter('orderBy');
      vm.owners = orderBy(vm.owners, predicate, reverse);
   }

   /* this will eventually be another service provided by a factory*/
   function submitRankings() {
      var ranking = [];
      var rankingModel = {};
      angular.forEach(vm.owners, function(value, key) {
         ranking.push(value.id);
      });
      rankingModel.rank = ranking;
      rankingModel.user_id = cbsAPI.getUserId();
      rankingModel.league_id = cbsAPI.getLeagueId();
      rankingModel.currentPer = vm.period;
      powerRankingData.submitRankings(rankingModel);            
   }

   function getRankings() {
      var deferred = $q.defer();
      powerRankingData.getRankings(
         {
            league_id: cbsAPI.getLeagueId(),
            user_id: cbsAPI.getUserId(),
            period: vm.owners.currentPeriod
         } 
      ).then(function(data) {
         deferred.resolve(data);
      }, function(reason) {
         deferred.reject(reason);
      });
      return deferred.promise;
   }
}
})();
