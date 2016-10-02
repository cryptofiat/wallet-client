export default class TransactionsController {

    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });
    }
}

TransactionsController.$inject = ['$scope', '$state', 'sdk'];