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