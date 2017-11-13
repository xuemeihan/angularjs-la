'use strict';
var app = angular.module('app');

app.service('Helpers', function Helpers() {

    return {

      generateRandomString: function(length) {
        length = length || 10;
        var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';

        for (var i=0; i<length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
      }

    };

  });
