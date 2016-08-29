//declare/find proper interfaces
declare var keccak_256;
declare var sjcl;
declare var lightwallet;
declare var Web3;
declare var HookedWeb3Provider;

declare var Framework7;
declare var Dom7;

var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination'
});
