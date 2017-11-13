
MetroCamsController.$inject = ['$interval', 'Carousel'];

function MetroCamsController($interval, Carousel){

    this.cams = [];
    this.refreshCams = function(index) {
        if(_.isUndefined(index)) {
            this.cams = this.data.map(function(item) {
                return item += '?&nocache=' + Date.now();
            });
        } else {
            this.cams[index] = this.data[index] + '?&nocache=' + Date.now();
        }
    }

    this.$onInit = function() {
        var nextSlideTimeout, refreshTimeout;
        refreshTimeout = 187500;
        nextSlideTimeout = refreshTimeout / (this.data.length || 10000);
        $interval(function() {
            this.refreshCams();
        }, refreshTimeout);

        $interval(function() {
            var camsCarousel = Carousel.get('metro-cams-carousel');
            camsCarousel.next();
            this.refreshCams((camsCarousel.currentSlide + 2) % camsCarousel.slidesCount);
        }, nextSlideTimeout);
    };

    this.$onChanges = function(changed) {
        if (changed.data) {
            this.refreshCams();
        }
    };
};