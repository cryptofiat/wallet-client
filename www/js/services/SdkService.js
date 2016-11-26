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

    privateToPublic(publicKey) {
        return wallet.privateToPublic(publicKey)
    }

    pubToAddress(publicKey) {
        return this.sdk.pubToAddress(publicKey)
    }

    approveWithEstonianMobileId(address, phoneNumber, callback) {
        return this.sdk.approveWithEstonianMobileId(address, phoneNumber, callback);
    }

    approveWithEstonianIdCard(address) {
        return this.sdk.approveWithEstonianIdCard(address);
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

    transfersCleanedAsync() {
        return this.sdk.transfersCleanedAsync()
    }

    contractDataAsync() {
        return this.sdk.contractDataAsync()
    }

    getAddressForEstonianIdCode(idCode) {
        return this.sdk.getAddressForEstonianIdCode(idCode)
    }

    transferStatusAsync(transactionHash) {
        return this.sdk.transferStatusAsync(transactionHash)
    }

    referenceSendAsync(transactionHash,senderIdCode,receiverIdCode,referenceText,referenceCode,attachments) {
        return this.sdk.referenceSendAsync(transactionHash,senderIdCode,receiverIdCode,referenceText,referenceCode,attachments)
    }

    referenceAsync(transactionHash) {
        return this.sdk.referenceAsync(transactionHash)
    }

    nameFromIdAsync(idCode) {
        return this.sdk.nameFromIdAsync(idCode)
    }

    findAccountAndSendToBank(toIBAN, amount, ref, recipientName) {
        return this.sdk.findAccountAndSendToBank(toIBAN, amount, ref, recipientName);
    }

}
