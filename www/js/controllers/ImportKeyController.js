export default class ImportKeyController {

    constructor($scope, $state, sdk) {
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });
        $scope.importKey = () => {
            console.log("Import key. NOT IMPLEMENTED.");
        }

    }

}

ImportKeyController.$inject = ['$scope', '$state', 'sdk'];
