var app = angular.module('app');

app.controller('DashboardXxlScreen7Controller',
  ['$scope', '$sce', 'PredictionsModel', function($scope, $sce, PredictionsModel){

    $scope.initMaps = function() {

      var initMap;

      initMap = function() {
        var origPoint, destPoint, pointA, pointB, options, map, directionsService, data, titles, coors, coorsP, str, infoFirst, infoLast, points;

        origPoint = {
          long: -118.37380526389,
          lat: 34.019311328588
        };

        destPoint = {
          long: -118.04452116127,
          lat: 34.07227186734
        };

        pointA = new google.maps.LatLng(origPoint.lat, origPoint.long);
        pointB = new google.maps.LatLng(destPoint.lat, destPoint.long);
        options = {
          zoom: 7,
          center: pointA
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), options);

        directionsService = new google.maps.DirectionsService;

        directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true
        });

        data = [
        {
          'title': 'WEST HOLLYWOOD',
          'coordinates': [
          {
            'lat': '34.024209511091',
            'long': '-118.37224334356'
          }, {
            'lat': '34.026715991954',
            'long': '-118.37210597861'
          }
          ]
        }, {
          'title': 'SILVER LINE-EL MONTE STA VIA DOWNTOWN',
          'coordinates': [
          {
            'lat': '34.047923597532',
            'long': '-118.2612098226'
          }, {
            'lat': '34.049379992815',
            'long': '-118.25992360863'
          }, {
            'lat': '34.050062863626',
            'long': '-118.25927209139'
          }, {
            'lat': '34.052268356596',
            'long': '-118.25718920802'
          }, {
            'lat': '34.053683589596',
            'long': '-118.25585651263'
          }, {
            'lat': '34.052998868589',
            'long': '-118.25479469472'
          }, {
            'lat': '34.051578193671',
            'long': '-118.25610757288'
          }, {
            'lat': '34.053062340379',
            'long': '-118.25982610494'
          }
          ]
        }
        ];

        titles = [];
        coors = [];
        coorsP = [];
        data.forEach(function(item, i) {
          titles.push(item.title);
          coorsP.push(item.coordinates[item.coordinates.length - 1]);
          return item.coordinates.forEach(function(coor, i) {
            return coors.push(coor);
          });
        });

        str = "<div id='testOrig'>Origin </div>";
        infoFirst = new google.maps.InfoWindow({
          content: str
        });

        infoFirst.setPosition(pointA);
        infoFirst.open(map);

        str = "<div id='testDest'> Destionation </div>";
        infoLast = new google.maps.InfoWindow({
          content: str
        });

        infoLast.setPosition(pointB);
        infoLast.open(map);
        points = [];


        infoWindow = {};
        coorsP.forEach(function(coor, i ) {
          var index;
          index = i + 1;
          str = "<div id='test-" + index + "'>" + titles[i] + "</div>";
          infoWindow[i] = new google.maps.InfoWindow({
            content: str
          });
          infoWindow[i].setPosition(new google.maps.LatLng(coor.lat, coor.long));
          return infoWindow[i].open(map);
        });

        coors.forEach(function(el, i) {
          var point;
          point = {
            location: new google.maps.LatLng(el.lat, el.long),
            stopover: true
          };
          return points.push(point);
        });

        calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB, points, map, coorsP);

        var calculateAndDisplayRoute;
        calculateAndDisplayRoute = function(directionsService, directionsDisplay, pointA, pointB, points, map, coorsP) {
          var arrPoints;
          arrPoints = coorsP;
          directionsService.route({
            origin: pointA,
            destination: pointB,
            waypoints: points,
            avoidTolls: true,
            avoidHighways: false,
            travelMode: google.maps.TravelMode.DRIVING
          }, function(response, status) {
            var i;
            if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              arrPoints.push(pointA, pointB);
              updateWindows(map, "testOrig");
              i = 0;
              while(i < arrPoints.length) {
                updateWindows(map, i);
                i++;
              }
            } else {
              window.alert("Directions request failed due to " + status);
            }
          });
        };

        initMap();

        var updateWindows;
        updateWindows = function(map, index) {
          var el, id, node, node2, node3, text, textnode;
          if (index === "testOrig") {
            id = "testOrig";
          } else {
            id = index? "test-" + index : "testDest";
          }

          if(document.getElementById(id)) {
            text = document.getElementById(id).textContent;
            el = document.getElementById(id).parentNode.parentNode.parentNode.parentNode;
            el.innerHTML = "";
            node = document.createElement("div");
            node.setAttribute('class', 'test2');
            textnode = document.createTextNode(text);
            node.appendChild(textnode);
            el.appendChild(node);
            node2 = document.createElement("div");
            node2.setAttribute('class', 'test3');
            el.appendChild(node2);
            node3 = document.createElement("div");
            node3.setAttribute('class', 'circle');
            return el.appendChild(node3);
          }
        };
      }
    }

    $scope.initMaps();
  }
  ]);