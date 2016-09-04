//declare/find proper interfaces
declare var keccak_256;
declare var sjcl;
declare var lightwallet;
declare var Web3;
declare var HookedWeb3Provider;

declare var Framework7;
declare var Dom7;

var KE_instance;

var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination'
});

function parseSendClick() {
	var toAddr = ethUtil.stripHexPrefix($$("#to-address").val());
	var amount = $$("#eur-amount").val()*100;
	console.log("Sending amount " + amount + " to " + toAddr );
	KE_instance.eth.sendDelegatedTransfer(KE_instance.ethAddress,toAddr,amount,KE_instance.eth.gatewayFees,3)
}
