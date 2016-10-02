export default class TransactionsController {

    constructor($scope, $stateParams, sdk) {
        console.log("Marat was here!#@$@");
        sdk.balanceTotalAsync().then( (amount) => { $scope.totalBalance = amount; })
    }
}

TransactionsController.$inject = ['$scope', '$stateParams', 'sdk'];
