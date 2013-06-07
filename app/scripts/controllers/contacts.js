'use strict';

angular.module('node4jsHttpApp')
  .controller('ContactsCtrl', ['$scope','DataService', function ($scope, DataService) {
    $scope.contacts = DataService.getAllContacts();
    console.log($scope.contacts);
  }]);