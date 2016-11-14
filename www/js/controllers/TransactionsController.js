import moment from 'moment/moment';

export default class TransactionsController {

    constructor($scope, $state, sdk) {
        this.$scope = $scope;
        this.sdk = sdk;

        $scope.$watch(() =>{
            if (!sdk.isUnlocked() && $state.current.name != 'main') {
                $state.go('main');
                return;
            }

            if (sdk.isUnlocked() && !this.$scope.idCode) {
                this.loadData();
            }
        });

        $scope.refreshClick = () => {
            this.loadData()
        };
	//sdk.referenceSendAsync("0x697cbfdcdbdf6d07afe842ca4df370170477c13b3e030844e239a57b55a17c6a","38806080140","38008030265","little return","");
    }

    loadData() {
        console.log("refreshing tx screen");
        this.$scope.refreshing = true;
        this.$scope.idCode = this.sdk.getEstonianIdCode();
        this.sdk.balanceTotalAsync().then((amount) => {
            this.$scope.totalBalance = amount;
            this.$scope.$apply();
        });
        this.$scope.addresses = this.sdk.addresses();

        this.sdk.transfersCleanedAsync().then((tx) => {
            this.$scope.transfers = tx.sort(function(a,b) { return a.timestamp-b.timestamp; } ).reverse();
            this.$scope.refreshing = false;
            this.$scope.$apply();
        })
    }

    getFormattedDate(tx) {
        return moment(tx.timestamp).fromNow();
    }

}

TransactionsController.$inject = ['$scope', '$state', 'sdk'];
