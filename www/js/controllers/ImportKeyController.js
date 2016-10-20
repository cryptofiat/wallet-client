export default class ImportKeyController {

    constructor($scope, $state, sdk, $timeout) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });
        $scope.changePwd = () => {
                $scope.wrongpwd = 0;
        }
	$scope.key = {};
        $scope.importKey = () => {
            console.log("Import key.", $scope.key);
            if ($scope.key.password && sdk.unlock($scope.key.password)) {
                $scope.newaddr = '0x'+(sdk.pubToAddress(sdk.storeNewKey($scope.key.privKey))).toString('hex');
                $timeout(() => { $state.go('navBar.transactions') },1000);
            } else {
                $scope.wrongpwd = "true";
            }
        }

    }

}

ImportKeyController.$inject = ['$scope', '$state', 'sdk','$timeout'];
