
export default class CreateVerifyController {
    constructor($scope, $state, sdk) {
        $scope.recoveryPhrase =
            'six cause school board office tattoo ' +
            'mammal pulp inside cloud nurse ' +
            'absorb aspect elephant tornado';

        $scope.tab = 'CREATE_PASSWORD';
        $scope.password = {};
        $scope.setPassword = () => {
            console.log('password: ' , $scope.password.enter);
            console.log('confirm : ' , $scope.password.confirm);

            if($scope.password.enter && $scope.password.enter == $scope.password.confirm) {
                sdk.initLocalStorage($scope.password.enter);
                $scope.publicAddress = sdk.storeNewKey();
                $scope.tab = 'ACCOUNT_CREATED';
            }
        };

        $scope.confirmDetails = () => {
            console.log('details confirmed');
            $scope.tab = 'VERIFY'
        };

        $scope.mobileId = {};
        $scope.idNumber = null;
        $scope.verifyMobileId = () => {
            if($scope.mobileId.phoneNumber){
                console.log('phoneNumber: ' + $scope.mobileId.phoneNumber);
                $scope.idNumber = sdk.approveWithEstonianMobileId($scope.publicAddress, $scope.mobileId.phoneNumber,
                    (data) => console.log('mobileIdChallengeCode', data.mobileIdChallengeCode)
                ).then(()=>{
                    console.log("approve estonia mobile id had a response");
                    $scope.tab = 'USE';
                })

            } else {
                console.log('no phone number given...');
            }
        };

        $scope.verifyBank = () => {
            console.log('verify by bank transfer');
            sdk.approveWithEstonianBankTransfer($scope.publicAddress);
            $scope.tab = 'USE';
        };

        $scope.finish = () => {
            console.log('finish');
            $state.go('main');
            $scope.tab = 'CREATE_PASSWORD';
        };
    }
}

CreateVerifyController.$inject = ['$scope', '$state', 'sdk'];