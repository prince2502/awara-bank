angular.module("Aurthorization").factory("State", ["$localStorage", 

	function($localStorage){

		var service = {};

		service.setLoggedIn = function(token){
			$localStorage.isActive = true;
			console.log(token);
			$localStorage.token = token;	
		}

		service.setLoggedOut = function(){
			$localStorage.isActive = false;
			delete $localStorage.token;
		}

		return service;
	}
]);