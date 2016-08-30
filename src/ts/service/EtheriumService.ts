declare var ethUtil;


class EtheriumService {
    private static ETH_NODE_URL = 'http://54.194.239.231:8545';
    private static GATEWAY_URL = 'http://54.194.234.190:8080';
    //private static CONTRACT = "0x640Da14959D6A6244f35471080BEBd960F15FDAe";
    private static CONTRACT = "0x2FdAB8f12fA9Ad9Ad91fc55d52569AFc98Be9831"; //0.41

    private web3;
    private ks;
    private privKey = '';

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

	    // probably a bad idea to store the privkey in a variable
	    this.privKey = this.ks.exportPrivateKey(address, pwDerivedKey);
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

	public readContractVarHexValue(address, contractVarName, processresult ) {
        	var data = "0x" + keccak_256(contractVarName).substring(0, 8) + this.paddedAddress(address);
		var hexResult;

		Utils.xhr(EtheriumService.ETH_NODE_URL, JSON.stringify({
		    id: 1,
		    jsonrpc: '2.0',
		    method: 'eth_call',
		    params: [{to: EtheriumService.CONTRACT, data: data},"latest"]
		}), function (res) {
		    hexResult = JSON.parse(res).result;
		    //Utils.log('Balance update:', hexBalance, 'EUR');
		    console.log("Hex value for " +contractVarName+": "+ hexResult);
		    if (typeof processresult === "function") {
			processresult(hexResult);
		    }
		}, 'POST');
		    
	}


    public watchBalanceGateway(address) {
        Utils.xhr(EtheriumService.GATEWAY_URL + '/v1/balances/0x' + address, null, (res)=> {
            var data = JSON.parse(res);
            Utils.log('Balance gateway update:', data.amount, data.currency);
        });

	//trying a call
	this.sendDelegatedTransfer(address,69,2,1);
    }

	private uint256Hex(_number){
		//convert to hex of uint256
		var zeros32="0000000000000000000000000000000000000000000000000000000000000000"
		var hex = ""+this.web3.toHex(_number).slice(2)
		var padded = zeros32.substring(0, zeros32.length - hex.length) + hex
		//Utils.log("hexConvert: "+this.web3.toHex(_number).slice(2))
		//Utils.log("hexConvert: "+padded)
		return padded;
	};

	public paddedAddress(address) {
		return "000000000000000000000000" + address;
	};

	public sendDelegatedTransfer(to, amount, fee, nonce) {
		// WIP: constructing hex
		var ec = {r:"acacacacac",v:"32",s:"ca898ca98ca98ca98"}
		// var paddedTo = this.paddedAddress(to);
		// assuming sha3() doesn't need hex representation
		//console.log(this.privKey);
		// The privKey representation throwserror
		//var ec = ethUtil.ecsign(ethUtil.sha256(to,to,amount,fee,nonce), ethUtil.toBuffer(this.privKey));
        	var data = "0x" + keccak_256("delegatedTransfer(address,address,uint256,uint256,uint256,uint8,bytes32,bytes32,address)").substring(0, 8) 
			+ this.paddedAddress(to)
			+ this.paddedAddress(to)
			+ this.uint256Hex(amount)
			+ this.uint256Hex(fee)
			+ this.uint256Hex(nonce)
			+ this.uint256Hex(ec.v)
//			+ this.web3.toHex(this.web3.toBigNumber(amount))
//			+ this.web3.toHex(this.web3.toBigNumber(fee))
//			+ this.web3.toHex(this.web3.toBigNumber(nonce))
//			+ this.web3.toHex(ec.v)
			+ this.web3.toHex(ec.r)
			+ this.web3.toHex(ec.s)
			+ this.paddedAddress(to);
		console.log("constructed: "+data);
	}

}
