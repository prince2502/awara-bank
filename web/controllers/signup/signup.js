angular.module('signUpForm').controller("SingupController", [ '$scope', "Location", "Rest", 
	function($scope, Location, Rest){
			
		$scope.newUser = {};

		$scope.signup = function(){

			$scope.errorMessage = "";

			Rest.signUp($scope.newUser.username, $scope.newUser.password, function(responseObj){
				if(responseObj.success){
					if(responseObj.response.success){    // new account created
						Location.land();
					} else {		// error 
						$scope.errorMessage = responseObj.response.reason; 
					}

				} else {
					$scope.errorMessage = responseObj.reason;
				}
			});	
		}
	}
]);