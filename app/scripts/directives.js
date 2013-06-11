'use strict';
angular.module('node4jsHttpApp').directive('applicationDetails', ['appName', 'version',
function(appName, version) {
    return function(scope, elm, attrs) {
        elm.text(appName + ' v.' + version);
    };
}]).directive('highlightTag', ['tag',
function(tag) {
    return function(scope, elm, attrs) {
        elm.text(tag);
    };
}]).directive('myAccordionItem', function() {
    return {
        transclude: true,
        replace: true,
        scope: {
            heading: '=',
            index:'='
        },
        restrict: 'E',
        templateUrl: 'template/accordion/myAccordionItem.html',
        link : function(scope, elm, attrs) {
            if (scope.index%2===0){
                scope.className='even-row';
            }else 
            scope.className='odd-row';
        }
    };
}).directive('surveyQuestion', function(){
   return{
       transclude: false,
       replace: true,
       scope: {
           model: '=',
           index: '='
       },
       restrict: 'A',
       template: '<div class="text-center"><h4 class="text-left">{{index+1}}. {{model.title}}</h4>' +
                       '<textarea style="resize: none; width:80%" rows="3" cols="100" ng-show="isText"></textarea>'+
                       '<div ng-show="!isText">' +
                       '<label ng-repeat="opt in options"  class="radio inline" name="optionRadios">' +
                            '<input type="radio" name="optionRadios" value="{{opt}}"> {{opt}}'+
                       '</label>'+
                       '</div>'+
                '</div>'
       ,
       link: function (scope,elm,attrs){
           var p=10;
           console.log(scope.model);
           switch(scope.model.type){
               case 'text':
               case 'default':
                    scope.isText = true;
               break;
               case 'mcq':
                    scope.isText = false;
                    scope.options = (scope.model.options+"").split("|");
                    console.log(scope.options);
               break;
           }
           
           
       }
   }; 
});
