(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

var _Utils = require('../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = window.innerWidth;
    var height = window.innerHeight - 4;
    var center = { x: width / 2, y: height / 2 };

    var player = new _AnimationPlayer2.default();
    var randomCount = new Array(10).fill(0);
    var barWidth = 50;
    var margin = 50;
    var offset = width / 2 - (randomCount.length * barWidth + randomCount.length * margin) / 2;

    // Canvas setup
    canvas.height = height;
    canvas.width = width;
    canvas.style.backgroundColor = "#999999";

    createUI();

    // Player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0, 0, width, height);

        //let index = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
        var index = Math.floor(_Utils2.default.montecarlo() * (10 - 0 + 1)) + 0;
        randomCount[index]++;

        for (var i = 0; i < randomCount.length; i++) {
            var barHeight = randomCount[i] * -1 || 0;
            var xPos = offset + i * barWidth + i * margin;

            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(xPos, height / 1.2, barWidth, barHeight);
            ctx.closePath();
        }
    }

    // Animation control: KeyDown
    document.body.addEventListener("keydown", function (e) {
        //console.log("Key pressed: ", e.keyCode);
        switch (e.keyCode) {
            case 27:
                // Esc
                if (player.playing) {
                    player.stop();
                    console.log("> Scene stopped");
                } else {
                    player.play();
                    console.log("> Playing scene");
                }
                break;
            default:
                break;
        }
    });

    // Display title and legends under bars
    function createUI() {
        var documentElement = document.getElementsByTagName("BODY")[0];
        var H1 = document.createElement("H1");
        H1.innerHTML = "Generating uniformly-distributed pseudo-random numbers from 0 to 9";
        documentElement.appendChild(H1);

        for (var i = 0; i < randomCount.length; i++) {
            var xPos = offset + i * barWidth + i * margin;
            var SPAN = document.createElement("SPAN");
            SPAN.style.left = xPos + "px";
            SPAN.style.top = height / 1.18 + "px";
            SPAN.style.width = barWidth + "px";
            SPAN.innerHTML = i;
            documentElement.appendChild(SPAN);
        }
    }
};

},{"../../src/lib/AnimationPlayer":3,"../../src/lib/Utils":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 *  Feature Toggling
 *
 *  Activete/Hide features that are in process of development or under testing
 *  Once a feature is accepted to be includded must be removed from the
 *  feature toggle scheme
 */

var FEATURE_TOGGLE = {
  FPS_CONTROL: true // FPS controll for AnimationPlayer class
};

exports.default = FEATURE_TOGGLE;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require("../../src/feature-toggle");

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimationPlayer = function () {
    function AnimationPlayer(settings) {
        _classCallCheck(this, AnimationPlayer);

        settings = settings || {};

        this.window = settings.windowElement || window;
        this.requestId = null;
        this.playing = false;

        // FPS control
        if (_featureToggle2.default.FPS_CONTROL) {
            this.fps = settings.fps || 90;
            this.now;
            this.lastTime = Date.now();
            this.interval = 1000 / this.fps;
            this.delta;
        }
    }

    _createClass(AnimationPlayer, [{
        key: "play",
        value: function play() {
            this.playing = true;
            this.updateFn();
        }
    }, {
        key: "stop",
        value: function stop() {
            if (!this.playing) {
                return false;
            }
            this.window.cancelAnimationFrame(this.requestId);
            this.playing = false;
            this.requestId = null;
        }
    }, {
        key: "setUpdateFn",
        value: function setUpdateFn(updateFn) {
            var _this = this;

            this.updateFn = function () {
                _this.requestId = _this.window.requestAnimationFrame(_this.updateFn);

                // FPS control
                if (_featureToggle2.default.FPS_CONTROL) {
                    _this.now = Date.now();
                    _this.delta = _this.now - _this.lastTime;

                    if (_this.delta > _this.interval) {
                        _this.lastTime = _this.now - _this.delta % _this.interval;
                        updateFn();
                    }
                    return;
                }

                updateFn();
            };
        }
    }, {
        key: "updateFn",
        value: function updateFn() {
            console.warn("Player update function has not been set.");
        }
    }]);

    return AnimationPlayer;
}();

exports.default = AnimationPlayer;

},{"../../src/feature-toggle":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require('../../src/feature-toggle');

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: 'montecarlo',
    value: function montecarlo() {
      while (true) {
        var r1 = Math.random();
        var p = r1;
        var r2 = Math.random();
        if (r2 < p) {
          return r1;
        }
      }
    }
  }, {
    key: 'lerp',
    value: function lerp(norm, min, max) {
      return (max - min) * norm + min;
    }
  }, {
    key: 'quadraticBezier',
    value: function quadraticBezier(p0, p1, p2, t, pFinal) {
      pFinal = pFinal || {};
      pFinal.x = Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x;
      pFinal.y = Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y;
      return pFinal;
    }
  }, {
    key: 'cubicBezier',
    value: function cubicBezier(p0, p1, p2, p3, t, pFinal) {
      pFinal = pFinal || {};
      pFinal.x = Math.pow(1 - t, 3) * p0.x + Math.pow(1 - t, 2) * 3 * t * p1.x + (1 - t) * 3 * t * t * p2.x + t * t * t * p3.x;
      pFinal.y = Math.pow(1 - t, 3) * p0.y + Math.pow(1 - t, 2) * 3 * t * p1.y + (1 - t) * 3 * t * t * p2.y + t * t * t * p3.y;
      return pFinal;
    }
  }, {
    key: 'distance',
    value: function distance(p0, p1) {
      var dx = p0.x - p1.x;
      var dy = p0.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }, {
    key: 'distanceXY',
    value: function distanceXY(x0, y0, x1, y1) {
      var dx = x1 - x0;
      var dy = y1 - y0;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // TODO: Check if and why we need to parseInt() the result

  }, {
    key: 'mapRange',
    value: function mapRange(value, low1, high1, low2, high2) {
      return result = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      var result = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      if (low2 === parseInt(low2, 10) || high2 === parseInt(high2, 10)) {
        result = parseInt(result);
      }
      return result;
    }
  }, {
    key: 'inRange',
    value: function inRange(value, min, max) {
      return value >= Math.min(min, max) && value <= Math.max(min, max);
    }
  }, {
    key: 'rangeIntersect',
    value: function rangeIntersect(min0, max0, min1, max1) {
      return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
    }
  }, {
    key: 'randomRange',
    value: function randomRange(min, max) {
      return min + Math.random() * (max - min);
    }
  }, {
    key: 'circleCollision',
    value: function circleCollision(c0, c1) {
      return this.distance(c0, c1) <= c0.radius + c1.radius;
    }
  }, {
    key: 'rectangleCollision',
    value: function rectangleCollision(r0, r1) {
      return this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) && this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    }
  }, {
    key: 'circlePointCollision',
    value: function circlePointCollision(px, py, circle) {
      return this.distanceXY(px, py, circle.x, circle.y) < circle.radius;
    }
  }, {
    key: 'rectanglePointCollision',
    value: function rectanglePointCollision(px, py, rect) {
      return this.inRange(px, rect.x, rect.x + rect.width) && this.inRange(py, rect.y, rect.y + rect.height);
    }
  }]);

  return Utils;
}();

var instance = new Utils();

exports.default = instance;

},{"../../src/feature-toggle":2}]},{},[1])


//# sourceMappingURL=app.js.map