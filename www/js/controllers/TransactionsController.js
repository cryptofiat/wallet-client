export default class TransactionsController {

    constructor($scope, $stateParams, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });
        console.log("Marat was here!#@$@");
        sdk.balanceTotalAsync().then( (amount) => { $scope.totalBalance = amount; })
    }
}

TransactionsController.$inject = ['$scope', '$stateParams', 'sdk'];
