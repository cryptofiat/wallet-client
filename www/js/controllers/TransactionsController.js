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
            this.$scope.transfers = tx;
            this.$scope.refreshing = false;
            this.$scope.$apply();
        })
    }

    getFormattedDate(tx) {
        return moment(tx.timestamp).fromNow();
    }

}

TransactionsController.$inject = ['$scope', '$state', 'sdk'];
