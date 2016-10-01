import * as wallet from 'cryptofiat-wallet';

export default class CreateVerifyController {
    constructor($scope, $state) {
        let sdk =  new wallet.Application();
        sdk.attachStorage(window.localStorage);

        $scope.publicAddress = '0x'+sdk.storeNewKey().toString('hex');
        $scope.recoveryPhrase =
            'six cause school board office tattoo ' +
            'mammal pulp inside cloud nurse ' +
            'absorb aspect elephant tornado';
        console.log($state.params.email);

        $scope.tab = 'CREATE';
        $scope.password = {};
        $scope.setPassword = () => {
            console.log('password: ' , $scope.password.enter);
            console.log('confirm : ' , $scope.password.confirm);

            if($scope.password.enter == $scope.password.confirm) {
                sdk.initLocalStorage($scope.password.enter);
                $scope.tab = 'VERIFY';
            }
        };

        $scope.mobileId = { phoneNumber: null };
        $scope.idNumber = null;
        $scope.verifyMobileId = () => {
            if($scope.mobileId.phoneNumber){
                console.log('phoneNumber: ' + $scope.mobileId.phoneNumber);
                $scope.idNumber = sdk.approveWithEstonianMobileId($scope.publicAddress, $scope.mobileId.phoneNumber,
                    () =>  { console.log("approve estonia mobile id had a response"); }
                );
                $scope.tab = 'USE';
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
            $state.go('navBar.topUp');
        };
    }

}

CreateVerifyController.$inject = ['$scope', '$state'];