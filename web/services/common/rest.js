angular.module("Server").factory("Rest", ['$http', '$localStorage', 
	function($http, $localStorage){

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
			post(domain + '/logout/', {token: $localStorage.token}, callback);
		}

		service.signUp = function(username, password, callback){
			post(domain + '/sign-up/', {username: username, password: password}, callback);
		}

		service.getUserInfo = function(callback){
			get(domain + '/user/?token=' + $localStorage.token, callback);
		}

		service.addDependent = function(username, password, callback){
			console.log(username , password);
			post(domain + '/user/new', {username: username, password: password, token: $localStorage.token}, callback);
		}

		service.debit = function(amount, callback){
			post(domain + '/money/debit/', {amount: amount, token: $localStorage.token}, callback);
		}

		service.credit = function(amount, accoutId, callback){
			post(domain + '/money/credit/' + accoutId, {amount: amount, token: $localStorage.token}, callback);
		}

		return service;
	}
]);