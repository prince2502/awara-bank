angular.module("Server").factory("Rest", ['$http', 
	function($http){

		var domain = "http://localhost:8081/api";

		var service = {};

		var post = function(url, data, callback){
			$http.post(url, data)
			.success(function(res){
				callback({
					success: true,
					response: res
				});
			})
			.error(function(err){
				callback({
					success: false,
					reason: "Server Error"
				});	
			});
		}

		var get = function(url, callback){
			$http.get(url)
			.success(function(res){
				callback({
					success: true,
					response: res
				});
			})
			.error(function(err){
				callback({
					success: false,
					reason: "Server Error"
				});	
			});
		}

		service.login = function(username, password, callback){
			post(domain + '/login/', {username: username, password: password}, callback);
		}

		service.logout = function(callback){
			post(domain + '/logout/', {}, callback);
		}

		service.signUp = function(username, password, callback){
			post(domain + '/sign-up/', {username: username, password: password}, callback);
		}

		service.getUserInfo = function(callback){
			get(domain + '/user/', callback);
		}

		service.addDependent = function(username, password, callback){
			post(domain + '/user/new', {username: username, password: password}, callback);
		}

		service.debit = function(amount, callback){
			post(domain + '/debit/', {amount: amount}, callback);
		}

		service.credit = function(amount, accoutId, callback){
			post(domain + '/login/' + accoutId, {amount: amount}, callback);
		}

		return service;
	}
]);