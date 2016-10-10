export default class TransactionsController {

    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });
        $scope.idCode = sdk.getEstonianIdCode();
        sdk.balanceTotalAsync().then( (amount) => { $scope.totalBalance = amount; })
        $scope.addresses = sdk.addresses()

        $scope.storeId = () => {
            console.log("id storing " + sdk.storeEstonianIdCode("343"));
            $scope.$apply();
        }

    }

}

TransactionsController.$inject = ['$scope', '$state', 'sdk'];
