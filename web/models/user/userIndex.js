var userIndexModule = angular.module("userIndexModule", ["ngRoute", "Aurthorization", "Server"]);

userIndexModule.config(function($routeProvider){

	$routeProvider
	.when("/",{
		controller: "HomeController",
		templateUrl: "/views/user/home.html"
	})
	.when('/accounts', {
		controller: "AccountController",
		templateUrl: "/views/user/accounts.html"
	})
	.when('/money', {
		controller: "MoneyController",
		templateUrl: "/views/user/money.html"
	})
	.otherwise({
		redirectTo:"/"
	});
});

userIndexModule.run(function(Location, Rest, $rootScope){


	if(!Location.isAurthorized(window.location.href)) {
		Location.land();
	} else {
		// put it inside a service .... 
		Rest.getUserInfo(function(responseObj){
			
			if(responseObj.success){
				$rootScope.user = responseObj.response;
				//console.log($rootScope.user);
			} else {
				console.log("error");
			}
		});
	}
});

// writing it inline as it is very thin and will never 
userIndexModule.controller("AuthController",function($scope, Location, Rest, State){
	
	$scope.logout = function(){

		Rest.logout(function(responseObj){
			State.setLoggedOut();
			Location.land();
		});
	}
});

userIndexModule.controller("HomeController",function($scope, $rootScope){
	$scope.username = $rootScope.user.username;
});

userIndexModule.controller("AccountController",function(Rest, Location, $scope, $rootScope){
	$scope.linkedAccounts = $rootScope.user.linked;

	$scope.newUser = {};

	$scope.signup = function(){
		
		Rest.addDependent($scope.newUser.username, $scope.newUser.password, function(responseObj){
			if(responseObj.success){
				if(responseObj.response.success){    // new account created
					Location.reload();
				} else {		// error 
					$scope.errorMessage = responseObj.response.reason; 
				}

			} else {
				$scope.errorMessage = responseObj.reason;
			}

		});
	}	
});

userIndexModule.controller("MoneyController",function(Location, Rest, $scope, $rootScope){
	$scope.account = $rootScope.user;

	$scope.debit = function(){

		$scope.debitErrorMessage = "";

		Rest.debit($scope.debitAmount, function(responseObj){
			// show the response ... creditErrorMessage}

			if(responseObj.success){
				if(responseObj.response.success){
					Location.reload();
				} else {
					$scope.debitErrorMessage = responseObj.response.reason;
				}

			} else {
				$scope.debitErrorMessage = responseObj.reason;
			}

		});
	}

	$scope.credit = function(){

		$scope.creditErrorMessage = "";

		Rest.credit($scope.creditAmount, 0,function(responseObj){
			
			if(responseObj.success){
				if(responseObj.response.success){
					Location.reload();
				} else {
					$scope.creditErrorMessage = responseObj.response.reason;
				}

			} else {
				$scope.creditErrorMessage = responseObj.reason;
			}

		});	
	}
});