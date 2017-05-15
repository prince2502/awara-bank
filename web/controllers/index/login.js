angular.module("indexModule").controller("LoginController", [ '$scope' , "Location", "Rest" , "State" , 

	function($scope, Location, Rest, State ){
			
		$scope.login = function(){

			$scope.errorMessage = "";

			Rest.login($scope.username, $scope.password, function(responseObj){
				if(responseObj.success) {
					if(responseObj.response.success){   // login successful
						console.log(responseObj);
						console.log(responseObj.response.token);
						State.setLoggedIn(responseObj.response.token);
						Location.land();
					} else {			// login failed
						$scope.errorMessage = responseObj.response.reason;
					}
				} else {				// some error
					$scope.errorMessage = responseObj.reason;
				}
			});
		};
	}
]);