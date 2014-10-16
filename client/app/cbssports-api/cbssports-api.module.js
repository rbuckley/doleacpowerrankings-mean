(function() {
'use strict';

angular.module('CBSSportsAPI', ['ngResource', 'ui.route']);

angular.module('CBSSportsAPI').config(['$httpProvider', '$resourceProvider', cbsSportsAPIConfig]);

function cbsSportsAPIConfig($httpProvider, $resourceProvider) {
   $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
   $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin';
   $httpProvider.defaults.headers.common['Content-Type'] = 'application/application-json';
   $httpProvider.defaults.useXDomain = true;
   delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
})();
