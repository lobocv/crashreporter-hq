
var app = angular.module('hq-app', ['ngMaterial', 'ngMessages']);

// Change the templating symbol for angularjs so it doesn't conflict with Jinja
app.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]);

app.controller('GroupController', function($scope, $http) {

    $scope.getReleases = function() {
        $http.get('/applications/releases').success(function (data) {
            $scope.application_releases = data;
        });
    };
    
    $scope.removeRelease = function(id) {
        $http.post('/applications/releases/remove?id=' + id).success(function() {
              $scope.getReleases();
        });
    };

    $scope.addRelease = function(name, version) {
        $http.post('/applications/releases/add?name=' + name + '&version='+ version).success(function() {
              $scope.getReleases();
        });
    };    
    
    
    $scope.getAliases = function() {
        $http.get('/aliases').success(function (data) {
            $scope.aliases = data;
        });
    };
    
    $scope.removeAlias = function(id) {
        $http.post('/aliases/remove?id=' + id).success(function() {
              $scope.getAliases();
        });
    };

    $scope.addAlias = function(uuid, alias) {
        $http.post('/aliases/add?uuid=' + uuid+ '&alias='+ alias).success(function() {
              $scope.getAliases();
        });
    };

    $scope.application_releases = [];
    $scope.aliases = [];
    $scope.getReleases();
    $scope.getAliases();
    $scope.AppReleaseForm = {'name': '.test', 'version': 'drrr'};
    $scope.currentNavItem = 'Group Members';
    
});


app.controller('HQController', function($scope, $http, $mdSidenav) {

    $scope.toggleMenu = function (event) {
      $mdSidenav('leftNav').toggle()
    };

    $scope.onSwipeRight  = $scope.toggleMenu;


});

app.controller('SearchController', function($scope, $http){
    $scope.reports = [];
    $scope.is_searching = false;
    $scope.searchfields = [
                          {field: 'User', value: 'user_identifier'},
                          {field: 'Application Name', value: 'application_name'},
                          {field: 'Application Version', value: 'application_version'},
                          {field: 'After Version', value: 'after_version'},
                          {field: 'Before Version', value: 'before_version'},
                          {field: 'Report Number', value: 'id'},
                          {field: 'Error Message', value: 'error_message'},
                          {field: 'Error Type', value: 'error_type'},
                          {field: 'Date', value: 'date'},
                          {field: 'After Date', value: 'after_date'},
                          {field: 'Before Date', value: 'before_date'}
    ];


    $scope.searchform = {filters: [['', '']],
                         page: 1, reports_per_page : 25
                        };
    
    $scope.addFilter = function() {
        $scope.searchform.filters.push(['', '']);
    };
    

    $scope.removeFilter = function(criteria) {
        $scope.searchform.filters.splice($scope.searchform.filters.indexOf(criteria), 1);
    };


    $scope.submitSearch = function(page) {
        $scope.is_searching = true;
        if (page == undefined) {
            $scope.searchform.page = 1;
        } else {
            $scope.searchform.page = page;
        }

        $http.post('/search', JSON.stringify($scope.searchform)).success(function(data){
            $scope.pagination = {page: data.page,
                                 pages: data.pages,
                                 max_page: data.max_page,
                                 total_reports: data.total_reports};
            $scope.reports = data.reports;
            $scope.is_searching = false;

        }).error(function() {
            $scope.is_searching = false;
        })
    };

    $scope.submitSearch();

});

