export default class MainController {
    constructor($scope, $state, sdk) {
        /*
        $scope.$watch(function () {
            if (sdk.isUnlocked() && $state.current.name != 'navBar.transactions') {
                console.log('routing to tx');
                $state.go('navBar.transactions');
            }
        });
	*/

        $scope.isPasswordSet = () => {
            return sdk.initiated();
        };

        $scope.password = {};
        $scope.enterPassword = () => {
            if ($scope.password.password && sdk.unlock($scope.password.password)) {
                $state.go('navBar.transactions');
            }
        };

        $scope.createNew = (email) => {
            if (email) {
                console.log('create new account with email: ' + email);
                $state.go('initStorage', {email: email});
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
