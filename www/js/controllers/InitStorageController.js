
export default class InitStorageController {
    constructor($scope, $state, sdk, $ionicHistory) {
        if (sdk.initiated()) {
           $state.go('main');
        }
        $scope.password = {};
        $scope.setPassword = () => {
            console.log('password: ' , $scope.password.enter);
            console.log('confirm : ' , $scope.password.confirm);

            if($scope.password.enter && $scope.password.enter == $scope.password.confirm) {
                sdk.initLocalStorage($scope.password.enter);
                $ionicHistory.nextViewOptions({ disableBack:true });
                $state.go('createVerifyUse');
            }
        };

    }
}

InitStorageController.$inject = ['$scope', '$state', 'sdk','$ionicHistory'];
