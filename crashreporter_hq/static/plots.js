'use strict';


var app = angular.module('hq-app');

app.controller('ReportPlotsController', function($scope) {
    $scope.hide_aliased = true;
    $scope.released_only = false;
});

app.directive('datechart', function($http) {
        return {
          restrict: 'A',
          link: function($scope, $elm, attr) {
                // Create the data table.

                var fail=function(err){ };
                var done = function(resp) {
                    // Instantiate and draw our chart
                    var data = new google.visualization.DataTable();
                    var chart = new google.visualization.ColumnChart($elm[0]);
                    // Set chart options
                    var options = {'title':'Report History',
                                   'width':'100%',
                                   'animation': {'startup': true,
                                                 'duration': 2000,
                                                 'easing': 'out'},
                                   'bar': {'groupWidth': '100%'},
                                   'legend':'none',
                                   'height':'100%'};

                    var dates = [];
                    for (var ii=0; ii < resp.data.length; ii++){
                        // year, month (zero index), day, hour, Y-value
                        dates.push([new Date(resp.data[ii][0], resp.data[ii][1], resp.data[ii][2], resp.data[ii][3]), resp.data[ii][4]])
                    }
                    data.addColumn('date', 'Date of Report');
                    data.addColumn('number', 'Number of Reports');
                    data.addRows(dates);
                    chart.draw(data, options);
                };

                var update = function(value){
                    // Make a request to get the chart data
                    $http.get('/reports/get_stats?type=date&hide_aliased=' + attr.aliased + '&released_only=' + attr.released).then(done, fail);
                    };

                attr.$observe('aliased', update);
                attr.$observe('released', update);

                // Make a request to get the chart data
                // $http.get('/reports/get_stats?type=date').then(done, fail);

          }
    }

});


app.directive('userchart', function($http) {
        return {
          restrict: 'A',
          link: function($scope, $elm, attr) {
                // Create the data table.

                var fail=function(err){ };
                var done = function(resp) {
                    // Instantiate and draw our chart.
                    var data = new google.visualization.DataTable();
                    var chart = new google.visualization.PieChart($elm[0]);
                    // Set chart options
                    var options = {'title':'Report Breakdown',
                                   'width':'100%',
                                   'legend':'none',
                                   'is3D': true,
                                   'chartArea': {'width': '100%',
                                                 'height': '90%',
                                                 'easing': 'out'},
                                   'height':'100%'};

                    data.addColumn('string', 'User');
                    data.addColumn('number', 'Number of Reports');
                    data.addRows(resp.data);
                    chart.draw(data, options);
                    };
                //
                // attr.$observe('aliased', function(value){
                //     // Make a request to get the chart data
                //     $http.get('/reports/get_stats?type=user&hide_aliased=' + value).then(done, fail);
                //
                //     });
                var update = function(value){
                    // Make a request to get the chart data
                    $http.get('/reports/get_stats?type=user&hide_aliased=' + attr.aliased + '&released_only=' + attr.released).then(done, fail);
                    };

                attr.$observe('aliased', update);
                attr.$observe('released', update);

                // Make a request to get the chart data
                // $http.get('/reports/get_stats?type=user&show_aliased=False').then(done, fail);


              
                    }
            }
});


app.directive('statisticchart', function($http) {
        return {
                  restrict: 'A',
                  link: function($scope, elm, attr) {
                        // Create the data table.
                        var fail=function(err){ };
                        console.log(attr);
                        var done = function(resp) {
                            var data = new google.visualization.DataTable();
                            data.addColumn('string', 'Statistic');
                            for (var i=0; i < resp.data['uuids'].length; i++) {
                                data.addColumn('number', resp.data['uuids'][i]);
                            }
                            data.addRows(resp.data['counts']);
                            // Set chart options
                            var options = {'title':'Anonymous Statistics (Submissions from ' + resp.data['n_users'] + ' Users)',
                                           'isStacked':true,
                                           'width':'100%',
                                           'legend': 'none',
                                           'height':'%100'};
                            // Instantiate and draw our chart, passing in some options.
                            var chart = new google.visualization.ColumnChart(elm[0]);
                            chart.draw(data, options);
                            };

                        // Make a request to get the chart data

                        var update = function(value){
                            // Make a request to get the chart data
                            var alias = (attr.showaliases=='') ? "0": attr.showaliases;
                            $http.get('/usage/plots/get_data?type=statistic&id=' + attr.plotid + '&hide_aliases=' + alias ).then(done, fail);
                            };

                        attr.$observe('plotid', update);
                        attr.$observe('showaliases', update);

                            }
            }
});

app.directive('statechart', function($http) {
        return {
          restrict: 'A',
          link: function(scope, elm, attr) {

                    var fail=function(err){
                        console.log(err)
                    };
                    var done = function(resp) {
                        if (resp.data.counts.length > 0) {

                            // Create the data table.
                            var data = new google.visualization.DataTable();
                            data.addColumn('string', 'State');
                            data.addColumn('number', 'Count');
                            data.addRows(resp.data.counts);
                            // Set chart options
                            var options = {
                                'title': resp.data.name,
                                'width': '100%',
                                'legend': 'none',
                                'height': '100%'
                            };
                            // Instantiate and draw our chart, passing in some options.
                            var chart = new google.visualization.ColumnChart(elm[0]);
                            chart.draw(data, options);
                            };
                        };

                    var update = function(value){
                        // Make a request to get the chart data
                        var alias = (attr.showaliases=='') ? "0": attr.showaliases;
                        $http.get('/usage/plots/get_data?type=state&name=' + attr.state + '&hide_aliases=' + alias).then(done, fail);
                        };
              
                    attr.$observe('state', update);
                    attr.$observe('showaliases', update);

                    }
            }
});

google.load('visualization', '1', {packages: ['corechart']});