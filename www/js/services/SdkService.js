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

    storeNewKey() {
        return '0x' + this.sdk.storeNewKey().toString('hex');
    }

    approveWithEstonianMobileId(address, phoneNumber, callback) {
        return this.sdk.approveWithEstonianMobileId(address, phoneNumber, callback);
    }

    approveWithEstonianBankTransfer(publicAddress) {
        return this.sdk.approveWithEstonianBankTransfer(publicAddress);
    }

    isUnlocked() {
        return this.sdk.isUnlocked();
    }
}