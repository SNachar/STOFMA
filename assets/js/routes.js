angular.module('stofmaApp')
    .config(['$stateProvider', '$urlRouterProvider', 'AccessLevels', function ($stateProvider, $urlRouterProvider, AccessLevels) {

      var authenticated = ['$q', 'UserService', function ($q, UserService) {
        var defer = $q.defer();
        UserService.getCurrentSession()
            .then(function (session) {
              defer.resolve(session);
            }).catch(function () {
              defer.reject('Non connecté');
            });
        return defer.promise;
      }];

      $stateProvider
          .state('anon', {
            abstract: true,
            template: '<div ui-view />',
            data: {
              access: AccessLevels.anon
            }
          })
          .state('anon.login', {
            url: '/login',
            controller: 'LoginCtrl',
            templateUrl: 'assets/templates/login.html',
            data: {
              name: 'Connexion',
              icon: 'settings_ethernet'
            }
          })
          .state('anon.register', {
            url: '/register',
            controller: 'RegisterCtrl',
            templateUrl: 'assets/templates/register.html',
            data: {
              name: 'Inscription',
              icon: 'assignment_ind'
            },
            resolve: {
              isManager: function () {
                return false;
              }
            }
          })
          .state('anon.mentions', {
            url: '/mentions',
            templateUrl: 'assets/templates/mentions.html',
            data: {
              name: 'Mentions légales',
              hidden: true
            }
          })
          .state('user', {
            abstract: true,
            template: '<div ui-view />',
            data: {
              access: AccessLevels.user,
              name: ''
            },
            resolve: {
              authenticated: authenticated
            }
          })
          .state('user.home', {
            url: '/home',
            controller: 'HomeCtrl',
            templateUrl: 'assets/templates/home.html',
            data: {
              name: 'Accueil',
              icon: 'home',
              hidden: true
            }
          })
          .state('user.profile', {
            url: '/profile',
            controller: 'ProfileCtrl',
            templateUrl: 'assets/templates/profile.html',
            data: {
              name: 'Mon Compte',
              icon: 'person'
            },
            resolve: {
              userProvider: 'UserService',
              updateHimSelf: function () {
                return true;
              },

              userData: function (userProvider) {
                return userProvider.getFromSession();
              }
            }
          })
          .state('user.sales', {
            url: '/history',
            controller: 'SalesCtrl',
            templateUrl: 'assets/templates/sales.html',
            data: {
              name: 'Mes achats',
              icon: 'shopping_cart'
            },
            resolve: {
              salesProvider: 'SaleService',
              isManager: function () {
                return false;
              },
              ownSale: function () {
                return true;
              },
              salesData: function (salesProvider) {
                return salesProvider.getOwnSales();
              }
            }
          })
          .state('user.sell', {
            url: '/sell',
            controller: 'ManageSellCtrl',
            templateUrl: 'assets/templates/sell.html',
            data: {
              name: 'Le bar',
              icon: 'add_shopping_cart'
            },
            resolve: {
              productProvider: 'ProductService',

              productsData: function (productProvider) {
                return productProvider.getProducts(true);
              },
              usersProvider: 'UserService',

              usersData: function (usersProvider) {
                return usersProvider.getAll();
              }
            }
          })
          .state('user.settings', {
            url: '/settings',
            controller: 'SettingCtrl',
            templateUrl: 'assets/templates/settings.html',
            data: {
              name: 'Paramètres',
              icon: 'settings',
              hidden: true
            }
          })
          .state('manager', {
            abstract: true,
            template: '<div ui-view />',
            data: {
              access: AccessLevels.manager,
              name: 'Manager'
            },
            resolve: {
              authenticated: authenticated,

              isManager: ['$q', 'authenticated', function ($q, authenticated) {
                var defer = $q.defer();
                if (authenticated.isManager || authenticated.isAdmin)
                  defer.resolve();
                else
                  defer.reject();
                return defer.promise;
              }]
            }
          })
          .state('manager.sell', {
            url: '/sell',
            controller: 'ManageSellCtrl',
            templateUrl: 'assets/templates/sell.html',
            data: {
              name: 'Vendre un produit',
              icon: 'add_shopping_cart'
            },
            resolve: {
              productProvider: 'ProductService',

              productsData: function (productProvider) {
                return productProvider.getProducts(true);
              },
              usersProvider: 'UserService',

              usersData: function (usersProvider) {
                return usersProvider.getAll();
              }
            }
          })
          .state('manager.editsale', {
            url: '/sale/{id:int}',
            controller: 'ManageSellCtrl',
            templateUrl: 'assets/templates/sell.html',
            data: {
              name: 'Modifier une vente',
              hidden: true
            },
            resolve: {
              productProvider: 'ProductService',

              productsData: function (productProvider) {
                return productProvider.getProducts(true);
              },
              usersProvider: 'UserService',

              usersData: function (usersProvider) {
                return usersProvider.getAll();
              }
            }
          })
          .state('manager.sales', {
            url: '/sales',
            controller: 'SalesCtrl',
            templateUrl: 'assets/templates/sales.html',
            data: {
              name: 'Les ventes',
              icon: 'shopping_cart'
            },
            resolve: {
              salesProvider: 'SaleService',
              isManager: function () {
                return true;
              },
              ownSale: function () {
                return false;
              },
              salesData: function (salesProvider) {
                return salesProvider.getSales();
              }
            }
          })
          .state('manager.purchases', {
            url: '/purchases',
            controller: 'PurchaseCtrl',
            templateUrl: 'assets/templates/purchases.html',
            data: {
              name: 'Les achats',
              icon: 'list'
            },
            resolve: {
              purchasesProvider: 'PurchaseService',

              purchasesData: function (purchasesProvider) {
                return purchasesProvider.getPurchases();
              }
            }
          })
          .state('manager.addpurchase', {
            url: '/purchase/add',
            controller: 'ManagePurchaseCtrl',
            templateUrl: 'assets/templates/purchases.manage.html',
            data: {
              name: 'Ajout d\'un achat',
              hidden: true
            },
            resolve: {
              productsProvider: 'ProductService',

              productsData: function (productsProvider) {
                return productsProvider.getProducts();
              }
            }
          })
          .state('manager.editpurchase', {
            url: '/purchase/edit/{id:int}',
            controller: 'ManagePurchaseCtrl',
            templateUrl: 'assets/templates/purchases.manage.html',
            data: {
              name: 'Modification d\'un achat',
              hidden: true
            },
            resolve: {
              productsProvider: 'ProductService',

              productsData: function (productsProvider) {
                return productsProvider.getProducts();
              }
            }
          })
          .state('manager.users', {
            url: '/users',
            controller: 'UserCtrl',
            templateUrl: 'assets/templates/users.html',
            data: {
              name: 'Utilisateurs',
              icon: 'face'
            },
            resolve: {
              usersProvider: 'UserService',

              usersData: function (usersProvider) {
                return usersProvider.getAll(true);
              }
            }
          })
          .state('manager.registeruser', {
            url: '/user/register',
            controller: 'RegisterCtrl',
            templateUrl: 'assets/templates/register.html',
            resolve: {
              isManager: function () {
                return true;
              }
            },
            data: {
              name: 'Inscrire un nouvel utilisateur',
              hidden: true
            }
          })
          .state('manager.credit', {
            url: '/credit',
            controller: 'CreditCtrl',
            templateUrl: 'assets/templates/credit.html',
            data: {
              name: 'Paiements et soldes',
              icon: 'attach_money'
            },
            resolve: {
              userProvider: 'UserService',
              usersData: function (userProvider) {
                return userProvider.getAll();
              }
            }
          })
          .state('manager.products', {
            url: '/products',
            controller: 'ProductCtrl',
            templateUrl: 'assets/templates/products.html',
            data: {
              name: 'Les produits',
              icon: 'layers'
            },
            resolve: {
              productsProvider: 'ProductService',

              productsData: function (productsProvider) {
                return productsProvider.getProducts();
              },

              categoriesData: function (productsProvider) {
                return productsProvider.getCategories();
              }
            }
          })
          .state('manager.profile', {
            url: '/profile/{id:int}',
            controller: 'ProfileCtrl',
            templateUrl: 'assets/templates/profile.html',
            data: {
              name: 'Édition du profil',
              hidden: true
            },
            resolve: {
              userProvider: 'UserService',
              updateHimSelf: function () {
                return false;
              },

              userData: function (userProvider, $stateParams) {
                return userProvider.get($stateParams.id, true);
              }
            }
          })
          .state('manager.products.add', {
            url: '/add',
            controller: 'AddProductCtrl',
            templateUrl: 'assets/templates/products.add.html',
            data: {
              name: 'Ajout d\'un produit',
              hidden: true
            }
          })
          .state('manager.results', {
            url: '/results',
            controller: 'AccountStatementCtrl',
            templateUrl: 'assets/templates/results.html',
            data: {
              name: 'Bilan',
              icon: 'equalizer'
            },
            resolve: {
              paymentsProvider: 'PaymentService',

              paymentsData: function (paymentsProvider) {
                return paymentsProvider.getAll();
              },
              usersProvider: 'UserService',

              usersData: function (usersProvider) {
                return usersProvider.getAll();
              }
            }
          })
          .state('admin', {
            abstract: true,
            template: '<div ui-view />',
            data: {
              access: AccessLevels.admin,
              name: 'Administrateur'
            },
            resolve: {
              authenticated: authenticated,

              isAdmin: ['$q', 'authenticated', function ($q, authenticated) {
                var defer = $q.defer();
                if (authenticated.isAdmin)
                  defer.resolve();
                else
                  defer.reject();
                return defer.promise;
              }]
            }
          })
          .state('admin.role', {
            url: '/role',
            controller: 'RoleCtrl',
            templateUrl: 'assets/templates/role.html',
            data: {
              name: 'Gérer les rôles',
              icon: 'group'
            },
            resolve: {
              userProvider: 'UserService',
              usersData: function (userProvider) {
                return userProvider.getAll();

              }
            }
          });

      $urlRouterProvider.otherwise('/home');
    }])
;
