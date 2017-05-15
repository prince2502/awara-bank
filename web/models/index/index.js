var indexModule = angular.module("indexModule", ["ngRoute", "Aurthorization", "Server"]);

indexModule.config(function($routeProvider, $httpProvider){

	$routeProvider
	.when("/",{
		templateUrl: "/views/index/home.html"
	})
	.when('/login', {
		controller: "LoginController",
		templateUrl: "/views/index/login.html"
	})
	.otherwise({
		redirectTo:"/"
	});
			
});

indexModule.run(function(Location){
	if(!Location.isAurthorized(window.location.href)) Location.land();  // test this theory
});