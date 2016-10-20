import MainController from './controllers/MainController';
import CreateVerifyController from './controllers/CreateVerifyController';
import MenuController from './controllers/MenuController';
import TopUpController from './controllers/TopUpController';
import SendController from './controllers/SendController';
import TransactionsController from './controllers/TransactionsController';
import ExportKeyController from './controllers/ExportKeyController';
import ImportKeyController from './controllers/ImportKeyController';
import AboutController from './controllers/AboutController';
import SdkService from './services/SdkService'

// loading moment.js

// var angular = require('angular');
// require('angular-moment');
// var ngModule = angular.module('ngApp',['angularMoment']);
// ngModule.constant('moment', require('moment-timezone'));

angular
    .module('app', ['ionic'])
    .controller('menuCtrl', MenuController)
    .controller('mainCtrl', MainController)
    .controller('createVerifyUseCtrl', CreateVerifyController)
    .controller('topUpCtrl', TopUpController)
    .controller('sendCtrl', SendController)
    .controller('exportKeyCtrl', ExportKeyController)
    .controller('importKeyCtrl', ImportKeyController)
    .controller('aboutCtrl', AboutController)
    .controller('transactionsCtrl', TransactionsController)
    .service('sdk', SdkService)

    .run(['$ionicPlatform', ($ionicPlatform) => {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }])
    .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'templates/main.html',
                controller: 'mainCtrl'
            })
            .state('createVerifyUse', {
                url: '/verify?email',
                templateUrl: 'templates/createVerifyUse.html',
                controller: 'createVerifyUseCtrl'
            })
            .state('exportKeys', {
                url: '/exportKeys',
                templateUrl: 'templates/exportKey.html',
                controller: 'exportKeyCtrl'
            })
            .state('importKey', {
                url: '/importKey',
                templateUrl: 'templates/importKey.html',
                controller: 'importKeyCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'templates/about.html',
                controller: 'aboutCtrl'
            })
/*
            .state('navBar.topUp', {
                url: '/topUp',
                views: {
                    'topUpTab': {
                        templateUrl: 'templates/topup.html',
                        controller: 'topUpCtrl'
                    }
                }
            })
*/
            .state('navBar.sendTab', {
                url: '/send',
                views: {
                    'sendTab': {
                        templateUrl: 'templates/send.html',
                        controller: 'sendCtrl'
                    }
                }
            })
            .state('navBar.transactions', {
                url: '/transactions',
                views: {
                    'transactionsTab': {
                        templateUrl: 'templates/transactions.html',
                        controller: 'transactionsCtrl'
                    }
                }
            })
            .state('navBar', {
                url: '',
                templateUrl: 'templates/navBar.html',
                abstract: true
            });

        $urlRouterProvider.otherwise('/')
    }]);


