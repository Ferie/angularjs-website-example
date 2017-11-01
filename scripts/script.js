angular.module('routingExample', ['ui.router']);



angular.module('routingExample').config(config);

function config($urlMatcherFactoryProvider, $urlRouterProvider, $stateProvider, $locationProvider) {
    $urlMatcherFactoryProvider.caseInsensitive(true);
    $urlMatcherFactoryProvider.strictMode(false);

    $urlRouterProvider.otherwise('/first-page-content');

    $stateProvider
        .state('mainCommonState', {
            abstract: true,
            views: {
                header: {
                    templateUrl: 'views/header-not-authenticated.html'
                },
                sidebar: {
                    templateUrl: 'views/sidebar-not-authenticated.html'
                },
                content: {},
                footer: {
                    templateUrl: 'views/footer-not-authenticated.html'
                }
            }
        })
        .state('first-page-content', {
            parent: 'mainCommonState',
            redirectTo: 'firstTab',
            data: {
                pageTitle: 'First Page'
            },
            params: {
                // here we define default value for foo
                // we also set squash to false, to force injecting
                // even the default value into url
                foo: {
                    value: 'defaultValue',
                    squash: false
                },
                // this parameter is now array
                // we can pass more items, and expect them as []
                bar : {
                    array : true
                },
                // this param is not part of url
                // it could be passed with $state.go or ui-sref
                hiddenParam: 'YES'
            },
            views: {
                '!content': {
                    templateUrl: 'views/first-page-content.html',
                    controller: 'FirstPageCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('firstTab', {
            url: '/first-page-content',
            parent: 'first-page-content',
            data: {
                pageTitle: 'First Page - First Tab'
            },
            views: {
                '!content.tab': {
                    templateUrl: 'views/first-tab-content.html'
                }
            }
        })
        .state('secondTab', {
            parent: 'first-page-content',
            data: {
                pageTitle: 'First Page - Second Tab'
            },
            views: {
                '!content.tab': {
                    templateUrl: 'views/second-tab-content.html'
                }
            }
        })
        .state('thirdTab', {
            parent: 'first-page-content',
            data: {
                pageTitle: 'First Page - Third Tab'
            },
            views: {
                '!content.tab': {
                    templateUrl: 'views/third-tab-content.html'
                }
            }
        })
        .state('second-page-content', {
            url: '/second-page-content',
            parent: 'mainCommonState',
            data: {
                pageTitle: 'Second Page'
            },
            params: {
                // this param is not part of url
                // it could be passed with $state.go or ui-sref
                state: 'upcoming'
            },
            views: {
                '!content': {
                    templateUrl: 'views/second-page-content.html',
                    controller: 'SecondPageCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('third-page-content', {
            url: '/third-page-content',
            parent: 'mainCommonState',
            data: {
                pageTitle: 'Third Page'
            },
            params: {
                // this param is not part of url
                // it could be passed with $state.go or ui-sref
                state: 'completed'
            },
            views: {
                '!content': {
                    templateUrl: 'views/third-page-content.html',
                    controller: 'ThirdPageCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('login', {
            url: '/login',
            parent: 'mainCommonState',
            data: {
                pageTitle: 'Login'
            },
            views: {
                '!header': {
                    templateUrl: 'views/header.html'
                },
                '!content': {
                    templateUrl: 'views/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('authenticated', {
            url: '/authenticated',
            data: {
                pageTitle: 'Authenticated'
            },
            views: {
                '!header': {
                    templateUrl: 'views/header.html'
                },
                '!sidebar': {
                    templateUrl: 'views/sidebar.html'
                },
                '!content': {
                    templateUrl: 'views/authenticated.html'
                },
                '!footer': {
                    templateUrl: 'views/footer.html'
                }
            }
        })
        .state('logout', {
            parent: 'authenticated',
            redirectTo: 'firstTab'
        })
        .state('authentication-error', {
            parent: 'login',
            data: {
                pageTitle: 'Authentication Error!'
            },
            views: {
                '!content.authenticationError': {
                    templateUrl: 'views/authentication-error.html'
                }
            }
        });

    $locationProvider.html5Mode(true);
}



angular.module('routingExample').run(run);

function run ($rootScope, $state, $stateParams, $transitions) {
    // Define the title of the pages
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}



angular.module('routingExample').controller('FirstPageCtrl', FakeController);

angular.module('routingExample').controller('SecondPageCtrl', FakeController);

angular.module('routingExample').controller('ThirdPageCtrl', FakeController);

function FakeController ($stateParams) {
    var vm = this;
    vm.message = 'nothing useful';

    vm.foo = $stateParams.foo;
    vm.bar = $stateParams.bar;
    vm.hiddenParam = $stateParams.hiddenParam;

    vm.state = $stateParams.state;
}



angular.module('routingExample').controller('LoginController', LoginController);

function LoginController($http, $state, $timeout) {
    var vm = this;

    vm.loading = false;
    vm.authenticationError = false;

    vm.login = function () {
        vm.authenticationError = false;
        vm.loading = true;

        /* $timeout to simulate the request to the server */
        $timeout( function(){
            $http({
                method: 'GET',
                url: 'scripts/auth.json'
            })
            .then(vidaSuccess, vidaError);
        }, 2000 );
    };

    function vidaSuccess(response) {
        /* simple credentials check */
        if (response.data.email === vm.email && response.data.password === vm.password) {
            console.log('login success');
            $state.transitionTo('authenticated');
        } else {
            console.log('credentials not corrected');
            vm.authenticationError = true;
            vm.loading = false;
        }
    }

    function vidaError(reason) {
        console.log('http error');
        console.log(reason);
        vm.authenticationError = true;
        vm.loading = false;
    }
}