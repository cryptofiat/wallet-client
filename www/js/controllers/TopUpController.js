export default class TopUpController {

    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });
    }
}

TopUpController.$inject = ['$scope', '$state', 'sdk'];