'use strict';

angular.module('poddDashboardApp')

.controller('SummaryPersonModeCtrl', function (shared, Menu) {
    shared.summaryPersonMode = true;
    Menu.setActiveMenu('summary');
})

.controller('SummaryPersonCtrl', function ($scope, SummaryPerson, User, streaming, FailRequest, shared, $location, $state) {
    
    console.log('init summary ctrl');

    $scope.weekSearch = '';
    $scope.gridOptions = {
        enableSorting: true,
        data: [], 
        columnDefs: [],
    };

    $scope.$on('summary:clearQuery', function (willClear) {
        if (willClear) {
            $scope.query = '';
            $scope.willShowResult = false;
            $scope.loading = false;
            $scope.error = false;
            $scope.results = [];
            $scope.gridOptions = {};
            $scope.totalPerson = 0;
        }
    });


    $scope.$watch('query', function (newValue) {
        shared.summaryQuery = newValue;
    });

    $scope.search = function () {
        console.log('Will search with query', $scope.query);
        $state.go('main.summary-person', { dates: $scope.query }, { type: 'week' });

        if ($scope.loading) {
            return;
        }

        $scope.results = [];
        $scope.positiveReport = 0;
        $scope.negativeReport = 0;
        $scope.totalPerson = 0;
        $scope.loading = true;
        $scope.error = false;
        $scope.willShowResult = true;
        $scope.gridOptions = {
            enableSorting: true,
            data: [], 
            columnDefs: [],
        };
        shared.summaryReports = {};

        SummaryPerson.query({ dates: $scope.query, type: 'week', offset: ((new Date()).getTimezoneOffset() * -1 / 60) }).$promise.then(function (data) {
            console.log('Query result:', data);
            
            var results = [];
            var options = [];
            var positive = 0;
            var negative = 0;
            var total = 0;
            var header = false;
            data.forEach(function (item) {
                results.push(item);
                total += 1;
            });

            $scope.results = results;
            $scope.loading = false;

            if (results.length === 0) {
                $scope.empty = true;
            }
            else {
                $scope.empty = false;
                $scope.willShowResult = false;
                $scope.positiveReport = positive;
                $scope.negativeReport = negative;
                $scope.totalPerson = total;
            }
            $scope.weekSearch = $scope.query;
            $scope.gridOptions.enableSorting = true;
            $scope.gridOptions.columnDefs = [
                { field: 'parentAdministrationArea', },
                { field: 'administrationArea', },
                { field: 'username', },
                { field: 'fullname', },
                { field: 'contract', },
                { field: 'telephone', },
                { field: 'projectMobileNumber', },
                { field: 'totalReport', },
            ];
            $scope.gridOptions.data = results; 

        }).catch(function () {
            $scope.loading = false;
            $scope.error = true;
        });
    };

    $scope.$evalAsync(function () {
        $('[data-weekpicker]').weekpicker();
    });
    
    $scope.closeSummaryPerson = function () {
        shared.summaryPersonMode = false;
    };

    $scope.gotoMainPage = function () {
        $location.url('/');
    };
});