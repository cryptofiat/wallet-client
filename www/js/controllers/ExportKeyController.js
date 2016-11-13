	export default class ExportKeyController {

	    constructor($scope, $state, sdk) {
		$scope.$watch(function () {
		    if (!sdk.isUnlocked() && $state.current.name != 'main') {
			$state.go('main');
		    }
		});
		sdk.contractDataAsync().then( (response) => {
		  $scope.addresses = response;
		  $scope.$apply();
		})

        $scope.showKeyForAddress = () => {
        }

        $scope.verify = (privKey) => {
          $state.go('createVerifyUse', {privKey:privKey});
        }

    }

}

ExportKeyController.$inject = ['$scope', '$state', 'sdk'];
