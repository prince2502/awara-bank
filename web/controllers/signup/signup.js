angular.module('signUpForm').controller("SingupController", [ '$scope', "Location", "Rest", 
	function($scope, Location, Rest){
			
		$scope.signup = function(){

			$scope.errorMessage = "";

			Rest.signUp($scope.username, $scope.password, function(responseObj){
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