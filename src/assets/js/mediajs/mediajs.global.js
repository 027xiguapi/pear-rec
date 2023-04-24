(function () {
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $cc400760811d54a9$exports = {};

$parcel$export($cc400760811d54a9$exports, "Media", function () { return $cc400760811d54a9$export$7fc53215244aec38; }, function (v) { return $cc400760811d54a9$export$7fc53215244aec38 = v; });
var $94f9d0604343ce39$var$EventTarget = /** @class */ function() {
    var EventTarget = function EventTarget() {
        this.eventBus = {
            error: [],
            create: [],
            destroy: [],
            start: [],
            stop: [],
            pause: [],
            resume: [],
            dataavailable: []
        };
    };
    // 注册
    EventTarget.prototype.on = function(name, callback) {
        var callbackList = this.eventBus[name] || [];
        callbackList.push(callback);
        this.eventBus[name] = callbackList;
    };
    // 触发
    EventTarget.prototype.emit = function(name) {
        var _this = this;
        var args = [];
        for(var _i = 1; _i < arguments.length; _i++)args[_i - 1] = arguments[_i];
        var evnetName = this.eventBus[name];
        if (evnetName) evnetName.forEach(function(fn) {
            fn.apply(_this, args);
        });
        else console.error("emit ".concat(name, " is not find"));
    };
    // 删除
    EventTarget.prototype.off = function(name, fn) {
        var evnetName = this.eventBus[name];
        if (evnetName && fn) {
            var index = evnetName.findIndex(function(fns) {
                return fns === fn;
            });
            evnetName.splice(index, 1);
        } else console.error("off ".concat(name, " is not find"));
    };
    // 注册一次
    EventTarget.prototype.once = function(name, fn) {
        var _this = this;
        var decor = function decor1() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++)args[_i] = arguments[_i];
            fn.apply(_this, args);
            _this.off(name, decor);
        };
        this.on(name, decor);
    };
    return EventTarget;
}();
var $94f9d0604343ce39$export$2e2bcd8739ae039 = $94f9d0604343ce39$var$EventTarget;


var $206f35e62fa86708$export$31da179f3c64051c = /** @class */ function() {
    var SoundMeter = function SoundMeter(context) {
        var _this = this;
        this.instant = 0.0;
        this.slow = 0.0;
        this.clip = 0.0;
        this.context = context;
        this.script = context.createScriptProcessor(2048, 1, 1);
        this.script.onaudioprocess = function(event) {
            var input = event.inputBuffer.getChannelData(0);
            var i;
            var sum = 0.0;
            var clipcount = 0;
            for(i = 0; i < input.length; ++i){
                sum += input[i] * input[i];
                if (Math.abs(input[i]) > 0.99) clipcount += 1;
            }
            _this.instant = Math.sqrt(sum / input.length);
            _this.slow = 0.95 * _this.slow + 0.05 * _this.instant;
            _this.clip = clipcount / input.length;
        };
    };
    SoundMeter.prototype.getInstant = function() {
        return this.instant;
    };
    SoundMeter.prototype.getSlow = function() {
        return this.slow;
    };
    SoundMeter.prototype.getClip = function() {
        return this.clip;
    };
    SoundMeter.prototype.connectToSource = function(stream) {
        try {
            this.mic = this.context.createMediaStreamSource(stream);
            this.mic.connect(this.script);
            this.script.connect(this.context.destination);
        } catch (e) {
            console.error(e);
        }
    };
    SoundMeter.prototype.stop = function() {
        this.mic.disconnect();
        this.script.disconnect();
    };
    return SoundMeter;
}();
var $206f35e62fa86708$export$2e2bcd8739ae039 = $206f35e62fa86708$export$31da179f3c64051c;


/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ /*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ function $44635a22a5de2b4c$export$2e2bcd8739ae039(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}


function $59a678b96ba8439d$export$2e2bcd8739ae039(obj) {
    "@swc/helpers - typeof";
    return obj && obj.constructor === Symbol ? "symbol" : typeof obj;
}


"use strict";
var $993722e8c7a9e5a7$var$logDisabled_ = true;
var $993722e8c7a9e5a7$var$deprecationWarnings_ = true;
function $993722e8c7a9e5a7$export$e3c02be309be1f23(uastring, expr, pos) {
    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
}
function $993722e8c7a9e5a7$export$1f48841962b828b1(window1, eventNameToWrap, wrapper) {
    if (!window1.RTCPeerConnection) return;
    var proto = window1.RTCPeerConnection.prototype;
    var nativeAddEventListener = proto.addEventListener;
    proto.addEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) return nativeAddEventListener.apply(this, arguments);
        var wrappedCallback = function(e) {
            var modifiedEvent = wrapper(e);
            if (modifiedEvent) {
                if (cb.handleEvent) cb.handleEvent(modifiedEvent);
                else cb(modifiedEvent);
            }
        };
        this._eventMap = this._eventMap || {};
        if (!this._eventMap[eventNameToWrap]) this._eventMap[eventNameToWrap] = new Map();
        this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
        return nativeAddEventListener.apply(this, [
            nativeEventName,
            wrappedCallback
        ]);
    };
    var nativeRemoveEventListener = proto.removeEventListener;
    proto.removeEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) return nativeRemoveEventListener.apply(this, arguments);
        if (!this._eventMap[eventNameToWrap].has(cb)) return nativeRemoveEventListener.apply(this, arguments);
        var unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
        this._eventMap[eventNameToWrap]["delete"](cb);
        if (this._eventMap[eventNameToWrap].size === 0) delete this._eventMap[eventNameToWrap];
        if (Object.keys(this._eventMap).length === 0) delete this._eventMap;
        return nativeRemoveEventListener.apply(this, [
            nativeEventName,
            unwrappedCb
        ]);
    };
    Object.defineProperty(proto, "on" + eventNameToWrap, {
        get: function() {
            return this["_on" + eventNameToWrap];
        },
        set: function(cb) {
            if (this["_on" + eventNameToWrap]) {
                this.removeEventListener(eventNameToWrap, this["_on" + eventNameToWrap]);
                delete this["_on" + eventNameToWrap];
            }
            if (cb) this.addEventListener(eventNameToWrap, this["_on" + eventNameToWrap] = cb);
        },
        enumerable: true,
        configurable: true
    });
}
function $993722e8c7a9e5a7$export$afbfee8cc06fd3e4(bool) {
    if (typeof bool !== "boolean") return new Error("Argument type: " + (typeof bool === "undefined" ? "undefined" : (0, $59a678b96ba8439d$export$2e2bcd8739ae039)(bool)) + ". Please use a boolean.");
    $993722e8c7a9e5a7$var$logDisabled_ = bool;
    return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
}
function $993722e8c7a9e5a7$export$51516be4b019e41e(bool) {
    if (typeof bool !== "boolean") return new Error("Argument type: " + (typeof bool === "undefined" ? "undefined" : (0, $59a678b96ba8439d$export$2e2bcd8739ae039)(bool)) + ". Please use a boolean.");
    $993722e8c7a9e5a7$var$deprecationWarnings_ = !bool;
    return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
}
function $993722e8c7a9e5a7$export$bef1f36f5486a6a3() {
    if (typeof window === "object") {
        if ($993722e8c7a9e5a7$var$logDisabled_) return;
        if (typeof console !== "undefined" && typeof console.log === "function") console.log.apply(console, arguments);
    }
}
function $993722e8c7a9e5a7$export$cdd73fc4100a6ef4(oldMethod, newMethod) {
    if (!$993722e8c7a9e5a7$var$deprecationWarnings_) return;
    console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
}
function $993722e8c7a9e5a7$export$2d31490a0c05f094(window1) {
    // Returned result object.
    var result = {
        browser: null,
        version: null
    };
    // Fail early if it's not a browser
    if (typeof window1 === "undefined" || !window1.navigator) {
        result.browser = "Not a browser.";
        return result;
    }
    var navigator = window1.navigator;
    if (navigator.mozGetUserMedia) {
        result.browser = "firefox";
        result.version = $993722e8c7a9e5a7$export$e3c02be309be1f23(navigator.userAgent, /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia || window1.isSecureContext === false && window1.webkitRTCPeerConnection) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        result.browser = "chrome";
        result.version = $993722e8c7a9e5a7$export$e3c02be309be1f23(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
    } else if (window1.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        result.browser = "safari";
        result.version = $993722e8c7a9e5a7$export$e3c02be309be1f23(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
        result.supportsUnifiedPlan = window1.RTCRtpTransceiver && "currentDirection" in window1.RTCRtpTransceiver.prototype;
    } else {
        result.browser = "Not a supported browser.";
        return result;
    }
    return result;
}
/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */ function $993722e8c7a9e5a7$var$isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
}
function $993722e8c7a9e5a7$export$15384eac40dc88c8(data) {
    if (!$993722e8c7a9e5a7$var$isObject(data)) return data;
    return Object.keys(data).reduce(function(accumulator, key) {
        var isObj = $993722e8c7a9e5a7$var$isObject(data[key]);
        var value = isObj ? $993722e8c7a9e5a7$export$15384eac40dc88c8(data[key]) : data[key];
        var isEmptyObject = isObj && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) return accumulator;
        return Object.assign(accumulator, (0, $44635a22a5de2b4c$export$2e2bcd8739ae039)({}, key, value));
    }, {});
}
function $993722e8c7a9e5a7$export$571b373e75babb58(stats, base, resultSet) {
    if (!base || resultSet.has(base.id)) return;
    resultSet.set(base.id, base);
    Object.keys(base).forEach(function(name) {
        if (name.endsWith("Id")) $993722e8c7a9e5a7$export$571b373e75babb58(stats, stats.get(base[name]), resultSet);
        else if (name.endsWith("Ids")) base[name].forEach(function(id) {
            $993722e8c7a9e5a7$export$571b373e75babb58(stats, stats.get(id), resultSet);
        });
    });
}
function $993722e8c7a9e5a7$export$93439ffc3f787d51(result, track, outbound) {
    var streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
    var filteredResult = new Map();
    if (track === null) return filteredResult;
    var trackStats = [];
    result.forEach(function(value) {
        if (value.type === "track" && value.trackIdentifier === track.id) trackStats.push(value);
    });
    trackStats.forEach(function(trackStat) {
        result.forEach(function(stats) {
            if (stats.type === streamStatsType && stats.trackId === trackStat.id) $993722e8c7a9e5a7$export$571b373e75babb58(result, stats, filteredResult);
        });
    });
    return filteredResult;
}


var $ef7fa8125ed93bad$exports = {};

$parcel$export($ef7fa8125ed93bad$exports, "shimMediaStream", function () { return $ef7fa8125ed93bad$export$33ee24e7a300bcd1; });
$parcel$export($ef7fa8125ed93bad$exports, "shimOnTrack", function () { return $ef7fa8125ed93bad$export$f358708f68ab068; });
$parcel$export($ef7fa8125ed93bad$exports, "shimGetSendersWithDtmf", function () { return $ef7fa8125ed93bad$export$a41a030a2842f5d6; });
$parcel$export($ef7fa8125ed93bad$exports, "shimGetStats", function () { return $ef7fa8125ed93bad$export$90608323826f0b17; });
$parcel$export($ef7fa8125ed93bad$exports, "shimSenderReceiverGetStats", function () { return $ef7fa8125ed93bad$export$f2f0f2338114eb4b; });
$parcel$export($ef7fa8125ed93bad$exports, "shimAddTrackRemoveTrackWithNative", function () { return $ef7fa8125ed93bad$export$30e3cdd46f8d5100; });
$parcel$export($ef7fa8125ed93bad$exports, "shimAddTrackRemoveTrack", function () { return $ef7fa8125ed93bad$export$9588259fcf4ebc91; });
$parcel$export($ef7fa8125ed93bad$exports, "shimPeerConnection", function () { return $ef7fa8125ed93bad$export$852a08dda9a55ea7; });
$parcel$export($ef7fa8125ed93bad$exports, "fixNegotiationNeeded", function () { return $ef7fa8125ed93bad$export$341293bbeaae37cb; });
$parcel$export($ef7fa8125ed93bad$exports, "shimGetUserMedia", function () { return $20aedc9b1b297154$export$1ed4910f4d37dc5e; });
$parcel$export($ef7fa8125ed93bad$exports, "shimGetDisplayMedia", function () { return $010acafe3c691bc6$export$97270b87351d9c04; });
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 
function $df58919c2014a615$export$2e2bcd8739ae039(arr) {
    if (Array.isArray(arr)) return arr;
}


function $ebec43925b514865$export$2e2bcd8739ae039(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}


function $41e2efd74a2a9a85$export$2e2bcd8739ae039() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


function $8e10d5387f51b551$export$2e2bcd8739ae039(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}


function $6842459d5565b742$export$2e2bcd8739ae039(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return (0, $8e10d5387f51b551$export$2e2bcd8739ae039)(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0, $8e10d5387f51b551$export$2e2bcd8739ae039)(o, minLen);
}


function $c235cd4828fc39e0$export$2e2bcd8739ae039(arr, i) {
    return (0, $df58919c2014a615$export$2e2bcd8739ae039)(arr) || (0, $ebec43925b514865$export$2e2bcd8739ae039)(arr, i) || (0, $6842459d5565b742$export$2e2bcd8739ae039)(arr, i) || (0, $41e2efd74a2a9a85$export$2e2bcd8739ae039)();
}



/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 
"use strict";
var $20aedc9b1b297154$var$logging = $993722e8c7a9e5a7$export$bef1f36f5486a6a3;
function $20aedc9b1b297154$export$1ed4910f4d37dc5e(window, browserDetails) {
    var navigator = window && window.navigator;
    if (!navigator.mediaDevices) return;
    var constraintsToChrome_ = function constraintsToChrome_(c) {
        if (typeof c !== "object" || c.mandatory || c.optional) return c;
        var cc = {};
        Object.keys(c).forEach(function(key) {
            if (key === "require" || key === "advanced" || key === "mediaSource") return;
            var r = typeof c[key] === "object" ? c[key] : {
                ideal: c[key]
            };
            if (r.exact !== undefined && typeof r.exact === "number") r.min = r.max = r.exact;
            var oldname_ = function oldname_(prefix, name) {
                if (prefix) return prefix + name.charAt(0).toUpperCase() + name.slice(1);
                return name === "deviceId" ? "sourceId" : name;
            };
            if (r.ideal !== undefined) {
                cc.optional = cc.optional || [];
                var oc = {};
                if (typeof r.ideal === "number") {
                    oc[oldname_("min", key)] = r.ideal;
                    cc.optional.push(oc);
                    oc = {};
                    oc[oldname_("max", key)] = r.ideal;
                    cc.optional.push(oc);
                } else {
                    oc[oldname_("", key)] = r.ideal;
                    cc.optional.push(oc);
                }
            }
            if (r.exact !== undefined && typeof r.exact !== "number") {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_("", key)] = r.exact;
            } else [
                "min",
                "max"
            ].forEach(function(mix) {
                if (r[mix] !== undefined) {
                    cc.mandatory = cc.mandatory || {};
                    cc.mandatory[oldname_(mix, key)] = r[mix];
                }
            });
        });
        if (c.advanced) cc.optional = (cc.optional || []).concat(c.advanced);
        return cc;
    };
    var shimConstraints_ = function shimConstraints_(constraints, func) {
        if (browserDetails.version >= 61) return func(constraints);
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && typeof constraints.audio === "object") {
            var remap = function remap(obj, a, b) {
                if (a in obj && !(b in obj)) {
                    obj[b] = obj[a];
                    delete obj[a];
                }
            };
            constraints = JSON.parse(JSON.stringify(constraints));
            remap(constraints.audio, "autoGainControl", "googAutoGainControl");
            remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
            constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && typeof constraints.video === "object") {
            // Shim facingMode for mobile & surface pro.
            var face = constraints.video.facingMode;
            face = face && (typeof face === "object" ? face : {
                ideal: face
            });
            var getSupportedFacingModeLies = browserDetails.version < 66;
            if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
                delete constraints.video.facingMode;
                var matches;
                if (face.exact === "environment" || face.ideal === "environment") matches = [
                    "back",
                    "rear"
                ];
                else if (face.exact === "user" || face.ideal === "user") matches = [
                    "front"
                ];
                if (matches) // Look for matches in label, or use last cam for back (typical).
                return navigator.mediaDevices.enumerateDevices().then(function(devices) {
                    devices = devices.filter(function(d) {
                        return d.kind === "videoinput";
                    });
                    var dev = devices.find(function(d) {
                        return matches.some(function(match) {
                            return d.label.toLowerCase().includes(match);
                        });
                    });
                    if (!dev && devices.length && matches.includes("back")) dev = devices[devices.length - 1]; // more likely the back cam
                    if (dev) constraints.video.deviceId = face.exact ? {
                        exact: dev.deviceId
                    } : {
                        ideal: dev.deviceId
                    };
                    constraints.video = constraintsToChrome_(constraints.video);
                    $20aedc9b1b297154$var$logging("chrome: " + JSON.stringify(constraints));
                    return func(constraints);
                });
            }
            constraints.video = constraintsToChrome_(constraints.video);
        }
        $20aedc9b1b297154$var$logging("chrome: " + JSON.stringify(constraints));
        return func(constraints);
    };
    var shimError_ = function shimError_(e) {
        if (browserDetails.version >= 64) return e;
        return {
            name: ({
                PermissionDeniedError: "NotAllowedError",
                PermissionDismissedError: "NotAllowedError",
                InvalidStateError: "NotAllowedError",
                DevicesNotFoundError: "NotFoundError",
                ConstraintNotSatisfiedError: "OverconstrainedError",
                TrackStartError: "NotReadableError",
                MediaDeviceFailedDueToShutdown: "NotAllowedError",
                MediaDeviceKillSwitchOn: "NotAllowedError",
                TabCaptureError: "AbortError",
                ScreenCaptureError: "AbortError",
                DeviceCaptureError: "AbortError"
            })[e.name] || e.name,
            message: e.message,
            constraint: e.constraint || e.constraintName,
            toString: function() {
                return this.name + (this.message && ": ") + this.message;
            }
        };
    };
    var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
        shimConstraints_(constraints, function(c) {
            navigator.webkitGetUserMedia(c, onSuccess, function(e) {
                if (onError) onError(shimError_(e));
            });
        });
    };
    navigator.getUserMedia = getUserMedia_.bind(navigator);
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    if (navigator.mediaDevices.getUserMedia) {
        var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(cs) {
            return shimConstraints_(cs, function(c) {
                return origGetUserMedia(c).then(function(stream) {
                    if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                        stream.getTracks().forEach(function(track) {
                            track.stop();
                        });
                        throw new DOMException("", "NotFoundError");
                    }
                    return stream;
                }, function(e) {
                    return Promise.reject(shimError_(e));
                });
            });
        };
    }
}


/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ "use strict";
function $010acafe3c691bc6$export$97270b87351d9c04(window, getSourceId) {
    if (window.navigator.mediaDevices && "getDisplayMedia" in window.navigator.mediaDevices) return;
    if (!window.navigator.mediaDevices) return;
    // getSourceId is a function that returns a promise resolving with
    // the sourceId of the screen/window/tab to be shared.
    if (typeof getSourceId !== "function") {
        console.error("shimGetDisplayMedia: getSourceId argument is not a function");
        return;
    }
    window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        return getSourceId(constraints).then(function(sourceId) {
            var widthSpecified = constraints.video && constraints.video.width;
            var heightSpecified = constraints.video && constraints.video.height;
            var frameRateSpecified = constraints.video && constraints.video.frameRate;
            constraints.video = {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: sourceId,
                    maxFrameRate: frameRateSpecified || 3
                }
            };
            if (widthSpecified) constraints.video.mandatory.maxWidth = widthSpecified;
            if (heightSpecified) constraints.video.mandatory.maxHeight = heightSpecified;
            return window.navigator.mediaDevices.getUserMedia(constraints);
        });
    };
}


"use strict";
function $ef7fa8125ed93bad$export$33ee24e7a300bcd1(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
}
function $ef7fa8125ed93bad$export$f358708f68ab068(window) {
    if (typeof window === "object" && window.RTCPeerConnection && !("ontrack" in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {
            get: function() {
                return this._ontrack;
            },
            set: function(f) {
                if (this._ontrack) this.removeEventListener("track", this._ontrack);
                this.addEventListener("track", this._ontrack = f);
            },
            enumerable: true,
            configurable: true
        });
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
            var _this = this;
            if (!this._ontrackpoly) {
                this._ontrackpoly = function(e) {
                    // onaddstream does not fire when a track is added to an existing
                    // stream. But stream.onaddtrack is implemented so we use that.
                    e.stream.addEventListener("addtrack", function(te) {
                        var receiver;
                        if (window.RTCPeerConnection.prototype.getReceivers) receiver = _this.getReceivers().find(function(r) {
                            return r.track && r.track.id === te.track.id;
                        });
                        else receiver = {
                            track: te.track
                        };
                        var event = new Event("track");
                        event.track = te.track;
                        event.receiver = receiver;
                        event.transceiver = {
                            receiver: receiver
                        };
                        event.streams = [
                            e.stream
                        ];
                        _this.dispatchEvent(event);
                    });
                    e.stream.getTracks().forEach(function(track) {
                        var receiver;
                        if (window.RTCPeerConnection.prototype.getReceivers) receiver = _this.getReceivers().find(function(r) {
                            return r.track && r.track.id === track.id;
                        });
                        else receiver = {
                            track: track
                        };
                        var event = new Event("track");
                        event.track = track;
                        event.receiver = receiver;
                        event.transceiver = {
                            receiver: receiver
                        };
                        event.streams = [
                            e.stream
                        ];
                        _this.dispatchEvent(event);
                    });
                };
                this.addEventListener("addstream", this._ontrackpoly);
            }
            return origSetRemoteDescription.apply(this, arguments);
        };
    } else // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    $993722e8c7a9e5a7$export$1f48841962b828b1(window, "track", function(e) {
        if (!e.transceiver) Object.defineProperty(e, "transceiver", {
            value: {
                receiver: e.receiver
            }
        });
        return e;
    });
}
function $ef7fa8125ed93bad$export$a41a030a2842f5d6(window) {
    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
    if (typeof window === "object" && window.RTCPeerConnection && !("getSenders" in window.RTCPeerConnection.prototype) && "createDTMFSender" in window.RTCPeerConnection.prototype) {
        var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
            return {
                track: track,
                get dtmf () {
                    if (this._dtmf === undefined) {
                        if (track.kind === "audio") this._dtmf = pc.createDTMFSender(track);
                        else this._dtmf = null;
                    }
                    return this._dtmf;
                },
                _pc: pc
            };
        };
        // augment addTrack when getSenders is not available.
        if (!window.RTCPeerConnection.prototype.getSenders) {
            window.RTCPeerConnection.prototype.getSenders = function getSenders() {
                this._senders = this._senders || [];
                return this._senders.slice(); // return a copy of the internal state.
            };
            var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
            window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
                var sender = origAddTrack.apply(this, arguments);
                if (!sender) {
                    sender = shimSenderWithDtmf(this, track);
                    this._senders.push(sender);
                }
                return sender;
            };
            var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
            window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
                origRemoveTrack.apply(this, arguments);
                var idx = this._senders.indexOf(sender);
                if (idx !== -1) this._senders.splice(idx, 1);
            };
        }
        var origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
            var _this = this;
            this._senders = this._senders || [];
            origAddStream.apply(this, [
                stream
            ]);
            stream.getTracks().forEach(function(track) {
                _this._senders.push(shimSenderWithDtmf(_this, track));
            });
        };
        var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
            var _this = this;
            this._senders = this._senders || [];
            origRemoveStream.apply(this, [
                stream
            ]);
            stream.getTracks().forEach(function(track) {
                var sender = _this._senders.find(function(s) {
                    return s.track === track;
                });
                if (sender) _this._senders.splice(_this._senders.indexOf(sender), 1);
            });
        };
    } else if (typeof window === "object" && window.RTCPeerConnection && "getSenders" in window.RTCPeerConnection.prototype && "createDTMFSender" in window.RTCPeerConnection.prototype && window.RTCRtpSender && !("dtmf" in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            var _this = this;
            var senders = origGetSenders.apply(this, []);
            senders.forEach(function(sender) {
                return sender._pc = _this;
            });
            return senders;
        };
        Object.defineProperty(window.RTCRtpSender.prototype, "dtmf", {
            get: function() {
                if (this._dtmf === undefined) {
                    if (this.track.kind === "audio") this._dtmf = this._pc.createDTMFSender(this.track);
                    else this._dtmf = null;
                }
                return this._dtmf;
            }
        });
    }
}
function $ef7fa8125ed93bad$export$90608323826f0b17(window) {
    if (!window.RTCPeerConnection) return;
    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
        var _this = this;
        var _arguments = (0, $c235cd4828fc39e0$export$2e2bcd8739ae039)(arguments, 3), selector = _arguments[0], onSucc = _arguments[1], onErr = _arguments[2];
        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
        if (arguments.length > 0 && typeof selector === "function") return origGetStats.apply(this, arguments);
        // When spec-style getStats is supported, return those when called with
        // either no arguments or the selector argument is null.
        if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== "function")) return origGetStats.apply(this, []);
        var fixChromeStats_ = function fixChromeStats_(response) {
            var standardReport = {};
            var reports = response.result();
            reports.forEach(function(report) {
                var standardStats = {
                    id: report.id,
                    timestamp: report.timestamp,
                    type: {
                        localcandidate: "local-candidate",
                        remotecandidate: "remote-candidate"
                    }[report.type] || report.type
                };
                report.names().forEach(function(name) {
                    standardStats[name] = report.stat(name);
                });
                standardReport[standardStats.id] = standardStats;
            });
            return standardReport;
        };
        // shim getStats with maplike support
        var makeMapStats = function makeMapStats(stats) {
            return new Map(Object.keys(stats).map(function(key) {
                return [
                    key,
                    stats[key]
                ];
            }));
        };
        if (arguments.length >= 2) {
            var successCallbackWrapper_ = function successCallbackWrapper_(response) {
                onSucc(makeMapStats(fixChromeStats_(response)));
            };
            return origGetStats.apply(this, [
                successCallbackWrapper_,
                selector
            ]);
        }
        // promise-support
        return new Promise(function(resolve, reject) {
            origGetStats.apply(_this, [
                function(response) {
                    resolve(makeMapStats(fixChromeStats_(response)));
                },
                reject
            ]);
        }).then(onSucc, onErr);
    };
}
function $ef7fa8125ed93bad$export$f2f0f2338114eb4b(window) {
    if (!(typeof window === "object" && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) return;
    // shim sender stats.
    if (!("getStats" in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            var _this = this;
            var senders = origGetSenders.apply(this, []);
            senders.forEach(function(sender) {
                return sender._pc = _this;
            });
            return senders;
        };
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) window.RTCPeerConnection.prototype.addTrack = function addTrack() {
            var sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
        };
        window.RTCRtpSender.prototype.getStats = function getStats() {
            var sender = this;
            return this._pc.getStats().then(function(result) {
                return(/* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */ $993722e8c7a9e5a7$export$93439ffc3f787d51(result, sender.track, true));
            });
        };
    }
    // shim receiver stats.
    if (!("getStats" in window.RTCRtpReceiver.prototype)) {
        var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
            var _this = this;
            var receivers = origGetReceivers.apply(this, []);
            receivers.forEach(function(receiver) {
                return receiver._pc = _this;
            });
            return receivers;
        };
        $993722e8c7a9e5a7$export$1f48841962b828b1(window, "track", function(e) {
            e.receiver._pc = e.srcElement;
            return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function getStats() {
            var receiver = this;
            return this._pc.getStats().then(function(result) {
                return $993722e8c7a9e5a7$export$93439ffc3f787d51(result, receiver.track, false);
            });
        };
    }
    if (!("getStats" in window.RTCRtpSender.prototype && "getStats" in window.RTCRtpReceiver.prototype)) return;
    // shim RTCPeerConnection.getStats(track).
    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
        if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
            var track = arguments[0];
            var sender;
            var receiver;
            var err;
            this.getSenders().forEach(function(s) {
                if (s.track === track) {
                    if (sender) err = true;
                    else sender = s;
                }
            });
            this.getReceivers().forEach(function(r) {
                if (r.track === track) {
                    if (receiver) err = true;
                    else receiver = r;
                }
                return r.track === track;
            });
            if (err || sender && receiver) return Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError"));
            else if (sender) return sender.getStats();
            else if (receiver) return receiver.getStats();
            return Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"));
        }
        return origGetStats.apply(this, arguments);
    };
}
function $ef7fa8125ed93bad$export$30e3cdd46f8d5100(window) {
    // shim addTrack/removeTrack with native variants in order to make
    // the interactions with legacy getLocalStreams behave as in other browsers.
    // Keeps a mapping stream.id => [stream, rtpsenders...]
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        var _this = this;
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        return Object.keys(this._shimmedLocalStreams).map(function(streamId) {
            return _this._shimmedLocalStreams[streamId][0];
        });
    };
    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        if (!stream) return origAddTrack.apply(this, arguments);
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        var sender = origAddTrack.apply(this, arguments);
        if (!this._shimmedLocalStreams[stream.id]) this._shimmedLocalStreams[stream.id] = [
            stream,
            sender
        ];
        else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) this._shimmedLocalStreams[stream.id].push(sender);
        return sender;
    };
    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this = this;
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        stream.getTracks().forEach(function(track) {
            var alreadyExists = _this.getSenders().find(function(s) {
                return s.track === track;
            });
            if (alreadyExists) throw new DOMException("Track already exists.", "InvalidAccessError");
        });
        var existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        var newSenders = this.getSenders().filter(function(newSender) {
            return existingSenders.indexOf(newSender) === -1;
        });
        this._shimmedLocalStreams[stream.id] = [
            stream
        ].concat(newSenders);
    };
    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        delete this._shimmedLocalStreams[stream.id];
        return origRemoveStream.apply(this, arguments);
    };
    var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
    window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        var _this = this;
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        if (sender) Object.keys(this._shimmedLocalStreams).forEach(function(streamId) {
            var idx = _this._shimmedLocalStreams[streamId].indexOf(sender);
            if (idx !== -1) _this._shimmedLocalStreams[streamId].splice(idx, 1);
            if (_this._shimmedLocalStreams[streamId].length === 1) delete _this._shimmedLocalStreams[streamId];
        });
        return origRemoveTrack.apply(this, arguments);
    };
}
function $ef7fa8125ed93bad$export$9588259fcf4ebc91(window, browserDetails) {
    var replaceInternalStreamId = // replace the internal stream id with the external one and
    // vice versa.
    function replaceInternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
            var externalStream = pc._reverseStreams[internalId];
            var internalStream = pc._streams[externalStream.id];
            sdp = sdp.replace(new RegExp(internalStream.id, "g"), externalStream.id);
        });
        return new RTCSessionDescription({
            type: description.type,
            sdp: sdp
        });
    };
    var replaceExternalStreamId = function replaceExternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
            var externalStream = pc._reverseStreams[internalId];
            var internalStream = pc._streams[externalStream.id];
            sdp = sdp.replace(new RegExp(externalStream.id, "g"), internalStream.id);
        });
        return new RTCSessionDescription({
            type: description.type,
            sdp: sdp
        });
    };
    if (!window.RTCPeerConnection) return;
    // shim addTrack and removeTrack.
    if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) return $ef7fa8125ed93bad$export$30e3cdd46f8d5100(window);
    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        var _this = this;
        var nativeStreams = origGetLocalStreams.apply(this);
        this._reverseStreams = this._reverseStreams || {};
        return nativeStreams.map(function(stream) {
            return _this._reverseStreams[stream.id];
        });
    };
    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this = this;
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        stream.getTracks().forEach(function(track) {
            var alreadyExists = _this.getSenders().find(function(s) {
                return s.track === track;
            });
            if (alreadyExists) throw new DOMException("Track already exists.", "InvalidAccessError");
        });
        // Add identity mapping for consistency with addTrack.
        // Unless this is being used with a stream from addTrack.
        if (!this._reverseStreams[stream.id]) {
            var newStream = new window.MediaStream(stream.getTracks());
            this._streams[stream.id] = newStream;
            this._reverseStreams[newStream.id] = stream;
            stream = newStream;
        }
        origAddStream.apply(this, [
            stream
        ]);
    };
    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        origRemoveStream.apply(this, [
            this._streams[stream.id] || stream
        ]);
        delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
        delete this._streams[stream.id];
    };
    window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        var _this = this;
        if (this.signalingState === "closed") throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
        var streams = [].slice.call(arguments, 1);
        if (streams.length !== 1 || !streams[0].getTracks().find(function(t) {
            return t === track;
        })) // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
        var alreadyExists = this.getSenders().find(function(s) {
            return s.track === track;
        });
        if (alreadyExists) throw new DOMException("Track already exists.", "InvalidAccessError");
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        var oldStream = this._streams[stream.id];
        if (oldStream) {
            // this is using odd Chrome behaviour, use with caution:
            // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
            // Note: we rely on the high-level addTrack/dtmf shim to
            // create the sender with a dtmf sender.
            oldStream.addTrack(track);
            // Trigger ONN async.
            Promise.resolve().then(function() {
                _this.dispatchEvent(new Event("negotiationneeded"));
            });
        } else {
            var newStream = new window.MediaStream([
                track
            ]);
            this._streams[stream.id] = newStream;
            this._reverseStreams[newStream.id] = stream;
            this.addStream(newStream);
        }
        return this.getSenders().find(function(s) {
            return s.track === track;
        });
    };
    [
        "createOffer",
        "createAnswer"
    ].forEach(function(method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        var methodObj = (0, $44635a22a5de2b4c$export$2e2bcd8739ae039)({}, method, function() {
            var _this = this;
            var args = arguments;
            var isLegacyCall = arguments.length && typeof arguments[0] === "function";
            if (isLegacyCall) return nativeMethod.apply(this, [
                function(description) {
                    var desc = replaceInternalStreamId(_this, description);
                    args[0].apply(null, [
                        desc
                    ]);
                },
                function(err) {
                    if (args[1]) args[1].apply(null, err);
                },
                arguments[2]
            ]);
            return nativeMethod.apply(this, arguments).then(function(description) {
                return replaceInternalStreamId(_this, description);
            });
        });
        window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
    var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
    window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        if (!arguments.length || !arguments[0].type) return origSetLocalDescription.apply(this, arguments);
        arguments[0] = replaceExternalStreamId(this, arguments[0]);
        return origSetLocalDescription.apply(this, arguments);
    };
    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier
    var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, "localDescription");
    Object.defineProperty(window.RTCPeerConnection.prototype, "localDescription", {
        get: function() {
            var description = origLocalDescription.get.apply(this);
            if (description.type === "") return description;
            return replaceInternalStreamId(this, description);
        }
    });
    window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        var _this = this;
        if (this.signalingState === "closed") throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
        // We can not yet check for sender instanceof RTCRtpSender
        // since we shim RTPSender. So we check if sender._pc is set.
        if (!sender._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
        var isLocal = sender._pc === this;
        if (!isLocal) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
        // Search for the native stream the senders track belongs to.
        this._streams = this._streams || {};
        var stream;
        Object.keys(this._streams).forEach(function(streamid) {
            var hasTrack = _this._streams[streamid].getTracks().find(function(track) {
                return sender.track === track;
            });
            if (hasTrack) stream = _this._streams[streamid];
        });
        if (stream) {
            if (stream.getTracks().length === 1) // if this is the last track of the stream, remove the stream. This
            // takes care of any shimmed _senders.
            this.removeStream(this._reverseStreams[stream.id]);
            else // relying on the same odd chrome behaviour as above.
            stream.removeTrack(sender.track);
            this.dispatchEvent(new Event("negotiationneeded"));
        }
    };
}
function $ef7fa8125ed93bad$export$852a08dda9a55ea7(window, browserDetails) {
    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
    if (!window.RTCPeerConnection) return;
    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    if (browserDetails.version < 53) [
        "setLocalDescription",
        "setRemoteDescription",
        "addIceCandidate"
    ].forEach(function(method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        var methodObj = (0, $44635a22a5de2b4c$export$2e2bcd8739ae039)({}, method, function() {
            arguments[0] = new (method === "addIceCandidate" ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
        });
        window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
}
function $ef7fa8125ed93bad$export$341293bbeaae37cb(window, browserDetails) {
    $993722e8c7a9e5a7$export$1f48841962b828b1(window, "negotiationneeded", function(e) {
        var pc = e.target;
        if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === "plan-b") {
            if (pc.signalingState !== "stable") return;
        }
        return e;
    });
}


var $f7879eae6ce316c3$exports = {};

$parcel$export($f7879eae6ce316c3$exports, "shimOnTrack", function () { return $f7879eae6ce316c3$export$f358708f68ab068; });
$parcel$export($f7879eae6ce316c3$exports, "shimPeerConnection", function () { return $f7879eae6ce316c3$export$852a08dda9a55ea7; });
$parcel$export($f7879eae6ce316c3$exports, "shimSenderGetStats", function () { return $f7879eae6ce316c3$export$f0525502095c04ef; });
$parcel$export($f7879eae6ce316c3$exports, "shimReceiverGetStats", function () { return $f7879eae6ce316c3$export$83d69126527b1171; });
$parcel$export($f7879eae6ce316c3$exports, "shimRemoveStream", function () { return $f7879eae6ce316c3$export$825e523ef749bd8c; });
$parcel$export($f7879eae6ce316c3$exports, "shimRTCDataChannel", function () { return $f7879eae6ce316c3$export$ff9cb3bc8990e8f7; });
$parcel$export($f7879eae6ce316c3$exports, "shimAddTransceiver", function () { return $f7879eae6ce316c3$export$70c77533b6e9908d; });
$parcel$export($f7879eae6ce316c3$exports, "shimGetParameters", function () { return $f7879eae6ce316c3$export$66238223c298fbaa; });
$parcel$export($f7879eae6ce316c3$exports, "shimCreateOffer", function () { return $f7879eae6ce316c3$export$51beccf0e777b843; });
$parcel$export($f7879eae6ce316c3$exports, "shimCreateAnswer", function () { return $f7879eae6ce316c3$export$df0b46e7cef08150; });
$parcel$export($f7879eae6ce316c3$exports, "shimGetUserMedia", function () { return $ff944220a0d9cb56$export$1ed4910f4d37dc5e; });
$parcel$export($f7879eae6ce316c3$exports, "shimGetDisplayMedia", function () { return $3b086a053fdafaab$export$97270b87351d9c04; });
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 


function $1eff69d19102cef4$export$2e2bcd8739ae039(arr) {
    if (Array.isArray(arr)) return (0, $8e10d5387f51b551$export$2e2bcd8739ae039)(arr);
}



function $3ba757588a0f03e6$export$2e2bcd8739ae039() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}



function $2964a74df30860a5$export$2e2bcd8739ae039(arr) {
    return (0, $1eff69d19102cef4$export$2e2bcd8739ae039)(arr) || (0, $ebec43925b514865$export$2e2bcd8739ae039)(arr) || (0, $6842459d5565b742$export$2e2bcd8739ae039)(arr) || (0, $3ba757588a0f03e6$export$2e2bcd8739ae039)();
}



/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 
"use strict";
function $ff944220a0d9cb56$export$1ed4910f4d37dc5e(window, browserDetails) {
    var navigator = window && window.navigator;
    var MediaStreamTrack = window && window.MediaStreamTrack;
    navigator.getUserMedia = function(constraints, onSuccess, onError) {
        // Replace Firefox 44+'s deprecation warning with unprefixed version.
        $993722e8c7a9e5a7$export$cdd73fc4100a6ef4("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia");
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    };
    if (!(browserDetails.version > 55 && "autoGainControl" in navigator.mediaDevices.getSupportedConstraints())) {
        var remap = function remap(obj, a, b) {
            if (a in obj && !(b in obj)) {
                obj[b] = obj[a];
                delete obj[a];
            }
        };
        var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(c) {
            if (typeof c === "object" && typeof c.audio === "object") {
                c = JSON.parse(JSON.stringify(c));
                remap(c.audio, "autoGainControl", "mozAutoGainControl");
                remap(c.audio, "noiseSuppression", "mozNoiseSuppression");
            }
            return nativeGetUserMedia(c);
        };
        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
            var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
            MediaStreamTrack.prototype.getSettings = function() {
                var obj = nativeGetSettings.apply(this, arguments);
                remap(obj, "mozAutoGainControl", "autoGainControl");
                remap(obj, "mozNoiseSuppression", "noiseSuppression");
                return obj;
            };
        }
        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
            var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
            MediaStreamTrack.prototype.applyConstraints = function(c) {
                if (this.kind === "audio" && typeof c === "object") {
                    c = JSON.parse(JSON.stringify(c));
                    remap(c, "autoGainControl", "mozAutoGainControl");
                    remap(c, "noiseSuppression", "mozNoiseSuppression");
                }
                return nativeApplyConstraints.apply(this, [
                    c
                ]);
            };
        }
    }
}


/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ "use strict";
function $3b086a053fdafaab$export$97270b87351d9c04(window, preferredMediaSource) {
    if (window.navigator.mediaDevices && "getDisplayMedia" in window.navigator.mediaDevices) return;
    if (!window.navigator.mediaDevices) return;
    window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        if (!(constraints && constraints.video)) {
            var err = new DOMException("getDisplayMedia without video constraints is undefined");
            err.name = "NotFoundError";
            // from https://heycam.github.io/webidl/#idl-DOMException-error-names
            err.code = 8;
            return Promise.reject(err);
        }
        if (constraints.video === true) constraints.video = {
            mediaSource: preferredMediaSource
        };
        else constraints.video.mediaSource = preferredMediaSource;
        return window.navigator.mediaDevices.getUserMedia(constraints);
    };
}


"use strict";
function $f7879eae6ce316c3$export$f358708f68ab068(window) {
    if (typeof window === "object" && window.RTCTrackEvent && "receiver" in window.RTCTrackEvent.prototype && !("transceiver" in window.RTCTrackEvent.prototype)) Object.defineProperty(window.RTCTrackEvent.prototype, "transceiver", {
        get: function() {
            return {
                receiver: this.receiver
            };
        }
    });
}
function $f7879eae6ce316c3$export$852a08dda9a55ea7(window, browserDetails) {
    if (typeof window !== "object" || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) return; // probably media.peerconnection.enabled=false in about:config
    if (!window.RTCPeerConnection && window.mozRTCPeerConnection) // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
    if (browserDetails.version < 53) // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    [
        "setLocalDescription",
        "setRemoteDescription",
        "addIceCandidate"
    ].forEach(function(method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        var methodObj = (0, $44635a22a5de2b4c$export$2e2bcd8739ae039)({}, method, function() {
            arguments[0] = new (method === "addIceCandidate" ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
        });
        window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
    var modernStatsTypes = {
        inboundrtp: "inbound-rtp",
        outboundrtp: "outbound-rtp",
        candidatepair: "candidate-pair",
        localcandidate: "local-candidate",
        remotecandidate: "remote-candidate"
    };
    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
        var _arguments = (0, $c235cd4828fc39e0$export$2e2bcd8739ae039)(arguments, 3), selector = _arguments[0], onSucc = _arguments[1], onErr = _arguments[2];
        return nativeGetStats.apply(this, [
            selector || null
        ]).then(function(stats) {
            if (browserDetails.version < 53 && !onSucc) // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
                stats.forEach(function(stat) {
                    stat.type = modernStatsTypes[stat.type] || stat.type;
                });
            } catch (e) {
                if (e.name !== "TypeError") throw e;
                // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
                stats.forEach(function(stat, i) {
                    stats.set(i, Object.assign({}, stat, {
                        type: modernStatsTypes[stat.type] || stat.type
                    }));
                });
            }
            return stats;
        }).then(onSucc, onErr);
    };
}
function $f7879eae6ce316c3$export$f0525502095c04ef(window) {
    if (!(typeof window === "object" && window.RTCPeerConnection && window.RTCRtpSender)) return;
    if (window.RTCRtpSender && "getStats" in window.RTCRtpSender.prototype) return;
    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        var _this = this;
        var senders = origGetSenders.apply(this, []);
        senders.forEach(function(sender) {
            return sender._pc = _this;
        });
        return senders;
    };
    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        var sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
    };
    window.RTCRtpSender.prototype.getStats = function getStats() {
        return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
    };
}
function $f7879eae6ce316c3$export$83d69126527b1171(window) {
    if (!(typeof window === "object" && window.RTCPeerConnection && window.RTCRtpSender)) return;
    if (window.RTCRtpSender && "getStats" in window.RTCRtpReceiver.prototype) return;
    var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        var _this = this;
        var receivers = origGetReceivers.apply(this, []);
        receivers.forEach(function(receiver) {
            return receiver._pc = _this;
        });
        return receivers;
    };
    $993722e8c7a9e5a7$export$1f48841962b828b1(window, "track", function(e) {
        e.receiver._pc = e.srcElement;
        return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
        return this._pc.getStats(this.track);
    };
}
function $f7879eae6ce316c3$export$825e523ef749bd8c(window) {
    if (!window.RTCPeerConnection || "removeStream" in window.RTCPeerConnection.prototype) return;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        var _this = this;
        $993722e8c7a9e5a7$export$cdd73fc4100a6ef4("removeStream", "removeTrack");
        this.getSenders().forEach(function(sender) {
            if (sender.track && stream.getTracks().includes(sender.track)) _this.removeTrack(sender);
        });
    };
}
function $f7879eae6ce316c3$export$ff9cb3bc8990e8f7(window) {
    // rename DataChannel to RTCDataChannel (native fix in FF60):
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
    if (window.DataChannel && !window.RTCDataChannel) window.RTCDataChannel = window.DataChannel;
}
function $f7879eae6ce316c3$export$70c77533b6e9908d(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === "object" && window.RTCPeerConnection)) return;
    var origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
    if (origAddTransceiver) window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
        this.setParametersPromises = [];
        // WebIDL input coercion and validation
        var sendEncodings = arguments[1] && arguments[1].sendEncodings;
        if (sendEncodings === undefined) sendEncodings = [];
        sendEncodings = (0, $2964a74df30860a5$export$2e2bcd8739ae039)(sendEncodings);
        var shouldPerformCheck = sendEncodings.length > 0;
        if (shouldPerformCheck) // If sendEncodings params are provided, validate grammar
        sendEncodings.forEach(function(encodingParam) {
            if ("rid" in encodingParam) {
                var ridRegex = /^[a-z0-9]{0,16}$/i;
                if (!ridRegex.test(encodingParam.rid)) throw new TypeError("Invalid RID value provided.");
            }
            if ("scaleResolutionDownBy" in encodingParam) {
                if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) throw new RangeError("scale_resolution_down_by must be >= 1.0");
            }
            if ("maxFramerate" in encodingParam) {
                if (!(parseFloat(encodingParam.maxFramerate) >= 0)) throw new RangeError("max_framerate must be >= 0.0");
            }
        });
        var transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
            // Check if the init options were applied. If not we do this in an
            // asynchronous way and save the promise reference in a global object.
            // This is an ugly hack, but at the same time is way more robust than
            // checking the sender parameters before and after the createOffer
            // Also note that after the createoffer we are not 100% sure that
            // the params were asynchronously applied so we might miss the
            // opportunity to recreate offer.
            var sender = transceiver.sender;
            var params = sender.getParameters();
            if (!("encodings" in params) || // Avoid being fooled by patched getParameters() below.
            params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
                params.encodings = sendEncodings;
                sender.sendEncodings = sendEncodings;
                this.setParametersPromises.push(sender.setParameters(params).then(function() {
                    delete sender.sendEncodings;
                })["catch"](function() {
                    delete sender.sendEncodings;
                }));
            }
        }
        return transceiver;
    };
}
function $f7879eae6ce316c3$export$66238223c298fbaa(window) {
    if (!(typeof window === "object" && window.RTCRtpSender)) return;
    var origGetParameters = window.RTCRtpSender.prototype.getParameters;
    if (origGetParameters) window.RTCRtpSender.prototype.getParameters = function getParameters() {
        var params = origGetParameters.apply(this, arguments);
        if (!("encodings" in params)) params.encodings = [].concat(this.sendEncodings || [
            {}
        ]);
        return params;
    };
}
function $f7879eae6ce316c3$export$51beccf0e777b843(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === "object" && window.RTCPeerConnection)) return;
    var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer() {
        var _this = this;
        if (this.setParametersPromises && this.setParametersPromises.length) return Promise.all(this.setParametersPromises).then(function() {
            return origCreateOffer.apply(_this, arguments);
        })["finally"](function() {
            _this.setParametersPromises = [];
        });
        return origCreateOffer.apply(this, arguments);
    };
}
function $f7879eae6ce316c3$export$df0b46e7cef08150(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === "object" && window.RTCPeerConnection)) return;
    var origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
    window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
        var _this = this;
        if (this.setParametersPromises && this.setParametersPromises.length) return Promise.all(this.setParametersPromises).then(function() {
            return origCreateAnswer.apply(_this, arguments);
        })["finally"](function() {
            _this.setParametersPromises = [];
        });
        return origCreateAnswer.apply(this, arguments);
    };
}


var $b5603e2a25579e83$exports = {};

$parcel$export($b5603e2a25579e83$exports, "shimLocalStreamsAPI", function () { return $b5603e2a25579e83$export$8df41282f4fdcea2; });
$parcel$export($b5603e2a25579e83$exports, "shimRemoteStreamsAPI", function () { return $b5603e2a25579e83$export$762aa4cbb4f2f857; });
$parcel$export($b5603e2a25579e83$exports, "shimCallbacksAPI", function () { return $b5603e2a25579e83$export$da31df245debdd3; });
$parcel$export($b5603e2a25579e83$exports, "shimGetUserMedia", function () { return $b5603e2a25579e83$export$1ed4910f4d37dc5e; });
$parcel$export($b5603e2a25579e83$exports, "shimConstraints", function () { return $b5603e2a25579e83$export$494a01ac68ba81ac; });
$parcel$export($b5603e2a25579e83$exports, "shimRTCIceServerUrls", function () { return $b5603e2a25579e83$export$671a8b47b41b6f41; });
$parcel$export($b5603e2a25579e83$exports, "shimTrackEventTransceiver", function () { return $b5603e2a25579e83$export$85d53da088cb1b14; });
$parcel$export($b5603e2a25579e83$exports, "shimCreateOfferLegacy", function () { return $b5603e2a25579e83$export$d444266503fdd2d4; });
$parcel$export($b5603e2a25579e83$exports, "shimAudioContext", function () { return $b5603e2a25579e83$export$857cd739a7b795d2; });
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ 
"use strict";
function $b5603e2a25579e83$export$8df41282f4fdcea2(window) {
    if (typeof window !== "object" || !window.RTCPeerConnection) return;
    if (!("getLocalStreams" in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        if (!this._localStreams) this._localStreams = [];
        return this._localStreams;
    };
    if (!("addStream" in window.RTCPeerConnection.prototype)) {
        var _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
            var _this = this;
            if (!this._localStreams) this._localStreams = [];
            if (!this._localStreams.includes(stream)) this._localStreams.push(stream);
            // Try to emulate Chrome's behaviour of adding in audio-video order.
            // Safari orders by track id.
            stream.getAudioTracks().forEach(function(track) {
                return _addTrack.call(_this, track, stream);
            });
            stream.getVideoTracks().forEach(function(track) {
                return _addTrack.call(_this, track, stream);
            });
        };
        window.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
            for(var _len = arguments.length, streams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                streams[_key - 1] = arguments[_key];
            }
            var _this = this;
            if (streams) streams.forEach(function(stream) {
                if (!_this._localStreams) _this._localStreams = [
                    stream
                ];
                else if (!_this._localStreams.includes(stream)) _this._localStreams.push(stream);
            });
            return _addTrack.apply(this, arguments);
        };
    }
    if (!("removeStream" in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        var _this = this;
        if (!this._localStreams) this._localStreams = [];
        var index = this._localStreams.indexOf(stream);
        if (index === -1) return;
        this._localStreams.splice(index, 1);
        var tracks = stream.getTracks();
        this.getSenders().forEach(function(sender) {
            if (tracks.includes(sender.track)) _this.removeTrack(sender);
        });
    };
}
function $b5603e2a25579e83$export$762aa4cbb4f2f857(window) {
    if (typeof window !== "object" || !window.RTCPeerConnection) return;
    if (!("getRemoteStreams" in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
    };
    if (!("onaddstream" in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, "onaddstream", {
            get: function() {
                return this._onaddstream;
            },
            set: function(f) {
                var _this = this;
                if (this._onaddstream) {
                    this.removeEventListener("addstream", this._onaddstream);
                    this.removeEventListener("track", this._onaddstreampoly);
                }
                this.addEventListener("addstream", this._onaddstream = f);
                this.addEventListener("track", this._onaddstreampoly = function(e) {
                    e.streams.forEach(function(stream) {
                        if (!_this._remoteStreams) _this._remoteStreams = [];
                        if (_this._remoteStreams.includes(stream)) return;
                        _this._remoteStreams.push(stream);
                        var event = new Event("addstream");
                        event.stream = stream;
                        _this.dispatchEvent(event);
                    });
                });
            }
        });
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
            var pc = this;
            if (!this._onaddstreampoly) this.addEventListener("track", this._onaddstreampoly = function(e) {
                e.streams.forEach(function(stream) {
                    if (!pc._remoteStreams) pc._remoteStreams = [];
                    if (pc._remoteStreams.indexOf(stream) >= 0) return;
                    pc._remoteStreams.push(stream);
                    var event = new Event("addstream");
                    event.stream = stream;
                    pc.dispatchEvent(event);
                });
            });
            return origSetRemoteDescription.apply(pc, arguments);
        };
    }
}
function $b5603e2a25579e83$export$da31df245debdd3(window) {
    if (typeof window !== "object" || !window.RTCPeerConnection) return;
    var prototype = window.RTCPeerConnection.prototype;
    var origCreateOffer = prototype.createOffer;
    var origCreateAnswer = prototype.createAnswer;
    var setLocalDescription = prototype.setLocalDescription;
    var setRemoteDescription = prototype.setRemoteDescription;
    var addIceCandidate = prototype.addIceCandidate;
    prototype.createOffer = function createOffer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateOffer.apply(this, [
            options
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateAnswer.apply(this, [
            options
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    var withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setLocalDescription.apply(this, [
            description
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;
    withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setRemoteDescription.apply(this, [
            description
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;
    withCallback = function withCallback(candidate, successCallback, failureCallback) {
        var promise = addIceCandidate.apply(this, [
            candidate
        ]);
        if (!failureCallback) return promise;
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
}
function $b5603e2a25579e83$export$1ed4910f4d37dc5e(window) {
    var navigator = window && window.navigator;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // shim not needed in Safari 12.1
        var mediaDevices = navigator.mediaDevices;
        var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = function(constraints) {
            return _getUserMedia($b5603e2a25579e83$export$494a01ac68ba81ac(constraints));
        };
    }
    if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) navigator.getUserMedia = (function getUserMedia(constraints, cb, errcb) {
        navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
    }).bind(navigator);
}
function $b5603e2a25579e83$export$494a01ac68ba81ac(constraints) {
    if (constraints && constraints.video !== undefined) return Object.assign({}, constraints, {
        video: $993722e8c7a9e5a7$export$15384eac40dc88c8(constraints.video)
    });
    return constraints;
}
function $b5603e2a25579e83$export$671a8b47b41b6f41(window) {
    if (!window.RTCPeerConnection) return;
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    var OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
            var newIceServers = [];
            for(var i = 0; i < pcConfig.iceServers.length; i++){
                var server = pcConfig.iceServers[i];
                if (server.urls === undefined && server.url) {
                    $993722e8c7a9e5a7$export$cdd73fc4100a6ef4("RTCIceServer.url", "RTCIceServer.urls");
                    server = JSON.parse(JSON.stringify(server));
                    server.urls = server.url;
                    delete server.url;
                    newIceServers.push(server);
                } else newIceServers.push(pcConfig.iceServers[i]);
            }
            pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    if ("generateCertificate" in OrigPeerConnection) Object.defineProperty(window.RTCPeerConnection, "generateCertificate", {
        get: function() {
            return OrigPeerConnection.generateCertificate;
        }
    });
}
function $b5603e2a25579e83$export$85d53da088cb1b14(window) {
    // Add event.transceiver member over deprecated event.receiver
    if (typeof window === "object" && window.RTCTrackEvent && "receiver" in window.RTCTrackEvent.prototype && !("transceiver" in window.RTCTrackEvent.prototype)) Object.defineProperty(window.RTCTrackEvent.prototype, "transceiver", {
        get: function() {
            return {
                receiver: this.receiver
            };
        }
    });
}
function $b5603e2a25579e83$export$d444266503fdd2d4(window) {
    var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
        if (offerOptions) {
            if (typeof offerOptions.offerToReceiveAudio !== "undefined") // support bit values
            offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
            var audioTransceiver = this.getTransceivers().find(function(transceiver) {
                return transceiver.receiver.track.kind === "audio";
            });
            if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
                if (audioTransceiver.direction === "sendrecv") {
                    if (audioTransceiver.setDirection) audioTransceiver.setDirection("sendonly");
                    else audioTransceiver.direction = "sendonly";
                } else if (audioTransceiver.direction === "recvonly") {
                    if (audioTransceiver.setDirection) audioTransceiver.setDirection("inactive");
                    else audioTransceiver.direction = "inactive";
                }
            } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) this.addTransceiver("audio", {
                direction: "recvonly"
            });
            if (typeof offerOptions.offerToReceiveVideo !== "undefined") // support bit values
            offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
            var videoTransceiver = this.getTransceivers().find(function(transceiver) {
                return transceiver.receiver.track.kind === "video";
            });
            if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
                if (videoTransceiver.direction === "sendrecv") {
                    if (videoTransceiver.setDirection) videoTransceiver.setDirection("sendonly");
                    else videoTransceiver.direction = "sendonly";
                } else if (videoTransceiver.direction === "recvonly") {
                    if (videoTransceiver.setDirection) videoTransceiver.setDirection("inactive");
                    else videoTransceiver.direction = "inactive";
                }
            } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) this.addTransceiver("video", {
                direction: "recvonly"
            });
        }
        return origCreateOffer.apply(this, arguments);
    };
}
function $b5603e2a25579e83$export$857cd739a7b795d2(window) {
    if (typeof window !== "object" || window.AudioContext) return;
    window.AudioContext = window.webkitAudioContext;
}


var $1e725cbbdf747411$exports = {};

$parcel$export($1e725cbbdf747411$exports, "shimRTCIceCandidate", function () { return $1e725cbbdf747411$export$cf133661e444ccfe; });
$parcel$export($1e725cbbdf747411$exports, "shimRTCIceCandidateRelayProtocol", function () { return $1e725cbbdf747411$export$fdafb8d8280e29b5; });
$parcel$export($1e725cbbdf747411$exports, "shimMaxMessageSize", function () { return $1e725cbbdf747411$export$a99147c78a56edc4; });
$parcel$export($1e725cbbdf747411$exports, "shimSendThrowTypeError", function () { return $1e725cbbdf747411$export$d461c8d5c5db5da7; });
$parcel$export($1e725cbbdf747411$exports, "shimConnectionState", function () { return $1e725cbbdf747411$export$63bb816cc75460; });
$parcel$export($1e725cbbdf747411$exports, "removeExtmapAllowMixed", function () { return $1e725cbbdf747411$export$a57d114344295149; });
$parcel$export($1e725cbbdf747411$exports, "shimAddIceCandidateNullOrEmpty", function () { return $1e725cbbdf747411$export$51d5e40b48c771c7; });
$parcel$export($1e725cbbdf747411$exports, "shimParameterlessSetLocalDescription", function () { return $1e725cbbdf747411$export$7170d04e59f9d553; });
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ var $b2727632138354b2$exports = {};
/* eslint-env node */ "use strict";
// SDP helpers.
var $b2727632138354b2$var$SDPUtils = {};
// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
$b2727632138354b2$var$SDPUtils.generateIdentifier = function() {
    return Math.random().toString(36).substring(2, 12);
};
// The RTCP CNAME used by all peerconnections from the same JS.
$b2727632138354b2$var$SDPUtils.localCName = $b2727632138354b2$var$SDPUtils.generateIdentifier();
// Splits SDP into lines, dealing with both CRLF and LF.
$b2727632138354b2$var$SDPUtils.splitLines = function(blob) {
    return blob.trim().split("\n").map(function(line) {
        return line.trim();
    });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
$b2727632138354b2$var$SDPUtils.splitSections = function(blob) {
    var parts = blob.split("\nm=");
    return parts.map(function(part, index) {
        return (index > 0 ? "m=" + part : part).trim() + "\r\n";
    });
};
// Returns the session description.
$b2727632138354b2$var$SDPUtils.getDescription = function(blob) {
    var sections = $b2727632138354b2$var$SDPUtils.splitSections(blob);
    return sections && sections[0];
};
// Returns the individual media sections.
$b2727632138354b2$var$SDPUtils.getMediaSections = function(blob) {
    var sections = $b2727632138354b2$var$SDPUtils.splitSections(blob);
    sections.shift();
    return sections;
};
// Returns lines that start with a certain prefix.
$b2727632138354b2$var$SDPUtils.matchPrefix = function(blob, prefix) {
    return $b2727632138354b2$var$SDPUtils.splitLines(blob).filter(function(line) {
        return line.indexOf(prefix) === 0;
    });
};
// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
// Input can be prefixed with a=.
$b2727632138354b2$var$SDPUtils.parseCandidate = function(line) {
    var parts;
    // Parse both variants.
    if (line.indexOf("a=candidate:") === 0) parts = line.substring(12).split(" ");
    else parts = line.substring(10).split(" ");
    var candidate = {
        foundation: parts[0],
        component: {
            1: "rtp",
            2: "rtcp"
        }[parts[1]] || parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4],
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
    };
    for(var i = 8; i < parts.length; i += 2)switch(parts[i]){
        case "raddr":
            candidate.relatedAddress = parts[i + 1];
            break;
        case "rport":
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
        case "tcptype":
            candidate.tcpType = parts[i + 1];
            break;
        case "ufrag":
            candidate.ufrag = parts[i + 1]; // for backward compatibility.
            candidate.usernameFragment = parts[i + 1];
            break;
        default:
            if (candidate[parts[i]] === undefined) candidate[parts[i]] = parts[i + 1];
            break;
    }
    return candidate;
};
// Translates a candidate object into SDP candidate attribute.
// This does not include the a= prefix!
$b2727632138354b2$var$SDPUtils.writeCandidate = function(candidate) {
    var sdp = [];
    sdp.push(candidate.foundation);
    var component = candidate.component;
    if (component === "rtp") sdp.push(1);
    else if (component === "rtcp") sdp.push(2);
    else sdp.push(component);
    sdp.push(candidate.protocol.toUpperCase());
    sdp.push(candidate.priority);
    sdp.push(candidate.address || candidate.ip);
    sdp.push(candidate.port);
    var type = candidate.type;
    sdp.push("typ");
    sdp.push(type);
    if (type !== "host" && candidate.relatedAddress && candidate.relatedPort) {
        sdp.push("raddr");
        sdp.push(candidate.relatedAddress);
        sdp.push("rport");
        sdp.push(candidate.relatedPort);
    }
    if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
        sdp.push("tcptype");
        sdp.push(candidate.tcpType);
    }
    if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push("ufrag");
        sdp.push(candidate.usernameFragment || candidate.ufrag);
    }
    return "candidate:" + sdp.join(" ");
};
// Parses an ice-options line, returns an array of option tags.
// Sample input:
// a=ice-options:foo bar
$b2727632138354b2$var$SDPUtils.parseIceOptions = function(line) {
    return line.substring(14).split(" ");
};
// Parses a rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
$b2727632138354b2$var$SDPUtils.parseRtpMap = function(line) {
    var parts = line.substring(9).split(" ");
    var parsed = {
        payloadType: parseInt(parts.shift(), 10)
    };
    parts = parts[0].split("/");
    parsed.name = parts[0];
    parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
    parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
    // legacy alias, got renamed back to channels in ORTC.
    parsed.numChannels = parsed.channels;
    return parsed;
};
// Generates a rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
$b2727632138354b2$var$SDPUtils.writeRtpMap = function(codec) {
    var pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) pt = codec.preferredPayloadType;
    var channels = codec.channels || codec.numChannels || 1;
    return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (channels !== 1 ? "/" + channels : "") + "\r\n";
};
// Parses a extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
$b2727632138354b2$var$SDPUtils.parseExtmap = function(line) {
    var parts = line.substring(9).split(" ");
    return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv",
        uri: parts[1],
        attributes: parts.slice(2).join(" ")
    };
};
// Generates an extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
$b2727632138354b2$var$SDPUtils.writeExtmap = function(headerExtension) {
    return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== "sendrecv" ? "/" + headerExtension.direction : "") + " " + headerExtension.uri + (headerExtension.attributes ? " " + headerExtension.attributes : "") + "\r\n";
};
// Parses a fmtp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
$b2727632138354b2$var$SDPUtils.parseFmtp = function(line) {
    var parsed = {};
    var kv;
    var parts = line.substring(line.indexOf(" ") + 1).split(";");
    for(var j = 0; j < parts.length; j++){
        kv = parts[j].trim().split("=");
        parsed[kv[0].trim()] = kv[1];
    }
    return parsed;
};
// Generates a fmtp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
$b2727632138354b2$var$SDPUtils.writeFmtp = function(codec) {
    var line = "";
    var pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) pt = codec.preferredPayloadType;
    if (codec.parameters && Object.keys(codec.parameters).length) {
        var params = [];
        Object.keys(codec.parameters).forEach(function(param) {
            if (codec.parameters[param] !== undefined) params.push(param + "=" + codec.parameters[param]);
            else params.push(param);
        });
        line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n";
    }
    return line;
};
// Parses a rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
$b2727632138354b2$var$SDPUtils.parseRtcpFb = function(line) {
    var parts = line.substring(line.indexOf(" ") + 1).split(" ");
    return {
        type: parts.shift(),
        parameter: parts.join(" ")
    };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
$b2727632138354b2$var$SDPUtils.writeRtcpFb = function(codec) {
    var lines = "";
    var pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) pt = codec.preferredPayloadType;
    if (codec.rtcpFeedback && codec.rtcpFeedback.length) // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
        lines += "a=rtcp-fb:" + pt + " " + fb.type + (fb.parameter && fb.parameter.length ? " " + fb.parameter : "") + "\r\n";
    });
    return lines;
};
// Parses a RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
$b2727632138354b2$var$SDPUtils.parseSsrcMedia = function(line) {
    var sp = line.indexOf(" ");
    var parts = {
        ssrc: parseInt(line.substring(7, sp), 10)
    };
    var colon = line.indexOf(":", sp);
    if (colon > -1) {
        parts.attribute = line.substring(sp + 1, colon);
        parts.value = line.substring(colon + 1);
    } else parts.attribute = line.substring(sp + 1);
    return parts;
};
// Parse a ssrc-group line (see RFC 5576). Sample input:
// a=ssrc-group:semantics 12 34
$b2727632138354b2$var$SDPUtils.parseSsrcGroup = function(line) {
    var parts = line.substring(13).split(" ");
    return {
        semantics: parts.shift(),
        ssrcs: parts.map(function(ssrc) {
            return parseInt(ssrc, 10);
        })
    };
};
// Extracts the MID (RFC 5888) from a media section.
// Returns the MID or undefined if no mid line was found.
$b2727632138354b2$var$SDPUtils.getMid = function(mediaSection) {
    var mid = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=mid:")[0];
    if (mid) return mid.substring(6);
};
// Parses a fingerprint line for DTLS-SRTP.
$b2727632138354b2$var$SDPUtils.parseFingerprint = function(line) {
    var parts = line.substring(14).split(" ");
    return {
        algorithm: parts[0].toLowerCase(),
        value: parts[1].toUpperCase()
    };
};
// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
$b2727632138354b2$var$SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
    var lines = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection + sessionpart, "a=fingerprint:");
    // Note: a=setup line is ignored since we use the 'auto' role in Edge.
    return {
        role: "auto",
        fingerprints: lines.map($b2727632138354b2$var$SDPUtils.parseFingerprint)
    };
};
// Serializes DTLS parameters to SDP.
$b2727632138354b2$var$SDPUtils.writeDtlsParameters = function(params, setupType) {
    var sdp = "a=setup:" + setupType + "\r\n";
    params.fingerprints.forEach(function(fp) {
        sdp += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
    });
    return sdp;
};
// Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
$b2727632138354b2$var$SDPUtils.parseCryptoLine = function(line) {
    var parts = line.substring(9).split(" ");
    return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3)
    };
};
$b2727632138354b2$var$SDPUtils.writeCryptoLine = function(parameters) {
    return "a=crypto:" + parameters.tag + " " + parameters.cryptoSuite + " " + (typeof parameters.keyParams === "object" ? $b2727632138354b2$var$SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? " " + parameters.sessionParams.join(" ") : "") + "\r\n";
};
// Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
$b2727632138354b2$var$SDPUtils.parseCryptoKeyParams = function(keyParams) {
    if (keyParams.indexOf("inline:") !== 0) return null;
    var parts = keyParams.substring(7).split("|");
    return {
        keyMethod: "inline",
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(":")[0] : undefined,
        mkiLength: parts[2] ? parts[2].split(":")[1] : undefined
    };
};
$b2727632138354b2$var$SDPUtils.writeCryptoKeyParams = function(keyParams) {
    return keyParams.keyMethod + ":" + keyParams.keySalt + (keyParams.lifeTime ? "|" + keyParams.lifeTime : "") + (keyParams.mkiValue && keyParams.mkiLength ? "|" + keyParams.mkiValue + ":" + keyParams.mkiLength : "");
};
// Extracts all SDES parameters.
$b2727632138354b2$var$SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
    var lines = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection + sessionpart, "a=crypto:");
    return lines.map($b2727632138354b2$var$SDPUtils.parseCryptoLine);
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
$b2727632138354b2$var$SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
    var ufrag = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection + sessionpart, "a=ice-ufrag:")[0];
    var pwd = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection + sessionpart, "a=ice-pwd:")[0];
    if (!(ufrag && pwd)) return null;
    return {
        usernameFragment: ufrag.substring(12),
        password: pwd.substring(10)
    };
};
// Serializes ICE parameters to SDP.
$b2727632138354b2$var$SDPUtils.writeIceParameters = function(params) {
    var sdp = "a=ice-ufrag:" + params.usernameFragment + "\r\n" + "a=ice-pwd:" + params.password + "\r\n";
    if (params.iceLite) sdp += "a=ice-lite\r\n";
    return sdp;
};
// Parses the SDP media section and returns RTCRtpParameters.
$b2727632138354b2$var$SDPUtils.parseRtpParameters = function(mediaSection) {
    var description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
    };
    var lines = $b2727632138354b2$var$SDPUtils.splitLines(mediaSection);
    var mline = lines[0].split(" ");
    description.profile = mline[2];
    for(var i = 3; i < mline.length; i++){
        var pt = mline[i];
        var rtpmapline = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=rtpmap:" + pt + " ")[0];
        if (rtpmapline) {
            var codec = $b2727632138354b2$var$SDPUtils.parseRtpMap(rtpmapline);
            var fmtps = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=fmtp:" + pt + " ");
            // Only the first a=fmtp:<pt> is considered.
            codec.parameters = fmtps.length ? $b2727632138354b2$var$SDPUtils.parseFmtp(fmtps[0]) : {};
            codec.rtcpFeedback = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=rtcp-fb:" + pt + " ").map($b2727632138354b2$var$SDPUtils.parseRtcpFb);
            description.codecs.push(codec);
            // parse FEC mechanisms from rtpmap lines.
            switch(codec.name.toUpperCase()){
                case "RED":
                case "ULPFEC":
                    description.fecMechanisms.push(codec.name.toUpperCase());
                    break;
                default:
                    break;
            }
        }
    }
    $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=extmap:").forEach(function(line) {
        description.headerExtensions.push($b2727632138354b2$var$SDPUtils.parseExtmap(line));
    });
    var wildcardRtcpFb = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=rtcp-fb:* ").map($b2727632138354b2$var$SDPUtils.parseRtcpFb);
    description.codecs.forEach(function(codec) {
        wildcardRtcpFb.forEach(function(fb) {
            var duplicate = codec.rtcpFeedback.find(function(existingFeedback) {
                return existingFeedback.type === fb.type && existingFeedback.parameter === fb.parameter;
            });
            if (!duplicate) codec.rtcpFeedback.push(fb);
        });
    });
    // FIXME: parse rtcp.
    return description;
};
// Generates parts of the SDP media section describing the capabilities /
// parameters.
$b2727632138354b2$var$SDPUtils.writeRtpDescription = function(kind, caps) {
    var sdp = "";
    // Build the mline.
    sdp += "m=" + kind + " ";
    sdp += caps.codecs.length > 0 ? "9" : "0"; // reject if no codecs.
    sdp += " " + (caps.profile || "UDP/TLS/RTP/SAVPF") + " ";
    sdp += caps.codecs.map(function(codec) {
        if (codec.preferredPayloadType !== undefined) return codec.preferredPayloadType;
        return codec.payloadType;
    }).join(" ") + "\r\n";
    sdp += "c=IN IP4 0.0.0.0\r\n";
    sdp += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
    // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
    caps.codecs.forEach(function(codec) {
        sdp += $b2727632138354b2$var$SDPUtils.writeRtpMap(codec);
        sdp += $b2727632138354b2$var$SDPUtils.writeFmtp(codec);
        sdp += $b2727632138354b2$var$SDPUtils.writeRtcpFb(codec);
    });
    var maxptime = 0;
    caps.codecs.forEach(function(codec) {
        if (codec.maxptime > maxptime) maxptime = codec.maxptime;
    });
    if (maxptime > 0) sdp += "a=maxptime:" + maxptime + "\r\n";
    if (caps.headerExtensions) caps.headerExtensions.forEach(function(extension) {
        sdp += $b2727632138354b2$var$SDPUtils.writeExtmap(extension);
    });
    // FIXME: write fecMechanisms.
    return sdp;
};
// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
$b2727632138354b2$var$SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
    var encodingParameters = [];
    var description = $b2727632138354b2$var$SDPUtils.parseRtpParameters(mediaSection);
    var hasRed = description.fecMechanisms.indexOf("RED") !== -1;
    var hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
    // filter a=ssrc:... cname:, ignore PlanB-msid
    var ssrcs = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
        return $b2727632138354b2$var$SDPUtils.parseSsrcMedia(line);
    }).filter(function(parts) {
        return parts.attribute === "cname";
    });
    var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
    var secondarySsrc;
    var flows = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=ssrc-group:FID").map(function(line) {
        var parts = line.substring(17).split(" ");
        return parts.map(function(part) {
            return parseInt(part, 10);
        });
    });
    if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) secondarySsrc = flows[0][1];
    description.codecs.forEach(function(codec) {
        if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
            var encParam = {
                ssrc: primarySsrc,
                codecPayloadType: parseInt(codec.parameters.apt, 10)
            };
            if (primarySsrc && secondarySsrc) encParam.rtx = {
                ssrc: secondarySsrc
            };
            encodingParameters.push(encParam);
            if (hasRed) {
                encParam = JSON.parse(JSON.stringify(encParam));
                encParam.fec = {
                    ssrc: primarySsrc,
                    mechanism: hasUlpfec ? "red+ulpfec" : "red"
                };
                encodingParameters.push(encParam);
            }
        }
    });
    if (encodingParameters.length === 0 && primarySsrc) encodingParameters.push({
        ssrc: primarySsrc
    });
    // we support both b=AS and b=TIAS but interpret AS as TIAS.
    var bandwidth = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "b=");
    if (bandwidth.length) {
        if (bandwidth[0].indexOf("b=TIAS:") === 0) bandwidth = parseInt(bandwidth[0].substring(7), 10);
        else if (bandwidth[0].indexOf("b=AS:") === 0) // use formula from JSEP to convert b=AS to TIAS value.
        bandwidth = parseInt(bandwidth[0].substring(5), 10) * 950 - 16000;
        else bandwidth = undefined;
        encodingParameters.forEach(function(params) {
            params.maxBitrate = bandwidth;
        });
    }
    return encodingParameters;
};
// parses http://draft.ortc.org/#rtcrtcpparameters*
$b2727632138354b2$var$SDPUtils.parseRtcpParameters = function(mediaSection) {
    var rtcpParameters = {};
    // Gets the first SSRC. Note that with RTX there might be multiple
    // SSRCs.
    var remoteSsrc = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
        return $b2727632138354b2$var$SDPUtils.parseSsrcMedia(line);
    }).filter(function(obj) {
        return obj.attribute === "cname";
    })[0];
    if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
    }
    // Edge uses the compound attribute instead of reducedSize
    // compound is !reducedSize
    var rsize = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=rtcp-rsize");
    rtcpParameters.reducedSize = rsize.length > 0;
    rtcpParameters.compound = rsize.length === 0;
    // parses the rtcp-mux attrіbute.
    // Note that Edge does not support unmuxed RTCP.
    var mux = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=rtcp-mux");
    rtcpParameters.mux = mux.length > 0;
    return rtcpParameters;
};
$b2727632138354b2$var$SDPUtils.writeRtcpParameters = function(rtcpParameters) {
    var sdp = "";
    if (rtcpParameters.reducedSize) sdp += "a=rtcp-rsize\r\n";
    if (rtcpParameters.mux) sdp += "a=rtcp-mux\r\n";
    if (rtcpParameters.ssrc !== undefined && rtcpParameters.cname) sdp += "a=ssrc:" + rtcpParameters.ssrc + " cname:" + rtcpParameters.cname + "\r\n";
    return sdp;
};
// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
$b2727632138354b2$var$SDPUtils.parseMsid = function(mediaSection) {
    var parts;
    var spec = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=msid:");
    if (spec.length === 1) {
        parts = spec[0].substring(7).split(" ");
        return {
            stream: parts[0],
            track: parts[1]
        };
    }
    var planB = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map(function(line) {
        return $b2727632138354b2$var$SDPUtils.parseSsrcMedia(line);
    }).filter(function(msidParts) {
        return msidParts.attribute === "msid";
    });
    if (planB.length > 0) {
        parts = planB[0].value.split(" ");
        return {
            stream: parts[0],
            track: parts[1]
        };
    }
};
// SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05
$b2727632138354b2$var$SDPUtils.parseSctpDescription = function(mediaSection) {
    var mline = $b2727632138354b2$var$SDPUtils.parseMLine(mediaSection);
    var maxSizeLine = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=max-message-size:");
    var maxMessageSize;
    if (maxSizeLine.length > 0) maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
    if (isNaN(maxMessageSize)) maxMessageSize = 65536;
    var sctpPort = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=sctp-port:");
    if (sctpPort.length > 0) return {
        port: parseInt(sctpPort[0].substring(12), 10),
        protocol: mline.fmt,
        maxMessageSize: maxMessageSize
    };
    var sctpMapLines = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "a=sctpmap:");
    if (sctpMapLines.length > 0) {
        var parts = sctpMapLines[0].substring(10).split(" ");
        return {
            port: parseInt(parts[0], 10),
            protocol: parts[1],
            maxMessageSize: maxMessageSize
        };
    }
};
// SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)
$b2727632138354b2$var$SDPUtils.writeSctpDescription = function(media, sctp) {
    var output = [];
    if (media.protocol !== "DTLS/SCTP") output = [
        "m=" + media.kind + " 9 " + media.protocol + " " + sctp.protocol + "\r\n",
        "c=IN IP4 0.0.0.0\r\n",
        "a=sctp-port:" + sctp.port + "\r\n"
    ];
    else output = [
        "m=" + media.kind + " 9 " + media.protocol + " " + sctp.port + "\r\n",
        "c=IN IP4 0.0.0.0\r\n",
        "a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"
    ];
    if (sctp.maxMessageSize !== undefined) output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
    return output.join("");
};
// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
$b2727632138354b2$var$SDPUtils.generateSessionId = function() {
    return Math.random().toString().substr(2, 22);
};
// Write boiler plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
$b2727632138354b2$var$SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
    var sessionId;
    var version = sessVer !== undefined ? sessVer : 2;
    if (sessId) sessionId = sessId;
    else sessionId = $b2727632138354b2$var$SDPUtils.generateSessionId();
    var user = sessUser || "thisisadapterortc";
    // FIXME: sess-id should be an NTP timestamp.
    return "v=0\r\no=" + user + " " + sessionId + " " + version + " IN IP4 127.0.0.1\r\n" + "s=-\r\n" + "t=0 0\r\n";
};
// Gets the direction from the mediaSection or the sessionpart.
$b2727632138354b2$var$SDPUtils.getDirection = function(mediaSection, sessionpart) {
    // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
    var lines = $b2727632138354b2$var$SDPUtils.splitLines(mediaSection);
    for(var i = 0; i < lines.length; i++)switch(lines[i]){
        case "a=sendrecv":
        case "a=sendonly":
        case "a=recvonly":
        case "a=inactive":
            return lines[i].substring(2);
        default:
    }
    if (sessionpart) return $b2727632138354b2$var$SDPUtils.getDirection(sessionpart);
    return "sendrecv";
};
$b2727632138354b2$var$SDPUtils.getKind = function(mediaSection) {
    var lines = $b2727632138354b2$var$SDPUtils.splitLines(mediaSection);
    var mline = lines[0].split(" ");
    return mline[0].substring(2);
};
$b2727632138354b2$var$SDPUtils.isRejected = function(mediaSection) {
    return mediaSection.split(" ", 2)[1] === "0";
};
$b2727632138354b2$var$SDPUtils.parseMLine = function(mediaSection) {
    var lines = $b2727632138354b2$var$SDPUtils.splitLines(mediaSection);
    var parts = lines[0].substring(2).split(" ");
    return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(" ")
    };
};
$b2727632138354b2$var$SDPUtils.parseOLine = function(mediaSection) {
    var line = $b2727632138354b2$var$SDPUtils.matchPrefix(mediaSection, "o=")[0];
    var parts = line.substring(2).split(" ");
    return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
    };
};
// a very naive interpretation of a valid SDP.
$b2727632138354b2$var$SDPUtils.isValidSDP = function(blob) {
    if (typeof blob !== "string" || blob.length === 0) return false;
    var lines = $b2727632138354b2$var$SDPUtils.splitLines(blob);
    for(var i = 0; i < lines.length; i++){
        if (lines[i].length < 2 || lines[i].charAt(1) !== "=") return false;
    // TODO: check the modifier a bit more.
    }
    return true;
};
$b2727632138354b2$exports = $b2727632138354b2$var$SDPUtils;



"use strict";
function $1e725cbbdf747411$export$cf133661e444ccfe(window) {
    // foundation is arbitrarily chosen as an indicator for full support for
    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
    if (!window.RTCIceCandidate || window.RTCIceCandidate && "foundation" in window.RTCIceCandidate.prototype) return;
    var NativeRTCIceCandidate = window.RTCIceCandidate;
    window.RTCIceCandidate = function RTCIceCandidate(args) {
        // Remove the a= which shouldn't be part of the candidate string.
        if (typeof args === "object" && args.candidate && args.candidate.indexOf("a=") === 0) {
            args = JSON.parse(JSON.stringify(args));
            args.candidate = args.candidate.substring(2);
        }
        if (args.candidate && args.candidate.length) {
            // Augment the native candidate with the parsed fields.
            var nativeCandidate = new NativeRTCIceCandidate(args);
            var parsedCandidate = (0, (/*@__PURE__*/$parcel$interopDefault($b2727632138354b2$exports))).parseCandidate(args.candidate);
            var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate);
            // Add a serializer that does not serialize the extra attributes.
            augmentedCandidate.toJSON = function toJSON() {
                return {
                    candidate: augmentedCandidate.candidate,
                    sdpMid: augmentedCandidate.sdpMid,
                    sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
                    usernameFragment: augmentedCandidate.usernameFragment
                };
            };
            return augmentedCandidate;
        }
        return new NativeRTCIceCandidate(args);
    };
    window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    $993722e8c7a9e5a7$export$1f48841962b828b1(window, "icecandidate", function(e) {
        if (e.candidate) Object.defineProperty(e, "candidate", {
            value: new window.RTCIceCandidate(e.candidate),
            writable: "false"
        });
        return e;
    });
}
function $1e725cbbdf747411$export$fdafb8d8280e29b5(window) {
    if (!window.RTCIceCandidate || window.RTCIceCandidate && "relayProtocol" in window.RTCIceCandidate.prototype) return;
    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    $993722e8c7a9e5a7$export$1f48841962b828b1(window, "icecandidate", function(e) {
        if (e.candidate) {
            var parsedCandidate = (0, (/*@__PURE__*/$parcel$interopDefault($b2727632138354b2$exports))).parseCandidate(e.candidate.candidate);
            if (parsedCandidate.type === "relay") // This is a libwebrtc-specific mapping of local type preference
            // to relayProtocol.
            e.candidate.relayProtocol = ({
                0: "tls",
                1: "tcp",
                2: "udp"
            })[parsedCandidate.priority >> 24];
        }
        return e;
    });
}
function $1e725cbbdf747411$export$a99147c78a56edc4(window, browserDetails) {
    if (!window.RTCPeerConnection) return;
    if (!("sctp" in window.RTCPeerConnection.prototype)) Object.defineProperty(window.RTCPeerConnection.prototype, "sctp", {
        get: function() {
            return typeof this._sctp === "undefined" ? null : this._sctp;
        }
    });
    var sctpInDescription = function sctpInDescription(description) {
        if (!description || !description.sdp) return false;
        var sections = (0, (/*@__PURE__*/$parcel$interopDefault($b2727632138354b2$exports))).splitSections(description.sdp);
        sections.shift();
        return sections.some(function(mediaSection) {
            var mLine = (0, (/*@__PURE__*/$parcel$interopDefault($b2727632138354b2$exports))).parseMLine(mediaSection);
            return mLine && mLine.kind === "application" && mLine.protocol.indexOf("SCTP") !== -1;
        });
    };
    var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
        // TODO: Is there a better solution for detecting Firefox?
        var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) return -1;
        var version = parseInt(match[1], 10);
        // Test for NaN (yes, this is ugly)
        return version !== version ? -1 : version;
    };
    var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
        // Every implementation we know can send at least 64 KiB.
        // Note: Although Chrome is technically able to send up to 256 KiB, the
        //       data does not reach the other peer reliably.
        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
        var canSendMaxMessageSize = 65536;
        if (browserDetails.browser === "firefox") {
            if (browserDetails.version < 57) {
                if (remoteIsFirefox === -1) // FF < 57 will send in 16 KiB chunks using the deprecated PPID
                // fragmentation.
                canSendMaxMessageSize = 16384;
                else // However, other FF (and RAWRTC) can reassemble PPID-fragmented
                // messages. Thus, supporting ~2 GiB when sending.
                canSendMaxMessageSize = 2147483637;
            } else if (browserDetails.version < 60) // Currently, all FF >= 57 will reset the remote maximum message size
            // to the default value when a data channel is created at a later
            // stage. :(
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
            canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
            else // FF >= 60 supports sending ~2 GiB
            canSendMaxMessageSize = 2147483637;
        }
        return canSendMaxMessageSize;
    };
    var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
        // Note: 65536 bytes is the default value from the SDP spec. Also,
        //       every implementation we know supports receiving 65536 bytes.
        var maxMessageSize = 65536;
        // FF 57 has a slightly incorrect default remote max message size, so
        // we need to adjust it here to avoid a failure when sending.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
        if (browserDetails.browser === "firefox" && browserDetails.version === 57) maxMessageSize = 65535;
        var match = (0, (/*@__PURE__*/$parcel$interopDefault($b2727632138354b2$exports))).matchPrefix(description.sdp, "a=max-message-size:");
        if (match.length > 0) maxMessageSize = parseInt(match[0].substring(19), 10);
        else if (browserDetails.browser === "firefox" && remoteIsFirefox !== -1) // If the maximum message size is not present in the remote SDP and
        // both local and remote are Firefox, the remote peer can receive
        // ~2 GiB.
        maxMessageSize = 2147483637;
        return maxMessageSize;
    };
    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        this._sctp = null;
        // Chrome decided to not expose .sctp in plan-b mode.
        // As usual, adapter.js has to do an 'ugly worakaround'
        // to cover up the mess.
        if (browserDetails.browser === "chrome" && browserDetails.version >= 76) {
            var sdpSemantics = this.getConfiguration().sdpSemantics;
            if (sdpSemantics === "plan-b") Object.defineProperty(this, "sctp", {
                get: function() {
                    return typeof this._sctp === "undefined" ? null : this._sctp;
                },
                enumerable: true,
                configurable: true
            });
        }
        if (sctpInDescription(arguments[0])) {
            // Check if the remote is FF.
            var isFirefox = getRemoteFirefoxVersion(arguments[0]);
            // Get the maximum message size the local peer is capable of sending
            var canSendMMS = getCanSendMaxMessageSize(isFirefox);
            // Get the maximum message size of the remote peer.
            var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
            // Determine final maximum message size
            var maxMessageSize;
            if (canSendMMS === 0 && remoteMMS === 0) maxMessageSize = Number.POSITIVE_INFINITY;
            else if (canSendMMS === 0 || remoteMMS === 0) maxMessageSize = Math.max(canSendMMS, remoteMMS);
            else maxMessageSize = Math.min(canSendMMS, remoteMMS);
            // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
            // attribute.
            var sctp = {};
            Object.defineProperty(sctp, "maxMessageSize", {
                get: function() {
                    return maxMessageSize;
                }
            });
            this._sctp = sctp;
        }
        return origSetRemoteDescription.apply(this, arguments);
    };
}
function $1e725cbbdf747411$export$d461c8d5c5db5da7(window) {
    var wrapDcSend = // Note: Although Firefox >= 57 has a native implementation, the maximum
    //       message size can be reset for all data channels at a later stage.
    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
    function wrapDcSend(dc, pc) {
        var origDataChannelSend = dc.send;
        dc.send = function send() {
            var data = arguments[0];
            var length = data.length || data.size || data.byteLength;
            if (dc.readyState === "open" && pc.sctp && length > pc.sctp.maxMessageSize) throw new TypeError("Message too large (can send a maximum of " + pc.sctp.maxMessageSize + " bytes)");
            return origDataChannelSend.apply(dc, arguments);
        };
    };
    if (!(window.RTCPeerConnection && "createDataChannel" in window.RTCPeerConnection.prototype)) return;
    var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
    window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
        var dataChannel = origCreateDataChannel.apply(this, arguments);
        wrapDcSend(dataChannel, this);
        return dataChannel;
    };
    $993722e8c7a9e5a7$export$1f48841962b828b1(window, "datachannel", function(e) {
        wrapDcSend(e.channel, e.target);
        return e;
    });
}
function $1e725cbbdf747411$export$63bb816cc75460(window) {
    if (!window.RTCPeerConnection || "connectionState" in window.RTCPeerConnection.prototype) return;
    var proto = window.RTCPeerConnection.prototype;
    Object.defineProperty(proto, "connectionState", {
        get: function() {
            return ({
                completed: "connected",
                checking: "connecting"
            })[this.iceConnectionState] || this.iceConnectionState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(proto, "onconnectionstatechange", {
        get: function() {
            return this._onconnectionstatechange || null;
        },
        set: function(cb) {
            if (this._onconnectionstatechange) {
                this.removeEventListener("connectionstatechange", this._onconnectionstatechange);
                delete this._onconnectionstatechange;
            }
            if (cb) this.addEventListener("connectionstatechange", this._onconnectionstatechange = cb);
        },
        enumerable: true,
        configurable: true
    });
    [
        "setLocalDescription",
        "setRemoteDescription"
    ].forEach(function(method) {
        var origMethod = proto[method];
        proto[method] = function() {
            if (!this._connectionstatechangepoly) {
                this._connectionstatechangepoly = function(e) {
                    var pc = e.target;
                    if (pc._lastConnectionState !== pc.connectionState) {
                        pc._lastConnectionState = pc.connectionState;
                        var newEvent = new Event("connectionstatechange", e);
                        pc.dispatchEvent(newEvent);
                    }
                    return e;
                };
                this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly);
            }
            return origMethod.apply(this, arguments);
        };
    });
}
function $1e725cbbdf747411$export$a57d114344295149(window, browserDetails) {
    /* remove a=extmap-allow-mixed for webrtc.org < M71 */ if (!window.RTCPeerConnection) return;
    if (browserDetails.browser === "chrome" && browserDetails.version >= 71) return;
    if (browserDetails.browser === "safari" && browserDetails.version >= 605) return;
    var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
        if (desc && desc.sdp && desc.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
            var sdp = desc.sdp.split("\n").filter(function(line) {
                return line.trim() !== "a=extmap-allow-mixed";
            }).join("\n");
            // Safari enforces read-only-ness of RTCSessionDescription fields.
            if (window.RTCSessionDescription && desc instanceof window.RTCSessionDescription) arguments[0] = new window.RTCSessionDescription({
                type: desc.type,
                sdp: sdp
            });
            else desc.sdp = sdp;
        }
        return nativeSRD.apply(this, arguments);
    };
}
function $1e725cbbdf747411$export$51d5e40b48c771c7(window, browserDetails) {
    // Support for addIceCandidate(null or undefined)
    // as well as addIceCandidate({candidate: "", ...})
    // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
    // Note: must be called before other polyfills which change the signature.
    if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) return;
    var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
    if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) return;
    window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
        if (!arguments[0]) {
            if (arguments[1]) arguments[1].apply(null);
            return Promise.resolve();
        }
        // Firefox 68+ emits and processes {candidate: "", ...}, ignore
        // in older versions.
        // Native support for ignoring exists for Chrome M77+.
        // Safari ignores as well, exact version unknown but works in the same
        // version that also ignores addIceCandidate(null).
        if ((browserDetails.browser === "chrome" && browserDetails.version < 78 || browserDetails.browser === "firefox" && browserDetails.version < 68 || browserDetails.browser === "safari") && arguments[0] && arguments[0].candidate === "") return Promise.resolve();
        return nativeAddIceCandidate.apply(this, arguments);
    };
}
function $1e725cbbdf747411$export$7170d04e59f9d553(window, browserDetails) {
    if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) return;
    var nativeSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
    if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) return;
    window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        var _this = this;
        var desc = arguments[0] || {};
        if (typeof desc !== "object" || desc.type && desc.sdp) return nativeSetLocalDescription.apply(this, arguments);
        // The remaining steps should technically happen when SLD comes off the
        // RTCPeerConnection's operations chain (not ahead of going on it), but
        // this is too difficult to shim. Instead, this shim only covers the
        // common case where the operations chain is empty. This is imperfect, but
        // should cover many cases. Rationale: Even if we can't reduce the glare
        // window to zero on imperfect implementations, there's value in tapping
        // into the perfect negotiation pattern that several browsers support.
        desc = {
            type: desc.type,
            sdp: desc.sdp
        };
        if (!desc.type) switch(this.signalingState){
            case "stable":
            case "have-local-offer":
            case "have-remote-pranswer":
                desc.type = "offer";
                break;
            default:
                desc.type = "answer";
                break;
        }
        if (desc.sdp || desc.type !== "offer" && desc.type !== "answer") return nativeSetLocalDescription.apply(this, [
            desc
        ]);
        var func = desc.type === "offer" ? this.createOffer : this.createAnswer;
        return func.apply(this).then(function(d) {
            return nativeSetLocalDescription.apply(_this, [
                d
            ]);
        });
    };
}



function $b1450a2ae8cc7983$export$e77bf46c04ac7d12() {
    var window = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).window, options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        shimChrome: true,
        shimFirefox: true,
        shimSafari: true
    };
    // Utils.
    var logging = $993722e8c7a9e5a7$export$bef1f36f5486a6a3;
    var browserDetails = $993722e8c7a9e5a7$export$2d31490a0c05f094(window);
    var adapter = {
        browserDetails: browserDetails,
        commonShim: $1e725cbbdf747411$exports,
        extractVersion: $993722e8c7a9e5a7$export$e3c02be309be1f23,
        disableLog: $993722e8c7a9e5a7$export$afbfee8cc06fd3e4,
        disableWarnings: $993722e8c7a9e5a7$export$51516be4b019e41e,
        // Expose sdp as a convenience. For production apps include directly.
        sdp: $b2727632138354b2$exports
    };
    // Shim browser if found.
    switch(browserDetails.browser){
        case "chrome":
            if (!$ef7fa8125ed93bad$exports || !$ef7fa8125ed93bad$exports.shimPeerConnection || !options.shimChrome) {
                logging("Chrome shim is not included in this adapter release.");
                return adapter;
            }
            if (browserDetails.version === null) {
                logging("Chrome shim can not determine version, not shimming.");
                return adapter;
            }
            logging("adapter.js shimming chrome.");
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = $ef7fa8125ed93bad$exports;
            // Must be called before shimPeerConnection.
            $1e725cbbdf747411$exports.shimAddIceCandidateNullOrEmpty(window, browserDetails);
            $1e725cbbdf747411$exports.shimParameterlessSetLocalDescription(window, browserDetails);
            $ef7fa8125ed93bad$exports.shimGetUserMedia(window, browserDetails);
            $ef7fa8125ed93bad$exports.shimMediaStream(window, browserDetails);
            $ef7fa8125ed93bad$exports.shimPeerConnection(window, browserDetails);
            $ef7fa8125ed93bad$exports.shimOnTrack(window, browserDetails);
            $ef7fa8125ed93bad$exports.shimAddTrackRemoveTrack(window, browserDetails);
            $ef7fa8125ed93bad$exports.shimGetSendersWithDtmf(window, browserDetails);
            $ef7fa8125ed93bad$exports.shimGetStats(window, browserDetails);
            $ef7fa8125ed93bad$exports.shimSenderReceiverGetStats(window, browserDetails);
            $ef7fa8125ed93bad$exports.fixNegotiationNeeded(window, browserDetails);
            $1e725cbbdf747411$exports.shimRTCIceCandidate(window, browserDetails);
            $1e725cbbdf747411$exports.shimRTCIceCandidateRelayProtocol(window, browserDetails);
            $1e725cbbdf747411$exports.shimConnectionState(window, browserDetails);
            $1e725cbbdf747411$exports.shimMaxMessageSize(window, browserDetails);
            $1e725cbbdf747411$exports.shimSendThrowTypeError(window, browserDetails);
            $1e725cbbdf747411$exports.removeExtmapAllowMixed(window, browserDetails);
            break;
        case "firefox":
            if (!$f7879eae6ce316c3$exports || !$f7879eae6ce316c3$exports.shimPeerConnection || !options.shimFirefox) {
                logging("Firefox shim is not included in this adapter release.");
                return adapter;
            }
            logging("adapter.js shimming firefox.");
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = $f7879eae6ce316c3$exports;
            // Must be called before shimPeerConnection.
            $1e725cbbdf747411$exports.shimAddIceCandidateNullOrEmpty(window, browserDetails);
            $1e725cbbdf747411$exports.shimParameterlessSetLocalDescription(window, browserDetails);
            $f7879eae6ce316c3$exports.shimGetUserMedia(window, browserDetails);
            $f7879eae6ce316c3$exports.shimPeerConnection(window, browserDetails);
            $f7879eae6ce316c3$exports.shimOnTrack(window, browserDetails);
            $f7879eae6ce316c3$exports.shimRemoveStream(window, browserDetails);
            $f7879eae6ce316c3$exports.shimSenderGetStats(window, browserDetails);
            $f7879eae6ce316c3$exports.shimReceiverGetStats(window, browserDetails);
            $f7879eae6ce316c3$exports.shimRTCDataChannel(window, browserDetails);
            $f7879eae6ce316c3$exports.shimAddTransceiver(window, browserDetails);
            $f7879eae6ce316c3$exports.shimGetParameters(window, browserDetails);
            $f7879eae6ce316c3$exports.shimCreateOffer(window, browserDetails);
            $f7879eae6ce316c3$exports.shimCreateAnswer(window, browserDetails);
            $1e725cbbdf747411$exports.shimRTCIceCandidate(window, browserDetails);
            $1e725cbbdf747411$exports.shimConnectionState(window, browserDetails);
            $1e725cbbdf747411$exports.shimMaxMessageSize(window, browserDetails);
            $1e725cbbdf747411$exports.shimSendThrowTypeError(window, browserDetails);
            break;
        case "safari":
            if (!$b5603e2a25579e83$exports || !options.shimSafari) {
                logging("Safari shim is not included in this adapter release.");
                return adapter;
            }
            logging("adapter.js shimming safari.");
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = $b5603e2a25579e83$exports;
            // Must be called before shimCallbackAPI.
            $1e725cbbdf747411$exports.shimAddIceCandidateNullOrEmpty(window, browserDetails);
            $1e725cbbdf747411$exports.shimParameterlessSetLocalDescription(window, browserDetails);
            $b5603e2a25579e83$exports.shimRTCIceServerUrls(window, browserDetails);
            $b5603e2a25579e83$exports.shimCreateOfferLegacy(window, browserDetails);
            $b5603e2a25579e83$exports.shimCallbacksAPI(window, browserDetails);
            $b5603e2a25579e83$exports.shimLocalStreamsAPI(window, browserDetails);
            $b5603e2a25579e83$exports.shimRemoteStreamsAPI(window, browserDetails);
            $b5603e2a25579e83$exports.shimTrackEventTransceiver(window, browserDetails);
            $b5603e2a25579e83$exports.shimGetUserMedia(window, browserDetails);
            $b5603e2a25579e83$exports.shimAudioContext(window, browserDetails);
            $1e725cbbdf747411$exports.shimRTCIceCandidate(window, browserDetails);
            $1e725cbbdf747411$exports.shimRTCIceCandidateRelayProtocol(window, browserDetails);
            $1e725cbbdf747411$exports.shimMaxMessageSize(window, browserDetails);
            $1e725cbbdf747411$exports.shimSendThrowTypeError(window, browserDetails);
            $1e725cbbdf747411$exports.removeExtmapAllowMixed(window, browserDetails);
            break;
        default:
            logging("Unsupported browser!");
            break;
    }
    return adapter;
}


"use strict";
var $3ddb6603d0385efa$var$adapter = (0, $b1450a2ae8cc7983$export$e77bf46c04ac7d12)({
    window: typeof window === "undefined" ? undefined : window
});
var $3ddb6603d0385efa$export$2e2bcd8739ae039 = $3ddb6603d0385efa$var$adapter;


var $72109226dc759154$var$webRTCAdapter = //@ts-ignore
(0, $3ddb6603d0385efa$export$2e2bcd8739ae039)["default"] || (0, $3ddb6603d0385efa$export$2e2bcd8739ae039);
var $72109226dc759154$export$6c0517834721cef7 = new /** @class */ (function() {
    var class_1 = function class_1() {
        this.isIOS = [
            "iPad",
            "iPhone",
            "iPod"
        ].includes(navigator.platform);
        this.supportedBrowsers = [
            "firefox",
            "chrome",
            "safari"
        ];
        this.minFirefoxVersion = 59;
        this.minChromeVersion = 72;
        this.minSafariVersion = 605;
    };
    class_1.prototype.isAudioContextSupported = function() {
        return typeof AudioContext !== "undefined";
    };
    class_1.prototype.isMediaDevicesSupported = function() {
        return typeof navigator.mediaDevices !== "undefined";
    };
    class_1.prototype.isGetUserMediaSupported = function() {
        return this.isMediaDevicesSupported() && typeof navigator.mediaDevices.getUserMedia !== "undefined";
    };
    class_1.prototype.isMediaRecorderSupported = function() {
        return typeof MediaRecorder !== "undefined";
    };
    class_1.prototype.isAudioWorkletNode = function() {
        return typeof AudioWorkletNode !== "undefined";
    };
    class_1.prototype.isBrowserSupported = function() {
        var browser = this.getBrowser();
        var version = this.getVersion();
        var validBrowser = this.supportedBrowsers.includes(browser);
        if (!validBrowser) return false;
        if (browser === "chrome") return version >= this.minChromeVersion;
        if (browser === "firefox") return version >= this.minFirefoxVersion;
        if (browser === "safari") return !this.isIOS && version >= this.minSafariVersion;
        return false;
    };
    class_1.prototype.getBrowser = function() {
        return $72109226dc759154$var$webRTCAdapter.browserDetails.browser;
    };
    class_1.prototype.getVersion = function() {
        return $72109226dc759154$var$webRTCAdapter.browserDetails.version || 0;
    };
    class_1.prototype.isUnifiedPlanSupported = function() {
        var browser = this.getBrowser();
        var version = $72109226dc759154$var$webRTCAdapter.browserDetails.version || 0;
        if (browser === "chrome" && version < this.minChromeVersion) return false;
        if (browser === "firefox" && version >= this.minFirefoxVersion) return true;
        if (!(this.isAudioContextSupported() && this.isMediaDevicesSupported() && this.isGetUserMediaSupported() && this.isMediaRecorderSupported() && this.isAudioWorkletNode())) return false;
        return true;
    };
    class_1.prototype.toString = function() {
        return "Supports:\n    browser:".concat(this.getBrowser(), "\n    version:").concat(this.getVersion(), "\n    isIOS:").concat(this.isIOS, "\n    isAudioContextSupported:").concat(this.isAudioContextSupported(), "\n	isMediaDevicesSupported:").concat(this.isMediaDevicesSupported(), "\n	isGetUserMediaSupported:").concat(this.isGetUserMediaSupported(), "\n	isMediaRecorderSupported:").concat(this.isMediaRecorderSupported(), "\n    isBrowserSupported:").concat(this.isBrowserSupported(), "\n	isAudioWorkletNode:").concat(this.isAudioWorkletNode(), "\n    isUnifiedPlanSupported:").concat(this.isUnifiedPlanSupported(), "\n	");
    };
    return class_1;
}())();


var $cc400760811d54a9$var$__extends = undefined && undefined.__extends || function() {
    var extendStatics = function extendStatics1(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        var __ = function __() {
            this.constructor = d;
        };
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var $cc400760811d54a9$var$__assign = undefined && undefined.__assign || function() {
    $cc400760811d54a9$var$__assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return $cc400760811d54a9$var$__assign.apply(this, arguments);
};
var $cc400760811d54a9$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    var adopt = function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    };
    return new (P || (P = Promise))(function(resolve, reject) {
        var fulfilled = function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        };
        var rejected = function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        };
        var step = function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        };
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $cc400760811d54a9$var$__generator = undefined && undefined.__generator || function(thisArg, body) {
    var verb = function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    };
    var step = function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    };
    var _ = {
        label: 0,
        sent: function sent() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
};
var $cc400760811d54a9$export$7fc53215244aec38 = /** @class */ function(_super) {
    var Media = function Media(mediaType, option) {
        var _this_1 = _super.call(this) || this;
        _this_1.mediaStream = null;
        _this_1.mediaRecorder = null;
        _this_1.mediaBlobs = [];
        _this_1.soundMeter = null;
        _this_1.mediaState = "inactive";
        _this_1.mediaStreamConstraints = null;
        _this_1.mediaRecorderOptions = null;
        _this_1.timeSlice = null;
        if ((0, $72109226dc759154$export$6c0517834721cef7).isUnifiedPlanSupported()) _this_1.setMediaType(mediaType).setConfig(option);
        else _this_1.emit("error", {
            type: "constructor",
            message: "".concat((0, $72109226dc759154$export$6c0517834721cef7).toString())
        });
        return _this_1;
    };
    $cc400760811d54a9$var$__extends(Media, _super);
    Media.prototype.setConfig = function(option) {
        switch(this.mediaType){
            case "audio":
                this.setAudioConfig(option);
                break;
            case "video":
                this.setVideoConfig(option);
                break;
            case "screen":
                this.setScreenConfig(option);
                break;
        }
        return this;
    };
    Media.prototype.getAudioConstraints = function(option) {
        var _a = option || {}, audio = _a.audio, sampleRate = _a.sampleRate, echoCancellation = _a.echoCancellation;
        if (typeof sampleRate === "undefined" && typeof echoCancellation === "undefined") audio || (audio = true);
        else {
            audio = {};
            sampleRate && (audio["sampleRate"] = sampleRate);
            echoCancellation && (audio["echoCancellation"] = {
                exact: echoCancellation
            });
        }
        return audio;
    };
    Media.prototype.getVideoConstraints = function(option) {
        var _a = option || {}, video = _a.video, sampleRate = _a.sampleRate, width = _a.width, height = _a.height;
        if (typeof sampleRate === "undefined" && typeof width === "undefined" && typeof height === "undefined") video || (video = true);
        else {
            video = {};
            sampleRate && (video["sampleRate"] = sampleRate);
            width && (video["width"] = width);
            height && (video["height"] = height);
        }
        return video;
    };
    Media.prototype.getConfigOptions = function(option) {
        var _a;
        var _b = option || {}, mimeType = _b.mimeType, audioBitsPerSecond = _b.audioBitsPerSecond, videoBitsPerSecond = _b.videoBitsPerSecond;
        var options = {
            mimeType: mimeType || ((_a = this.getSupportedMimeTypes()) === null || _a === void 0 ? void 0 : _a[0])
        };
        audioBitsPerSecond && (options["audioBitsPerSecond"] = audioBitsPerSecond);
        videoBitsPerSecond && (options["videoBitsPerSecond"] = videoBitsPerSecond);
        return options;
    };
    Media.prototype.setAudioConfig = function(option) {
        var audio = this.getAudioConstraints(option);
        var options = this.getConfigOptions(option);
        this.setMediaStreamConstraints({
            audio: audio
        }).setMediaRecorderOptions(options).setTimeSlice(option === null || option === void 0 ? void 0 : option.timeSlice);
        return this;
    };
    Media.prototype.setVideoConfig = function(option) {
        var audio = this.getAudioConstraints(option);
        var video = this.getVideoConstraints(option);
        var options = this.getConfigOptions(option);
        this.setMediaStreamConstraints({
            video: video,
            audio: audio
        }).setMediaRecorderOptions(options).setTimeSlice(option === null || option === void 0 ? void 0 : option.timeSlice);
        return this;
    };
    Media.prototype.setScreenConfig = function(option) {
        var audio = this.getAudioConstraints(option);
        var video = this.getVideoConstraints(option);
        var options = this.getConfigOptions(option);
        this.setMediaStreamConstraints({
            video: video,
            audio: audio
        }).setMediaRecorderOptions(options).setTimeSlice(option === null || option === void 0 ? void 0 : option.timeSlice);
        return this;
    };
    Media.prototype.setTimeSlice = function(timeSlice) {
        timeSlice && (this.timeSlice = timeSlice);
        return this;
    };
    Media.prototype.getTimeSlice = function() {
        return this.timeSlice;
    };
    Media.prototype.getMediaType = function() {
        return this.mediaType;
    };
    /**
     *
     * @param setMediaType
     * audio: 录音 Boolean;
        video: 录像 Boolean;
        screen: 录屏 Boolean;
     * @returns
     */ Media.prototype.setMediaType = function(mediaType) {
        this.mediaType = mediaType;
        return this;
    };
    Media.prototype.getMedisStream = function() {
        return this.mediaStream;
    };
    Media.prototype.setMediaStream = function(constraints) {
        return $cc400760811d54a9$var$__awaiter(this, void 0, void 0, function() {
            var _constraints, mediaType, _a, _b, err_1;
            return $cc400760811d54a9$var$__generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        this.setMediaStreamConstraints(constraints);
                        _constraints = this.getMediaStreamConstraints();
                        mediaType = this.getMediaType();
                        this.setMediaState("wait");
                        _c.label = 1;
                    case 1:
                        _c.trys.push([
                            1,
                            6,
                            ,
                            7
                        ]);
                        _a = this;
                        if (!(mediaType === "screen")) return [
                            3 /*break*/ ,
                            3
                        ];
                        return [
                            4 /*yield*/ ,
                            navigator.mediaDevices.getDisplayMedia(_constraints)
                        ];
                    case 2:
                        _b = _c.sent();
                        return [
                            3 /*break*/ ,
                            5
                        ];
                    case 3:
                        return [
                            4 /*yield*/ ,
                            navigator.mediaDevices.getUserMedia(_constraints)
                        ];
                    case 4:
                        _b = _c.sent();
                        _c.label = 5;
                    case 5:
                        _a.mediaStream = _b;
                        this.setMediaState("ready");
                        this.setSoundMeter();
                        return [
                            2 /*return*/ ,
                            this
                        ];
                    case 6:
                        err_1 = _c.sent();
                        this.setMediaState("inactive");
                        this.emit("error", {
                            type: "setMedisStream",
                            message: err_1
                        });
                        return [
                            3 /*break*/ ,
                            7
                        ];
                    case 7:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    Media.prototype.getMediaRecorder = function() {
        return this.mediaRecorder;
    };
    Media.prototype.setMediaRecorder = function(options) {
        var _this_1 = this;
        this.setMediaRecorderOptions(options);
        this.mediaRecorder = new MediaRecorder(this.mediaStream, this.getMediaRecorderOptions());
        this.mediaRecorder.onerror = function(err) {
            _this_1.emit("error", {
                type: "mediaRecorder",
                message: err
            });
        };
        // 将 stream 转成 blob 来存放
        this.mediaRecorder.ondataavailable = function(blobEvent) {
            _this_1.emit("dataavailable", blobEvent);
            _this_1.mediaBlobs.push(blobEvent.data);
        };
        this.mediaRecorder.onstart = function(event) {
            _this_1.mediaBlobs = [];
            _this_1.emit("start", event);
        };
        this.mediaRecorder.onstop = function(event) {
            _this_1.soundMeter.stop();
            _this_1.emit("stop", event);
        };
        this.mediaRecorder.onpause = function(event) {
            _this_1.emit("pause", event);
        };
        this.mediaRecorder.onresume = function(event) {
            _this_1.emit("resume", event);
        };
        return this;
    };
    Media.prototype.getMediaBlobs = function() {
        return this.mediaBlobs;
    };
    Media.prototype.getMediaState = function() {
        return this.mediaState;
    };
    Media.prototype.setMediaState = function(mediaState) {
        this.mediaState = mediaState;
        return this;
    };
    // type RecordingState = "inactive" | "paused" | "recording";
    Media.prototype.getRecorderState = function() {
        var _a;
        return ((_a = this.getMediaRecorder()) === null || _a === void 0 ? void 0 : _a.state) || "inactive";
    };
    Media.prototype.getMediaStreamConstraints = function() {
        return this.mediaStreamConstraints;
    };
    /**
     *
     * @param constraints
     * audio：指定是否获取音频流。
        video：指定是否获取视频流。
        audioConstraints 和 videoConstraints：分别指定音频和视频的约束条件，例如采样率、帧速率等。
        facingMode：指定使用前置或后置摄像头。
        width 和 height：指定视频的宽度和高度。
        frameRate：指定视频的帧速率。
        deviceId：指定要使用的音频或视频设备的 ID。
     * @returns
     */ Media.prototype.setMediaStreamConstraints = function(constraints) {
        var _constraints = $cc400760811d54a9$var$__assign($cc400760811d54a9$var$__assign({}, this.getMediaStreamConstraints()), constraints);
        this.mediaStreamConstraints = _constraints;
        return this;
    };
    Media.prototype.getMediaRecorderOptions = function() {
        return this.mediaRecorderOptions;
    };
    /**
     *
     * @param options
     * mimeType：指定录制的媒体文件类型，例如 audio/webm、video/webm 等。
        audioBitsPerSecond 和 videoBitsPerSecond：分别指定音频和视频的比特率。
        audioChannels：指定使用的音频通道数。
        videoFrameRate：指定视频的帧速率。
        width 和 height：指定视频的宽度和高度。
        videoSize：指定视频的大小，可以是宽度和高度组成的对象，也可以是字符串（例如“640x480”）。
        echoCancellation：指定是否启用回声消除。
     * @returns
     */ Media.prototype.setMediaRecorderOptions = function(options) {
        var _options = $cc400760811d54a9$var$__assign($cc400760811d54a9$var$__assign({}, this.getMediaRecorderOptions()), options);
        this.mediaRecorderOptions = _options;
        return this;
    };
    Media.prototype.isReady = function(type) {
        if (type === void 0) type = "isReady";
        var mediaState = this.getMediaState();
        if (mediaState === "ready") return true;
        else {
            var err = "the cureent mediaState is ".concat(mediaState, ", Please use open function");
            this.emit("error", {
                type: type,
                message: err
            });
            return false;
        }
    };
    Media.prototype.onerror = function(callback) {
        callback && this.on("error", callback);
        return this;
    };
    // 创建
    Media.prototype.create = function() {
        return $cc400760811d54a9$var$__awaiter(this, void 0, void 0, function() {
            var media;
            return $cc400760811d54a9$var$__generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        if (!(this.getMediaState() === "inactive")) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            this.setMediaStream()
                        ];
                    case 1:
                        media = _a.sent();
                        if (media) {
                            this.setMediaRecorder();
                            this.emit("create");
                        }
                        return [
                            2 /*return*/ ,
                            this
                        ];
                    case 2:
                        this.emit("error", {
                            type: "create",
                            message: "mediaState: ".concat(this.getMediaState())
                        });
                        _a.label = 3;
                    case 3:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    Media.prototype.oncreate = function(callback) {
        callback && this.on("create", callback);
        return this;
    };
    // 销毁
    Media.prototype.destroy = function() {
        var _a;
        if (this.getMediaState() !== "inactive") {
            this.getRecorderState() !== "inactive" && this.stop();
            (_a = this.mediaStream) === null || _a === void 0 || _a.getTracks().forEach(function(track) {
                return track.stop();
            });
            this.mediaBlobs = [];
            this.mediaStream = null;
            this.mediaRecorder = null;
            this.setMediaState("inactive");
            this.emit("destroy");
            return this;
        } else this.emit("error", {
            type: "destroy",
            message: "mediaState: ".concat(this.getMediaState())
        });
    };
    Media.prototype.ondestroy = function(callback) {
        callback && this.on("destroy", callback);
        return this;
    };
    Media.prototype.ondataavailable = function(callback) {
        callback && this.on("dataavailable", callback);
        return this;
    };
    // 开始
    Media.prototype.start = function(timeSlice) {
        var _a, _b;
        if (!this.isReady()) return this;
        try {
            this.setTimeSlice(timeSlice);
            timeSlice = this.getTimeSlice();
            timeSlice ? (_a = this.mediaRecorder) === null || _a === void 0 || _a.start(timeSlice) : (_b = this.mediaRecorder) === null || _b === void 0 || _b.start();
            return this;
        } catch (err) {
            this.emit("error", {
                type: "start",
                message: err
            });
        }
    };
    Media.prototype.onstart = function(callback) {
        callback && this.on("start", callback);
    };
    Media.prototype.stop = function() {
        var _a;
        if (!this.isReady()) return this;
        try {
            (_a = this.mediaRecorder) === null || _a === void 0 || _a.stop();
            return this;
        } catch (err) {
            this.emit("error", {
                type: "stop",
                message: err
            });
        }
    };
    Media.prototype.onstop = function(callback) {
        callback && this.on("stop", callback);
        return this;
    };
    // 暂停
    Media.prototype.pause = function() {
        var _a;
        if (!this.isReady()) return this;
        try {
            (_a = this.mediaRecorder) === null || _a === void 0 || _a.pause();
            return this;
        } catch (err) {
            this.emit("error", {
                type: "pause",
                message: err
            });
        }
    };
    Media.prototype.onpause = function(callback) {
        callback && this.on("pause", callback);
        return this;
    };
    // 继续
    Media.prototype.resume = function() {
        var _a;
        if (!this.isReady()) return this;
        try {
            (_a = this.mediaRecorder) === null || _a === void 0 || _a.resume();
            return this;
        } catch (err) {
            this.emit("error", {
                type: "resume",
                message: err
            });
        }
    };
    Media.prototype.onresume = function(callback) {
        callback && this.on("resume", callback);
        return this;
    };
    Media.prototype.setSoundMeter = function(mediaStream) {
        try {
            var audioContext = new AudioContext();
            this.soundMeter = new (0, $206f35e62fa86708$export$2e2bcd8739ae039)(audioContext);
            this.soundMeter.connectToSource(mediaStream || this.mediaStream);
            return this;
        } catch (err) {
            this.emit("error", {
                type: "setSoundMeter",
                message: err
            });
        }
    };
    Media.prototype.getSoundMeter = function() {
        return this.soundMeter;
    };
    Media.prototype.getBlob = function(options) {
        if (!this.isReady()) return;
        var mimeType = this.getMediaRecorderOptions().mimeType;
        if (!options) options = {
            type: mimeType
        };
        var blob = new Blob(this.mediaBlobs, options);
        return blob;
    };
    // 获取BlobUrl
    Media.prototype.getBlobUrl = function(options) {
        if (!this.isReady()) return;
        try {
            var blob = this.getBlob(options);
            var mediaUrl = URL.createObjectURL(blob);
            return mediaUrl;
        } catch (err) {
            this.emit("error", {
                type: "getBlobUrl",
                message: err
            });
        }
    };
    Media.prototype.downloadBlob = function(filename) {
        var url = this.getBlobUrl();
        var a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "".concat(filename || "mediajs", ".webm");
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 150);
        return this;
    };
    // 获取时长
    Media.prototype.getDuration = function(blob) {
        var _this_1 = this;
        return new Promise(function(resolve, reject) {
            blob = blob || _this_1.getBlob();
            var _this = _this_1;
            var audioContext = new AudioContext();
            var reader = new FileReader();
            reader.onload = function() {
                var arrayBuffer = this.result;
                audioContext.decodeAudioData(arrayBuffer, function(buffer) {
                    var duration = Math.round(buffer.duration * 1000);
                    resolve(duration);
                }, function(err) {
                    _this.emit("error", "getDuration", "getDuration function is err");
                    reject(err);
                });
            };
            if (blob) reader.readAsArrayBuffer(blob);
            else _this.emit("error", "getDuration", "blob is Empty");
        });
    };
    Media.prototype._enumerateDevices = function() {
        return $cc400760811d54a9$var$__awaiter(this, void 0, void 0, function() {
            var devices, err_2;
            return $cc400760811d54a9$var$__generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        _a.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4 /*yield*/ ,
                            navigator.mediaDevices.enumerateDevices()
                        ];
                    case 1:
                        devices = _a.sent();
                        return [
                            2 /*return*/ ,
                            devices
                        ];
                    case 2:
                        err_2 = _a.sent();
                        this.emit("error", {
                            type: "_enumerateDevices",
                            message: err_2
                        });
                        return [
                            3 /*break*/ ,
                            3
                        ];
                    case 3:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    Media.prototype.getSupportedMimeTypes = function() {
        var media = this.mediaType === "audio" ? "audio" : "video";
        var types = [
            "webm",
            "mp4",
            "ogg",
            "mov",
            "avi",
            "wmv",
            "flv",
            "mkv",
            "ts",
            "x-matroska"
        ];
        var codecs = [
            "vp9",
            "vp9.0",
            "vp8",
            "vp8.0",
            "avc1",
            "av1",
            "h265",
            "h264"
        ];
        var supported = [];
        var isSupported = MediaRecorder.isTypeSupported;
        types.forEach(function(type) {
            var mimeType = "".concat(media, "/").concat(type);
            codecs.forEach(function(codec) {
                return [
                    "".concat(mimeType, ";codecs=").concat(codec),
                    "".concat(mimeType, ";codecs=").concat(codec.toUpperCase())
                ].forEach(function(variation) {
                    if (isSupported(variation)) supported.push(variation);
                });
            });
            if (isSupported(mimeType)) supported.push(mimeType);
        });
        return supported;
    };
    Media.prototype._isTypeSupported = function(mimeType) {
        return MediaRecorder.isTypeSupported(mimeType);
    };
    Media.prototype.getVideoTracks = function(stream) {
        stream = stream || this.mediaStream;
        return stream.getVideoTracks();
    };
    Media.prototype.connectVideo = function(video) {
        video.srcObject = this.mediaStream;
        return this;
    };
    Media.prototype.connectAudio = function(audio) {
        audio.srcObject = this.mediaStream;
        return this;
    };
    Media.prototype.snapshot = function(canvas, video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        return this;
    };
    return Media;
}((0, $94f9d0604343ce39$export$2e2bcd8739ae039));
var $cc400760811d54a9$export$2e2bcd8739ae039 = $cc400760811d54a9$export$7fc53215244aec38;


function $874dd1cd4df196bc$export$592b77e6034db746(option) {
    var audio = new (0, $cc400760811d54a9$exports.Media)("audio", option);
    return audio;
}
function $874dd1cd4df196bc$export$5f8d3589eb8441ca(option) {
    var video = new (0, $cc400760811d54a9$exports.Media)("video", option);
    return video;
}
function $874dd1cd4df196bc$export$be623a1d3e871e62(option) {
    var screen = new (0, $cc400760811d54a9$exports.Media)("screen", option);
    return screen;
}
var $874dd1cd4df196bc$export$2e2bcd8739ae039 = (0, $cc400760811d54a9$exports.Media);



var $face5264434edf64$exports = {};
$face5264434edf64$exports = JSON.parse('{"name":"mediajs","version":"1.0.0","keywords":["mediajs","webrtc","adapter","audio","video","screen"],"description":"MediaJS is a JavaScript library that can record audio, video and screen ","homepage":"https://mediajs.com","bugs":{"url":"https://github.com/027xiguapi/mediajs/issues"},"repository":{"type":"git","url":"https://github.com/027xiguapi/mediajs"},"license":"MIT","contributors":["027xiguapi <458813868@qq.com>"],"files":["dist/*"],"sideEffects":["src/global.ts","src/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/mediajs.global.min.js","browser-unminified":"dist/mediajs.global.js","types":"dist/types.d.ts","engines":{"node":">= 18"},"targets":{"types":{"source":"src/exports.ts"},"main":{"source":"src/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"src/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"cover 99%, not dead"},"source":"src/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"cover 99%, not dead"},"source":"src/global.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit","watch":"parcel watch","build":"rimraf dist && parcel build","prepublishOnly":"npm run build","format":"prettier --write .","semantic-release":"semantic-release","mocha":"mocha --timeout 5000 \'examples/src/content/**/test.js\'"},"devDependencies":{"@parcel/config-default":"^2.8.1","@parcel/packager-ts":"^2.8.1","@parcel/transformer-typescript-tsc":"^2.8.1","@parcel/transformer-typescript-types":"^2.8.1","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@swc/core":"^1.3.27","chai":"^4.3.7","mocha":"^10.2.0","parcel":"^2.8.1","parcel-transformer-tsc-sourcemaps":"^1.0.2","prettier":"^2.6.2","selenium-webdriver":"^4.8.2","semantic-release":"^20.0.0","typescript":"^4.5.5"},"dependencies":{"@swc/helpers":"^0.4.0","webrtc-adapter":"^8.0.0"}}');


window.mediajs = {
    audio: (0, $874dd1cd4df196bc$export$592b77e6034db746),
    video: (0, $874dd1cd4df196bc$export$5f8d3589eb8441ca),
    screen: (0, $874dd1cd4df196bc$export$be623a1d3e871e62),
    Env: (0, $72109226dc759154$export$6c0517834721cef7),
    version: (0, $face5264434edf64$exports.version)
}; /** @deprecated Should use mediajs namespace */ 

})();
//# sourceMappingURL=mediajs.global.js.map
