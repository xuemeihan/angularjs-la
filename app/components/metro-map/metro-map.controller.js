
MetroMapController.$inject = ['$interval', '$sce', 'Carousel', 'PredictionsModel', '$timeout'];

function MetroMapController($interval, $sce, Carousel, PredictionsModel, $timeout) {

    // initialize
    this.map = {
      index: this.timings.cursor,
      url: this.maps[this.timings.cursor]
    };

    this.slideMap();
    this.getTexts();

    this.intervalId = $interval(function() {
      if (this.texts != null) {
        this.texts.shift();
        if (this.texts.length === 0) {
          this.getTexts();
        }
      }

      $timeout(function() {
        if(this.response != null) {
          this.texts = this.response;
          this.response = null;
        }
      }, 1000);
    }, 8000);

    this.maps = [
    'assets/frames/diagram.html',
    'https://go511.com/Map/EmbeddedMap?bgColour=ffffff&center=34.06,-118.21&zoom=10&layers=trafficSpeed,incident,sigalert,construction,closures&showAlert=true&showLegend=false&showMapControls=false',
    'assets/frames/map.html',
    'https://go511.com/Map/EmbeddedMap?bgColour=ffffff&center=34.06,-118.21&zoom=13&layers=trafficSpeed,incident,sigalert,construction,closures&showAlert=true&showLegend=false&showMapControls=false',
    'assets/frames/video.html',
    ];

    this.timings = {
      intervals: [
      10000, 30000, 20000, 30000, 75000
      ],
      cursor: 0
    }

    this.response = null;
    this.texts = null;
    this.intervalId = null;

    this.slideMap = function() {
      console.log('slide');
      $timeout(function() {
        Carousel.get('maps-carousel').next();
        this.slideMap();
      }, this.timings.intervals[this.timings.cursor]);
      if (this.timings.cursor === this.timings.intervals.length - 1) {
        this.timings.cursor = 0;
      } else {
        this.timings.cursor += 1;
      }
    }

    this.getTexts = function() {
      PredictionsModel.advisories().then(function(response) {
        this.response = response;
        if (this.texts === null) {
          this.texts = this.response;
          this.response = null;
        }
      });
    }

  }