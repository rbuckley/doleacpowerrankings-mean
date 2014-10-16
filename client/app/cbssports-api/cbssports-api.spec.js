describe('cbsAPI', function() {

   beforeEach(module('CBSSportsAPI'));

   var cbsAPI;
   var $resource;
   var $location;
   var $log;
   var $q;

   beforeEach(inject(function(_cbsAPI_, _$resource_, _$location_, _$log_, _$q_) {
      cbsAPI = _cbsAPI_;
      $resource = _$resource_;
      $location = _$location_;
      $log = _$log_;
      $q = _$q_;
   }));

   describe('when invoked', function() {
      beforeEach(function() {
         cbsAPI.test();
      });

      it('return "hello api"', function() {
         expect(cbsAPI.test.callCount).to.equal(1);
      });

   });
});
