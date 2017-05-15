angular.module("userIndexModule").controller("ActivityController",['$scope', '$rootScope',

	function($scope, $rootScope){
		$scope.activities = $rootScope.user.activities;
		$scope.actTypes = ['debited', 'credited', 'added new account'];
	}
]);