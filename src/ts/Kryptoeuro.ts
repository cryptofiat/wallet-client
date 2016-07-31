class Kryptoeuro {
    private static LOCALSTORAGE_KEY_KEY = 'kryptoeuro_client_private_key';

    private eth;

    constructor() {
        var encryptedData = localStorage.getItem(Kryptoeuro.LOCALSTORAGE_KEY_KEY);
        var pin = this.promptPin(encryptedData ? 'Please enter pin' : 'Please enter and remember pin code');
        if (!encryptedData) {
            var secretSeed = lightwallet.keystore.generateRandomSeed();
            encryptedData = sjcl.encrypt(pin, secretSeed);
            localStorage.setItem(Kryptoeuro.LOCALSTORAGE_KEY_KEY, encryptedData);
        }

        Utils.log('EncryptedData:', encryptedData);

        this.eth = new EtheriumService(this.promptPin);

        this.initWallet(encryptedData, pin);
    }

    private initWallet(encryptedData, pin) {
        try {
            var secretSeed = sjcl.decrypt(pin, encryptedData);
            Utils.log('Pin correct congrats!', pin);
            this.eth.initWallet(secretSeed, pin);
        } catch (e) {
            Utils.log('Wrong ping, decryption failed!', pin);
            this.initWallet(encryptedData, this.promptPin('You entered wrong pin, try again'))
        }
    }

    private promptPin(message) {
        return prompt(message, '1122');
    }

}