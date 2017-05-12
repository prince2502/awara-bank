angular.module("Aurthorization").factory("State", ["$localStorage", 

	function($localStorage){

		var service = {};

		service.setLoggedIn = function(){
			$localStorage.isActive = true;	
		}

		service.setLoggedOut = function(){
			$localStorage.isActive = false;
		}

		return service;
	}

]);