import * as wallet from 'cryptofiat-wallet';

let privateKey = wallet.generatePrivate();
let publicKey = wallet.privateToPublic(privateKey);
let addr = wallet.pubToAddress(publicKey);

console.log(addr.toString('hex'));