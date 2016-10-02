export default class MainController {
    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (sdk.isUnlocked() && $state.current.name != 'navBar.topUp') {
                $state.go('navBar.topUp');
            }
        });


        $scope.isPasswordSet = () => {
            return sdk.initiated();
        };

        $scope.password = {};
        $scope.enterPassword = () => {
            if ($scope.password.password && sdk.unlock($scope.password.password)) {
                $state.go('navBar.topUp');
            }
        };

        $scope.createNew = (email) => {
            if (email) {
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

MainController.$inject = ['$scope', '$state', 'sdk'];