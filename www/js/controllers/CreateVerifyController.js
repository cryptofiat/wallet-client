import * as wallet from 'cryptofiat-wallet';

export default class CreateVerifyController {

    constructor($scope, $stateParams) {
        let privateKey = wallet.generatePrivate();
        let publicKey = wallet.privateToPublic(privateKey);
        let addr = wallet.pubToAddress(publicKey);

        console.log(addr.toString('hex'));
    }
}

CreateVerifyController.$inject = ['$scope', '$stateParams'];