StationMapController.$inject = ['$interval', 'PredictionsModel'];

function StationMapController($interval, PredictionsModel) {
  this.getBgImageUrl = function(index) {
    //FIXME hardcoded url
    return "assets/images/station-map/map-" + index + ".png";
  }
  this.mapsSettings = {
    1: {
      bays: [6, 1],
      bg: this.getBgImageUrl(1)
    },
    2: {
      bays: [7, 2],
      bg: this.getBgImageUrl(2)
    },
    3: {
      bays: [8, 3],
      bg: this.getBgImageUrl(3)
    },
    4: {
      bays: [4, 9],
      bg: this.getBgImageUrl(4)
    },
    5: {
      bays: [5],
      bg: this.getBgImageUrl(5)
    }
  };
}