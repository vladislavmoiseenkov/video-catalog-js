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