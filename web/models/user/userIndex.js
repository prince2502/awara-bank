var userIndexModule = angular.module("userIndexModule", ["ngRoute", "Aurthorization", "Server"]);

userIndexModule.config(function($routeProvider){

	$routeProvider
	.when("/",{
		controller: "HomeController",
		templateUrl: "/views/user/home.html"
	})
	.when('/accounts', {
		//controller: "SimpleController",
		templateUrl: "/views/user/accounts.html"
	})
	.when('/money', {
		//controller: "SimpleController",
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
		Rest.getUserInfo(function(responseObj){
			
			console.log(responseObj);

			if(responseObj.success){
				$rootScope.user = responseObj.response;
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
			// do we care?
			State.setLoggedOut();
			Location.land();
		});
	}

});

userIndexModule.controller("HomeController",function($scope, $rootScope){
	
	$scope.username = $rootScope.user.username;

});