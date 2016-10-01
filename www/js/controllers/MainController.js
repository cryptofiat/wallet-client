export default class MainController {

    constructor($scope, $state) {

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