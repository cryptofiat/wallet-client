import MainController from './controllers/MainController';
import CreateVerifyController from './controllers/CreateVerifyController';
import MenuController from './controllers/MenuController';

angular
    .module('app', ['ionic'])
    .controller('menuCtrl', MenuController)
    .controller('mainCtrl', MainController)
    .controller('createVerifyUseCtrl', CreateVerifyController)

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
                controller: 'mainCtrl',
            })
            .state('tabsController.createVerifyUse', {
                url: '/verify',
                views: {
                    'tab2': {
                        templateUrl: 'templates/createVerifyUse.html',
                        controller: 'createVerifyUseCtrl'
                    }
                }
            })
            .state('tabsController', {
                url: '',
                templateUrl: 'templates/tabsController.html',
                abstract: true
            });

        $urlRouterProvider.otherwise('/')
    }])


