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
                    templateUrl: 'header-not-authenticated.html'
                },
                sidebar: {
                    templateUrl: 'sidebar-not-authenticated.html'
                },
                content: {}
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
                    templateUrl: 'first-page-content.html',
                    controller: 'firstPageCtrl',
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
                    templateUrl: 'first-tab-content.html'
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
                    templateUrl: 'second-tab-content.html'
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
                    templateUrl: 'third-tab-content.html'
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
                    templateUrl: 'second-page-content.html',
                    controller: 'secondPageCtrl',
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
                    templateUrl: 'third-page-content.html',
                    controller: 'thirdPageCtrl',
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
                    templateUrl: 'header.html'
                },
                '!content': {
                    templateUrl: 'login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('authenticated', {
            url: '/authenticated',
//            parent: 'login',
            data: {
                pageTitle: 'Authenticated'
            },
            views: {
                '!header': {
                    templateUrl: 'header.html'
                },
                '!sidebar': {
                    templateUrl: 'sidebar.html'
                },
                '!content': {
                    templateUrl: 'authenticated.html'
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
                    templateUrl: 'authentication-error.html'
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


angular.module('routingExample').controller('headerCtrl', fakeController);

angular.module('routingExample').controller('sidebarCtrl', fakeController);

angular.module('routingExample').controller('firstPageCtrl', fakeController);

angular.module('routingExample').controller('secondPageCtrl', fakeController);

angular.module('routingExample').controller('thirdPageCtrl', fakeController);

function fakeController ($stateParams) {
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
                url: 'auth.json'
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