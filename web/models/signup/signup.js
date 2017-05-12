var signUpForm = angular.module('signUpForm', ["ngRoute", "Aurthorization", "Server"]);

signUpForm.config(function($routeProvider){

	$routeProvider
	.when("/",{
			controller: "SingupController",
			templateUrl: "/views/signup/sign-up-form.html"
	})
	.otherwise({
		redirectTo:"/"
	});
});

signUpForm.run(function(Location){
	if(!Location.isAurthorized(window.location.href)) Location.land();  // test this theory
});