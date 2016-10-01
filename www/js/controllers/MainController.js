export default class MainController {

    constructor($scope, $stateParams) {

        $scope.createNew = ()=> {
            console.log(1234);
        }
    }


}

MainController.$inject = ['$scope', '$stateParams'];