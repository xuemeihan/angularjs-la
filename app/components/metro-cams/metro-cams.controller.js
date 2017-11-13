
MetroCamsController.$inject = ['$scope', '$interval', 'Carousel'];

function MetroCamsController($scope, $interval, Carousel){

    vm = $scope;
    vm.cams = [];
    vm.refreshCams = function(index) {
        if(_.isUndefined(index)) {
            vm.cams = this.data.map(function(item) {
                return item += '?&nocache=' + Date.now();
            });
        } else {
            vm.cams[index] = vm.data[index] + '?&nocache=' + Date.now();
        }
    }

    vm.$onInit = function() {
        var nextSlideTimeout, refreshTimeout;
        refreshTimeout = 187500;
        nextSlideTimeout = refreshTimeout / (this.data.length || 10000);
        $interval(function() {
            vm.refreshCams();
        }, refreshTimeout);

        $interval(function() {
            var camsCarousel = Carousel.get('metro-cams-carousel');
            camsCarousel.next();
            vm.refreshCams((camsCarousel.currentSlide + 2) % camsCarousel.slidesCount);
        }, nextSlideTimeout);
    };

    vm.$onChanges = function(changed) {
        if (changed.data) {
            vm.refreshCams();
        }
    };
};