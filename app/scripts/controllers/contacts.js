'use strict';

angular.module('node4jsHttpApp')
  .controller('ContactsCtrl', ['$scope','Models', function ($scope, Models) {
    $scope.contacts = Models.Contact.getAll();
    
  }]);