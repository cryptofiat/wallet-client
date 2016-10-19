export default class MenuController {

    constructor($scope, $state) {
        $scope.importKey = () => {
            //$state.go('eee');
        };
        $scope.transfers = () => {
            $state.go('navBar.transactions');
        };
        $scope.exportKeys = () => {
            $state.go('exportKeys');
        };
    }
}

MenuController.$inject = ['$scope', '$state'];
