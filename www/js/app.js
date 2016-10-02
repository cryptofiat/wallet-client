import MainController from './controllers/MainController';
import CreateVerifyController from './controllers/CreateVerifyController';
import MenuController from './controllers/MenuController';
import TopUpController from './controllers/TopUpController';
import SendController from './controllers/SendController';
import TransactionsController from './controllers/TransactionsController';
import SdkService from './services/SdkService'

angular
    .module('app', ['ionic'])
    .controller('menuCtrl', MenuController)
    .controller('mainCtrl', MainController)
    .controller('createVerifyUseCtrl', CreateVerifyController)
    .controller('topUpCtrl', TopUpController)
    .controller('sendCtrl', SendController)
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
            .state('navBar.topUp', {
                url: '/home/topUp',
                views: {
                    'topUpTab': {
                        templateUrl: 'templates/topup.html',
                        controller: 'topUpCtrl'
                    }
                }
            })
            .state('navBar.sendTab', {
                url: '/home/send',
                views: {
                    'sendTab': {
                        templateUrl: 'templates/send.html',
                        controller: 'sendCtrl'
                    }
                }
            })
            .state('navBar.transactions', {
                url: '/home/transactions',
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


