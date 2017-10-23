/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/bundles/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 429);
/******/ })
/************************************************************************/
/******/ ({

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tock = undefined;

var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(9);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Tock by Mr Chimp - github.com/mrchimp/tock
* Based on code by James Edwards:
*    sitepoint.com/creating-accurate-timers-in-javascript/
*/

// Implements Date.now() for ie lt 9
Date.now = Date.now || function () {
    return +new Date();
};

// Polyfills Function.prototype.bind for IE lt 9 and Safari lt 5.1
Function.prototype.bind = Function.prototype.bind || function (ctx) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var fn = this;
    return function () {
        return fn.apply.apply(fn, [ctx].concat(args, Array.prototype.slice.call(arguments)));
    };
};

var noop = function noop() {};

var Tock = (_temp = _class = function () {
    function Tock() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Tock);

        if (!(this instanceof Tock)) {
            return new Tock(options);
        }

        Tock.instances++;

        this.go = false;
        this.timeout = null;
        this.missed_ticks = null;
        this.interval = options.interval || 10;
        this.countdown = options.countdown || false;
        this.start_time = 0;
        this.pause_time = 0;
        this.final_time = 0;
        this.duration_ms = 0;
        this.time = 0;
        this.tick = 0;
        this.callback = options.callback || noop;
        this.complete = options.complete || noop;
    }

    /**
    * Start the clock.
    * @param {Integer} time Number of milliseconds
    */


    (0, _createClass3.default)(Tock, [{
        key: "start",
        value: function start() {
            var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            if (this.go) {
                return false;
            }

            // NOTE: start_time is set in both _startCountdown and _startTimer
            // this.start_time = time
            this.pause_time = 0;

            if (this.countdown) {
                this._startCountdown(time);
            } else {
                this._startTimer(Date.now() - time);
            }
        }

        /**
        * Stop the clock and clear the timeout
        */

    }, {
        key: "stop",
        value: function stop() {
            this.pause_time = this.lap();
            this.go = false;

            clearTimeout(this.timeout);

            if (this.countdown) {
                this.final_time = this.duration_ms - this.time;
            } else {
                this.final_time = Date.now() - this.start_time;
            }
        }

        /**
        * Stop/start the clock.
        */

    }, {
        key: "pause",
        value: function pause() {
            if (this.go) {
                this.pause_time = this.lap();
                this.stop();
            } else {
                if (this.pause_time) {
                    if (this.countdown) {
                        this._startCountdown(this.pause_time);
                    } else {
                        this._startTimer(Date.now() - this.pause_time);
                    }

                    this.pause_time = 0;
                }
            }
        }
    }, {
        key: "reset",
        value: function reset() {
            if (this.countdown) {
                return false;
            }

            this.stop();
            this.start_time = 0;
            this.time = 0;
        }

        /**
        * Get the current clock time in ms.
        * @return {Integer} Number of milliseconds ellapsed/remaining
        */

    }, {
        key: "lap",
        value: function lap() {
            if (this.go) {
                if (this.countdown) {
                    return this.duration_ms - (Date.now() - this.start_time);
                } else {
                    return Date.now() - this.start_time;
                }
            }
            return this.pause_time || this.final_time;
        }

        /**
        * Called every tick for countdown clocks.
        * i.e. once every this.interval ms
        */

    }, {
        key: "_tick",
        value: function _tick() {
            var _this = this;

            this.time += this.interval;

            if (this.countdown && this.duration_ms - this.time < 0) {
                this.final_time = 0;
                this.go = false;
                this.callback(this, this.tick);
                clearTimeout(this.timeout);
                this.complete(this);
                return;
            } else {
                this.callback(this, this.tick);
            }

            this.tick += 1;
            var next_interval_in = this.start_time + this.time - Date.now();

            if (next_interval_in <= 0) {
                this.missed_ticks = Math.floor(-next_interval_in / this.interval);
                this.time += this.missed_ticks * this.interval;

                if (this.go) {
                    this._tick();
                }
            } else if (this.go) {
                this.timeout = setTimeout(function () {
                    return _this._tick();
                }, next_interval_in);
            }
        }

        /**
        * Called by Tock internally - use start() instead
        */

    }, {
        key: "_startCountdown",
        value: function _startCountdown(duration) {
            this.duration_ms = duration;
            this.start_time = Date.now();
            this.time = 0;
            this.go = true;
            this._tick();
        }

        /**
        * Called by Tock internally - use start() instead
        */

    }, {
        key: "_startTimer",
        value: function _startTimer(start_time) {
            this.start_time = start_time; // || Date.now()
            this.time = 0;
            this.go = true;
            this._tick();
        }
    }]);
    return Tock;
}(), _class.instances = 0, _temp);
exports.Tock = Tock;
exports.default = Tock;

/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(19);
var core = __webpack_require__(7);
var ctx = __webpack_require__(49);
var hide = __webpack_require__(30);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(28)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 19:
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(27);
var IE8_DOM_DEFINE = __webpack_require__(64);
var toPrimitive = __webpack_require__(50);
var dP = Object.defineProperty;

exports.f = __webpack_require__(18) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(24);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 28:
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(20);
var createDesc = __webpack_require__(34);
module.exports = __webpack_require__(18) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 34:
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 429:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tock = __webpack_require__(118);

var _tock2 = _interopRequireDefault(_tock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var interval = 150;
var lastTick = -1;
var numberSkipped = 0;

var clock = new _tock2.default({
    interval: interval,
    callback: function callback(self) {
        var elapsed = clock.lap();
        var tick = Math.floor(elapsed / interval);
        console.log('current tick:', tick, elapsed / interval, elapsed);
        if (tick !== lastTick + 1) {
            console.error('skipped a callback. current tick=' + tick);
            numberSkipped++;
        }
        console.log('off by', elapsed - tick * interval, 'number of skipped ticks', numberSkipped
        // 'internal missed_ticks', clock.missed_ticks
        );
        console.log('====================');
        lastTick = tick;
    }
});

clock.start();

/***/ }),

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(93);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(24);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(18) && !__webpack_require__(28)(function () {
  return Object.defineProperty(__webpack_require__(65)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(24);
var document = __webpack_require__(19).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(94), __esModule: true };

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(66);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),

/***/ 93:
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(95);
var $Object = __webpack_require__(7).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ 95:
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(17);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(18), 'Object', { defineProperty: __webpack_require__(20).f });


/***/ })

/******/ });
//# sourceMappingURL=tock_test.js.map