var myApp = angular.module('videoCatalog', [
    'ui.router',
    'ui.router.state.events',
    'ui.bootstrap'
]);

myApp.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?\(vimeo|youtube|spotify)\.com(/.*)?$', 'self']);
});

myApp.factory('VideoClass', function() {
    return function(name, description, link) {
        this.name = name;
        this.description = description;
        this.link = link;

        // PARSE VIDEO ID ///////////////////

	    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	    var match = link.match(regExp);
	    var vid = (match && match[7].length == 11) ? match[7] : false;

	    if (vid) {
		    this.thumbinal = '//img.youtube.com/vi/' + vid + '/0.jpg';
        }

        /////////////////////////////////////////

        this.vid = vid;
	    this.embedUrl = '//www.youtube.com/embed/' + vid;

    }
});

myApp.run(function($rootScope, $http, $uibModal, VideoClass) {

    $http.get('www/local.json').then(function (response) {

        $rootScope.data = response.data;

	    $rootScope.data.forEach(function (album) {

	        album.videos = album.videos.reduce(function (videos, video) {
		        videos.push(
			        new VideoClass(video.name, video.description, video.link)
                );

	            return videos;
	        }, []);

	        if (album.videos[0]) {
	            album.thumbinal = album.videos[0].thumbinal;
            }

	    });
    });

    $rootScope.open = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'md'
        });

        modalInstance.result.then(function (response) {


            var newVideo = new VideoClass(response.name, response.description, response.link);

            $rootScope.data[$rootScope.albumId].videos.push(newVideo);
        }, function () {

        });
    };

    $rootScope.$on('$stateChangeSuccess', function () {
        delete $rootScope.albumId;
    });
});
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
myApp.controller('mainCtrl', function ($scope, $rootScope) {
    $scope.data = $rootScope.data;
});
myApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {

    $scope.vm = {
        name: '',
        description: '',
        link: ''
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.vm);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});