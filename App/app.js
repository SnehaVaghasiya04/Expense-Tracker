let app = angular.module("myApp", []);

let chart;

app.controller("expCtrl", function($scope, $http) {

    // USERNAME
    $scope.username = localStorage.getItem("username");

    $scope.expenses = [];
    $scope.editMode = false;

    // SUMMARY VALUES
    $scope.totalIncome = 0;
    $scope.totalExpense = 0;
    $scope.balance = 0;

    // LOAD DATA
    $scope.load = function() {
        $http.get("/api/expenses").then(function(res) {
            $scope.expenses = res.data;

            // calculate totals
            calculate($scope.expenses);

            // chart update
            setTimeout(() => {
                loadChart($scope.expenses);
            }, 100);
        });
    };

    $scope.load();

    // ADD
    $scope.addExpense = function(data) {
        $http.post("/api/addExpense", data).then(function(res) {
            $scope.msg = res.data.msg;
            $scope.load();
            $scope.newExp = {};
        });
    };

    // DELETE
    $scope.deleteExpense = function(id) {
        $http.delete("/api/deleteExpense/" + id).then(function(res) {
            $scope.msg = res.data.msg;
            $scope.load();
        });
    };

    // EDIT
    $scope.editExpense = function(e) {
        $scope.newExp = angular.copy(e);
        $scope.editMode = true;
    };

    // UPDATE
    $scope.updateExpense = function(data) {
        $http.put("/api/updateExpense/" + data.id, data).then(function(res) {
            $scope.msg = res.data.msg;
            $scope.load();
            $scope.newExp = {};
            $scope.editMode = false;
        });
    };

    // LOGOUT
    $scope.logout = function() {
        localStorage.removeItem("username");
        window.location.href = "login.html";
    };

});

// CALCULATE FUNCTION
function calculate(data) {
    let income = 0, expense = 0;

    data.forEach(e => {
        if(e.type === "Income") income += Number(e.amount);
        else expense += Number(e.amount);
    });

    angular.element(document.body).scope().totalIncome = income;
    angular.element(document.body).scope().totalExpense = expense;
    angular.element(document.body).scope().balance = income - expense;

    angular.element(document.body).scope().$applyAsync();
}

// CHART FUNCTION
function loadChart(data) {

    let map = {};

    data.forEach(e => {
        if(e.type === "Expense"){
            map[e.category] = (map[e.category] || 0) + Number(e.amount);
        }
    });

    let labels = Object.keys(map);
    let values = Object.values(map);

    let ctx = document.getElementById("myChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}