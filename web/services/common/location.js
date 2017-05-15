angular.module("Aurthorization").factory("Location", [ '$localStorage', function($localStorage){
	
var service = {};

var domainName = "http://localhost:8080/";

var authPages = [
	domainName + "user/"
];

var authLand = domainName + "user/";
var otherLand = domainName;

// according to the auth var, land at correct page
service.land = function(){

	if($localStorage.isActive){
		window.location = authLand;
	} else {
		window.location = otherLand;
	}
}

service.isAurthorized = function(path){

	if($localStorage.isActive){ // you can only access the auth pages ... bad ?  extend the logic 

		for(var i = 0 ; i < authPages.length ; i = i + 1){
			if(path.indexOf(authPages[i]) != -1){
				return true;
			}
		}

		return false;

	} else {
		
		for(var i = 0 ; i < authPages.length ; i = i + 1){
			if(path.indexOf(authPages[i]) != -1){
				return false;
			}
		}

		return true;
	}
}

// according to the auth var try to access this page, 
// if auth matches the location authentication, go to path otherwise land at corresponding page
service.redirectTo = function (path){
	if(isAurthorized(path)) window.location = path;
	else land();
}

service.reload = function(){
	window.location.reload();
}

return service;

}]);