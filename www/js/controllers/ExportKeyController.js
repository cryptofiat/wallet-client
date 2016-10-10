export default class ExportKeyController {

    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });
        $scope.addresses = sdk.addresses()

        $scope.showKeyForAddress = () => {
        }

    }

}

ExportKeyController.$inject = ['$scope', '$state', 'sdk'];
