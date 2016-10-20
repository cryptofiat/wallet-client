export default class AboutController {

    constructor($scope, $state, sdk) {
      /*
        $scope.$watch(function () {
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
            }
        });
     */
    }

}

AboutController.$inject = ['$scope', '$state', 'sdk'];
