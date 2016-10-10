import * as wallet from 'cryptofiat-wallet';

export default class SdkService {
    constructor() {
        this.sdk =  new wallet.Application();
        this.sdk.attachStorage(window.localStorage);
    }

    initiated() {
        return this.sdk.initiated();
    }

    unlock(secret) {
        return this.sdk.unlock(secret);
    }

    initLocalStorage(secret) {
        return this.sdk.initLocalStorage(secret);
    }

    storeNewKey(newKeyHex) { //returns public key
        return this.sdk.storeNewKey(newKeyHex);
    }

    pubToAddress(publicKey) {
        return this.sdk.pubToAddress(publicKey)
    }

    approveWithEstonianMobileId(address, phoneNumber, callback) {
        return this.sdk.approveWithEstonianMobileId(address, phoneNumber, callback);
    }

    approveWithEstonianBankTransfer(publicAddress) {
        return this.sdk.approveWithEstonianBankTransfer(publicAddress);
    }

    balanceTotalAsync() {
        return this.sdk.balanceTotalAsync();
    }

    isUnlocked() {
        return this.sdk.isUnlocked();
    }

    sendToEstonianIdCode(idCode, amount, ref) {
        return this.sdk.sendToEstonianIdCode(idCode, amount, ref)
    }

    sendAsync(toAddress, amount, ref) {
        return this.sdk.sendAsync(toAddress, amount, ref, {})
    }

    storeEstonianIdCode(idCode) {
        return this.sdk.storeEstonianIdCode(idCode)
    }
    getEstonianIdCode() {
        return this.sdk.getEstonianIdCode()
    }

    addresses() {
        return this.sdk.addresses()
    }

}
