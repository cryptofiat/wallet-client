import * as wallet from 'cryptofiat-wallet';

export default class MainController {

    constructor($scope, $state) {
        let sdk =  new wallet.Application();
        sdk.attachStorage(window.localStorage);
        $scope.password = {};

        $scope.isPasswordSet = () => {
            return sdk.initiated();
        };

        $scope.enterPassword = () => {
            if($scope.password.password) {
                sdk.unlock($scope.password.password);
                $state.go('navBar.topUp');
            }
        };

        $scope.createNew = (email) => {
            if(email) {
                console.log('create new account with email: ' + email);
                $state.go('createVerifyUse', {email: email});
            } else {
                console.log('email undefined')
            }
        };

        $scope.import = () => {
            console.log('import');
        };
    }


}

MainController.$inject = ['$scope', '$state'];