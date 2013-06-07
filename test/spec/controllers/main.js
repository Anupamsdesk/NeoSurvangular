'use strict';

describe('Controller: MainCtrl', function() {

    var ctrl, DataService, scope, mockDataService, $controllerConstructor, q, surveyData, surveyDataWithErrors, Models,
    dataSet1;
    
    dataSet1= [{
                id : 's4',
                title : 'Survey 1',
                closedDate : '2012/01/01',
                openDate : '2011/12/01'
            },{
                id : 's2',
                title : 'Survey 2',
                closedDate : '2012/01/01',
                openDate : '2011/12/01'
            },
            {
                id : 's1',
                title : 'Survey 3',
                closedDate : '2012/01/01',
                openDate : '2011/12/01'
            }];
    
    surveyDataWithErrors = {
        errors : [{
            status : '404',
            code : 404,
            message : 'Not Found'
        }]
    };
    surveyData = {
        errors : [],
        results : [{
            data :dataSet1
        }]
    };

    //console.log(surveyData.results[0].data[0]);
    Models = {
        Survey : function(data) {
            //console.log('Models Survey Called!');
            var obj = surveyData.results[0].data[0];
            return {
                id : obj.id,
                title : obj.title,
                closeDate : obj.closedDate,
                openDate : obj.openDate
            };

        }
    }
    
    // load the controller's module
    beforeEach(module('node4jsHttpApp'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $q) {
        scope = $rootScope.$new();
        q = $q;
        var deferred = q.defer();
        mockDataService = {};
        mockDataService.getAllSurveys = sinon.stub();
        mockDataService.getAllSurveys.returns(deferred.promise);

        DataService = mockDataService;
        ctrl = $controller(MainCtrl, {
            $scope : scope,
            DataService : mockDataService,
            Models : Models
        });
        //deferred.resolve(surveyDataWithErrors);
        deferred.resolve(surveyData);
        scope.$apply();

    }));

    it('controller should be defined', function() {
        expect(ctrl).toBeDefined();
    });
    it('should set the DataService object as a mockDataServiceObject', function() {
        expect(DataService).toBe(mockDataService);
    });
    it('should have sort() defined', function() {
        expect(scope.sort).toBeDefined();
    });
    it('should have runQuery() defined', function() {
        expect(scope.runQuery).toBeDefined();
    });
    
    it('should have surveys equal to the mocked object', function() {
        var i=0;
        expect(scope.surveys).not.toBeNull();
        expect(scope.surveys).toBeDefined();
        for(i=0; i<dataSet1; i+=1){
            expect(scope.surveys[i].id).toEqual(dataSet1[i].id)
            expect(scope.surveys[i].title).toEqual(dataSet1[i].title)
            expect(scope.surveys[i].closeDate).toEqual(dataSet1[i].closedDate)
            expect(scope.surveys[i].openDate).toEqual(dataSet1[i].openDate)
        }
    });

});
