export default class MenuController {

    constructor($scope, $state) {
        $scope.importKey = () => {
            //$state.go('eee');
        };
    }
}

MenuController.$inject = ['$scope', '$stateParams'];