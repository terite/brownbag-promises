'use strict'

var app = angular.module('brownbag', []);

app.controller('brownbagCtrl', function ($q, $timeout) {
    var ctrl = this;

    this.canPressFinal = false;
    this.canReconsider = false;

    var timeoutPromise = null;

    var deferreds = {
        left: $q.defer(),
        right: $q.defer(),
        timeout: $q.defer(),
    };

    var promises = {
        left: deferreds.left.promise,
        right: deferreds.right.promise,
        timeout: deferreds.timeout.promise,
    };

    this.pressLeft = function () {
        console.log('resolving left');
        deferreds.left.resolve(true);
    };

    this.pressRight = function () {
        console.log('resolving right');
        deferreds.right.resolve(true);
    };

    this.pressReconsider = function () {
        console.log('reconsider pressed');
        $timeout.cancel(timeoutPromise);
    };

    $q.all([promises.left, promises.right]).then(function () {
        console.log('both left and right resolved', arguments);
        ctrl.canReconsider = true;
        timeoutPromise = $timeout(5000);
        return timeoutPromise;
    })
    .catch(function () {
        console.log('Timeout cancelled', arguments);
        return $q.reject('Some rejection value');
    })
    .then(function () {
        console.log('Timeout elapsed', arguments);
        ctrl.canReconsider = false;
        ctrl.canPressFinal = true;
    })
    .catch(function () {
        console.log('bottom catch called', arguments);
    })
    .finally(function () {
        console.log('finally called', arguments);
    });

});
