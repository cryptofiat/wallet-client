export default class SendController {

    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });

        $scope.send = { accountType: 'eId' };
        $scope.sendEuro = () => {
            console.log('send: ', $scope.send);
            if ($scope.send.accountType == 'eId') {
                //TODO
                sdk.sendToEstonianIdCode($scope.send.eId, $scope.send.euroAmount, $scope.send.reference)
            } else {
                //TODO
                //sdk.sendAsync(toaddr, amount, ref, _data)
            }
        }
    }
}

SendController.$inject = ['$scope', '$state', 'sdk'];
