(function() {
'use strict';

angular.module('DoleacPowerRankings', 
   ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'powerRankings', 'home', 'CBSSportsAPI']);

angular.module('DoleacPowerRankings').config(DoleacConfig);

angular.module('DoleacPowerRankings').run(['$rootScope', 'cbsAPI', DoleacRun]);

function DoleacConfig($stateProvider, $urlRouterProvider) {
   /* Add New States Above */
   $urlRouterProvider.otherwise('/');
}

function DoleacRun($rootScope, cbsAPI) {

   cbsAPI.getLeagueInfo();
   $rootScope.safeApply = function(fn) {
      var phase = $rootScope.$$phase;
      if (phase === '$apply' || phase === '$digest') {
         if (fn && (typeof(fn) === 'function')) {
            fn();
         }
      } else {
         this.$apply(fn);
      }
   };
}

})();
