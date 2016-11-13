export default class SendController {

    constructor($scope, $state, sdk, $interval) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });

        $scope.fee = "0.01";

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
		  if (response.id) {
                    $scope.txHash = response.id;
                    $scope.txState = "submitted";
		    $scope.pendingCheck = $interval(function() {
			$scope.pendingRefresh = true;
			sdk.transferStatusAsync(response.id).then( txCheck => {
			    if (txCheck.status != "PENDING") {
				$scope.txState = "confirmed";
				$interval.cancel($scope.pendingCheck);
				$scope.pendingCheck = undefined;
			    } else {
			    }
		            console.log("checked tx status: ", txCheck.status)
			    $scope.pendingRefresh = false;
			    $scope.$apply();
			});
		    }, 10000);

                  } else {
                    $scope.err = response.err;
                    $scope.txState = "error";
                  }
                  $scope.$apply();
                 } );
            } else {
                //TODO
                //sdk.sendAsync(toaddr, amount, ref, _data)
            }
        }
        $scope.idCodeCheck = "";
        $scope.idCodeChecker = () => {
          if ($scope.send.eId.length != 11) {$scope.idCodeCheck=""; $scope.$apply(); return}
          $scope.idCodeCheck = "loading" 
          sdk.getAddressForEstonianIdCode($scope.send.eId).then( (addr) => {
            if (addr) {
              $scope.idCodeCheck = "yes" 
	      $scope.$apply();
            } else {
              $scope.idCodeCheck = "no" 
	      $scope.$apply();
            }
          })
        }
    }
}

SendController.$inject = ['$scope', '$state', 'sdk', '$interval'];
