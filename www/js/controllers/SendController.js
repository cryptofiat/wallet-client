export default class SendController {

    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });

        $scope.send = { accountType: 'eId' };
        $scope.sendEuro = () => {
            if ($scope.send.accountType == 'eId') {
                //TODO
                //sdk.sendToEstonianIdCode(idCode, amount, ref)
            } else {
                //TODO
                //sdk.sendAsync(toaddr, amount, ref, _data)
            }
            console.log('send: ', $scope.send);
        }
    }
}

SendController.$inject = ['$scope', '$state', 'sdk'];