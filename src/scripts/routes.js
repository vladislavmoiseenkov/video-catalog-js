myApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    var mainState = {
        name: 'main',
        url: '/',
        templateUrl: 'www/view/main.html',
        controller: 'mainCtrl'
    };

    var playlist = {
        name: 'playlist',
        url: '/playlist/:albumId',
        templateUrl: 'www/view/playlist.html',
        controller: function($scope, $rootScope, $stateParams) {
            $scope.data = $rootScope.data;
            $scope.albumId = +$stateParams.albumId;
            $rootScope.albumId = +$stateParams.albumId;
        }
    };

    var video = {
        name: 'video',
        url: '/playlist/:albumId/:videoId',
        templateUrl: 'www/view/video.html',
        controller: function($scope, $rootScope, $stateParams, $sce) {

            $scope.video = $rootScope.data[$stateParams.albumId].videos[$stateParams.videoId];
            $scope.videoUrl = $sce.trustAsResourceUrl($scope.video.embedUrl);

        }
    };

    $stateProvider.state(mainState);
    $stateProvider.state(playlist);
    $stateProvider.state(video);
});