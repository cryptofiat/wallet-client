class Kryptoeuro {
    private static LOCALSTORAGE_KEY_KEY = 'kryptoeuro_client_private_key';

    private eth;

    constructor() {
        var phoneNumber;
        var encryptedData = localStorage.getItem(Kryptoeuro.LOCALSTORAGE_KEY_KEY);
        var pin = this.promptPin(encryptedData ? 'Please enter pin' : 'Please enter and remember pin code for your account protection');
        if (!encryptedData) {
            var secretSeed = lightwallet.keystore.generateRandomSeed();
            encryptedData = sjcl.encrypt(pin, secretSeed);

            phoneNumber = prompt('Please fill your phone number', '60000007');
        }

        Utils.log('EncryptedData:', encryptedData);

        this.eth = new EtheriumService(this.promptPin);

        this.initWallet(encryptedData, pin, (address)=> {
            if (phoneNumber) {
                var mobid = new MobileIdService();
                mobid.register(address, phoneNumber, ()=> {
                    localStorage.setItem(Kryptoeuro.LOCALSTORAGE_KEY_KEY, encryptedData);
                    this.eth.watchBalance(address);
                    this.eth.watchEurBalance(address);
                    this.eth.watchBalanceGateway(address);
                });


            }
        });

    }

    private initWallet(encryptedData, pin, cb = null) {
        try {
            var secretSeed = sjcl.decrypt(pin, encryptedData);
            Utils.log('Key decrypted congrats!', pin);
            this.eth.initWallet(secretSeed, pin, cb);
        } catch (e) {
            Utils.log('Wrong ping, decryption failed!', pin);
            this.initWallet(encryptedData, this.promptPin('You entered wrong pin, try again'))
        }
    }

    private promptPin(message) {
        return prompt(message, '1122');
    }

}