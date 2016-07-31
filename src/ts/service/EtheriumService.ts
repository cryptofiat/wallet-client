class EtheriumService {
    private static ETH_NODE_URL = 'http://54.194.239.231:8545';
    private static GATEWAY_URL = 'http://54.194.234.190:8080';
    private static CONTRACT = "0x640Da14959D6A6244f35471080BEBd960F15FDAe";

    private web3;
    private ks;

    constructor(private pinFunction) {

    }

    public initWallet(secretSeed, pin, cb) {
        //TODO:remove me
        //secretSeed = 'replace secret rally bless primary fluid border mixed spin ask fish economy';
        lightwallet.keystore.deriveKeyFromPassword(pin, (err, pwDerivedKey) => {
            if (err) {
                Utils.log(err);
                return;
            }
            Utils.log('pwDerivedKey:', pwDerivedKey);
            this.initKeystorage(secretSeed, pwDerivedKey);

            var address = this.generateAccounts(pwDerivedKey)[0];
            Utils.log('Address:', address);
            Utils.log('Private exported key:', this.ks.exportPrivateKey(address, pwDerivedKey));
            cb(address);
            //this.watchBalanceGateway(address);
        });
    }

    private initKeystorage(secretSeed, pwDerivedKey) {
        this.ks = new lightwallet.keystore(secretSeed, pwDerivedKey);
        this.ks.passwordProvider = (callback) => callback(null, this.pinFunction('Please authorize transaction with your pin code'));

        this.initWeb3();
    }

    private initWeb3() {
        this.web3 = new Web3();
        this.web3.setProvider(new HookedWeb3Provider({
            host: EtheriumService.ETH_NODE_URL,
            transaction_signer: this.ks
        }));
    }

    public generateAccounts(pwDerivedKey, count = 1) {
        this.ks.generateNewAddress(pwDerivedKey, count);
        return this.ks.getAddresses();
    }

    public watchBalance(address) {
        this.web3.eth.filter(address).watch(()=> {
            var currentBalance = this.web3.eth.getBalance(address).toNumber();
            Utils.log('Balance update:', currentBalance / 1.0e18, 'ETH')
        });
    }

    public watchEurBalance(address) {
        var accountArgument = "000000000000000000000000" + address;
        var data = "0x" + keccak_256("balanceOf(address)").substring(0, 8) + accountArgument;

        Utils.xhr(EtheriumService.ETH_NODE_URL, JSON.stringify({
            id: 1,
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{to: EtheriumService.CONTRACT, data: data}]
        }), function (res) {
            var hexBalance = JSON.parse(res).result;
            Utils.log('Balance update:', hexBalance, 'EUR');

        }, 'POST');
    }

    public watchBalanceGateway(address) {
        Utils.xhr(EtheriumService.GATEWAY_URL + '/v1/balances/' + address, null, (res)=> {
            var data = JSON.parse(res);
            Utils.log('Balance gateway update:', data.amount, data.currency);
        });
    }

}