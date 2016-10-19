export default class SendController {

    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });

	$scope.txState = "";
        $scope.txHash = "";
        $scope.send = { accountType: 'eId' };
        $scope.sendEuro = () => {
            console.log('send: ', $scope.send);
            if ($scope.send.accountType == 'eId') {
                //TODO
		//make button disabled
                $scope.txState = "submitting";
                $scope.$apply();
                sdk.sendToEstonianIdCode($scope.send.eId, 100 * $scope.send.euroAmount, $scope.send.reference)
                 .then( (response) => {
                  $scope.txHash = response.id;
                  $scope.txState = "submitted";
                  $scope.$apply();
                 } );
            } else {
                //TODO
                //sdk.sendAsync(toaddr, amount, ref, _data)
            }
        }
    }
}

SendController.$inject = ['$scope', '$state', 'sdk'];
