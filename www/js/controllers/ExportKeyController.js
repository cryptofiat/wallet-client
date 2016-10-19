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

    }

}

ExportKeyController.$inject = ['$scope', '$state', 'sdk'];
