var app = angular.module("BusSeats", []);

function getarray(x, y) {
    var arr = [];
    for (var i = 0; i < x; i++) {
        arr.push([]);
    }
    arr.forEach(function (item) {
        for (var i = 0; i < y; i++) {
            item.push(0);
        }
    });
    return arr;
}

function gettextarray(arr) {
    arr = arr || [[]];
    var height = arr.length;
    var width = arr[0].length;
    var i = 0;
    var ret = [];
    for (var y = 0; y < height; y++) {
        ret.push([]);
        for (var x = 0; x < width; x++) {
            ret[y].push("X");
        }
    }
    for (var x = 0; x < width; x++) {
        for (var y = height - 1; y >= 0; y--) {
            if (arr[y][x] >= 0) {
                i++;
                ret[y][x] = i + '';
            }
        }
    }
    return ret;
}

app.directive("busSeats", function () {
    return {
        restrict: 'AE',
        scope: {
            width: '@',
            height: '@',
            max: '@',
            uselinear: '@',
            totalnoofseats: '@'
        },
        templateUrl: 'js/directives/bus-seats.html',
        controller: function ($scope, $transclude) {
            $scope.uselinear = $scope.uselinear || false;
            $scope.getseatarray = getseatarray;
            $scope.gettextarray = gettextarray;
            $scope.seats = [];
            $scope.seattexts = [];
            $scope.selected = 0;
            $scope.selectedseats = [];
            if (!$scope.max) $scope.max = 3;


            $transclude(function (clone, scope) {
                try {
                    $scope.width = $scope.width || 4;
                    $scope.height = $scope.height || 0;
                    var json = clone.html().trim();
                    if ($scope.uselinear == 'true') $scope.seats = $scope.getseatarray($scope.width, $scope.height, JSON.parse(json), $scope.totalnoofseats);
                    else $scope.seats = JSON.parse(json);
                    $scope.seattexts = gettextarray($scope.seats);
                    console.log($scope.seats);
                    console.log($scope.seattexts);
                }
                catch (ex) {
                    console.error("no width and height specified ...");
                    console.error(ex);
                    if (!$scope.width) $scope.width = 5;
                    if (!$scope.height) $scope.height = 5;
                    $scope.seats = getarray($scope.height, $scope.width);
                }
            });
        },
        link: function ($scope, element, attrs) {
            element.attr("selectedseats", "[]");
            $scope.selectseat = function (x, y) {
                if ($scope.selected < $scope.max) {
                    if ($scope.seats[x][y] == 1) {
                        $scope.seats[x][y] = 0;
                        $scope.selected -= 1;
                        $scope.selectedseats = $scope.selectedseats.remove($scope.seattexts[x][y]);
                        //console.log($scope.selectedseats);
                        $(element).attr("selectedseats", JSON.stringify($scope.selectedseats));
                        return;
                    }
                    if ($scope.seats[x][y] == 0) {
                        $scope.seats[x][y] = 1;
                        $scope.selected += 1;
                        $scope.seats[x][y] = 1;
                        $scope.selectedseats.push($scope.seattexts[x][y]);
                        //console.log($scope.selectedseats);
                        $(element).attr("selectedseats", JSON.stringify($scope.selectedseats));
                        return;
                    }
                }
                else {
                    if ($scope.seats[x][y] == 1) {
                        $scope.seats[x][y] = 0;
                        $scope.selected -= 1;
                        $scope.selectedseats.remove($scope.seattexts[x][y]);
                    }
                    else {
                        alert("You have exceeded the number of seats available");
                    }
                }
            }
        },
        transclude: true
    }
});

function getseatarray(width, height, linear, noofseats) {
    width = width || 4;
    var rows = height || 0;
    if (rows == 0) while (rows * width < noofseats) rows++;
    var seats = [];
    for (var i = 0; i < width; i++) {
        seats.push([]);
        for (var j = 0; j < rows; j++) {
            seats.last().push(0);
        }
    }
    var avoid = [];
    avoid.push({ X: 0, Y: width - 1 });
    if (width > 3) {
        if ((rows * width) - avoid.length > noofseats) avoid.push({ X: 0, Y: width - 2 });
        if ((rows * width) - avoid.length > noofseats) avoid.push({ X: 0, Y: 1 });
        if ((rows * width) - avoid.length > noofseats) avoid.push({ X: 1, Y: 0 });
        for (var i = 2; i <= rows - 2; i++) {
            if ((rows * width) - avoid.length > noofseats) avoid.push({ X: i, Y: 1 });
        }
    }
    for (var y = width - 1; y >= 0; y--) {
        for (var x = 0; x < rows; x++) {
            if (avoid.where('X', y).where('Y', x).count() > 0) seats[x][y] = -1;
        }
    }
    var seatcount = 0;
    for (var x = 0; x < rows; x++) {
        for (var y = width - 1; y >= 0; y--) {
            if (seats[y][x] == 0) {
                seatcount++;
                if (linear.indexOf(seatcount) < 0) seats[y][x] = 2;
            }
        }
    }
    console.log(JSON.stringify(seats));
    return seats;
}