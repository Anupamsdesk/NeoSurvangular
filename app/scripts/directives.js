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
});
