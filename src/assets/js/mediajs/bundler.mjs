import $jhLqu$webrtcadapter from "webrtc-adapter";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $e9ffe68d05bccd81$exports = {};

$parcel$export($e9ffe68d05bccd81$exports, "Media", () => $e9ffe68d05bccd81$export$7fc53215244aec38, (v) => $e9ffe68d05bccd81$export$7fc53215244aec38 = v);
var $0faa27846992b352$var$EventTarget = /** @class */ function() {
    function EventTarget() {
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
    }
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
        var decor = function() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++)args[_i] = arguments[_i];
            fn.apply(_this, args);
            _this.off(name, decor);
        };
        this.on(name, decor);
    };
    return EventTarget;
}();
var $0faa27846992b352$export$2e2bcd8739ae039 = $0faa27846992b352$var$EventTarget;


var $7cb39737df18b77d$export$31da179f3c64051c = /** @class */ function() {
    function SoundMeter(context) {
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
    }
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
var $7cb39737df18b77d$export$2e2bcd8739ae039 = $7cb39737df18b77d$export$31da179f3c64051c;



var $76a7ace0608a6528$var$webRTCAdapter = //@ts-ignore
(0, $jhLqu$webrtcadapter).default || (0, $jhLqu$webrtcadapter);
var $76a7ace0608a6528$export$6c0517834721cef7 = new /** @class */ (function() {
    function class_1() {
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
    }
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
        return $76a7ace0608a6528$var$webRTCAdapter.browserDetails.browser;
    };
    class_1.prototype.getVersion = function() {
        return $76a7ace0608a6528$var$webRTCAdapter.browserDetails.version || 0;
    };
    class_1.prototype.isUnifiedPlanSupported = function() {
        var browser = this.getBrowser();
        var version = $76a7ace0608a6528$var$webRTCAdapter.browserDetails.version || 0;
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


var $e9ffe68d05bccd81$var$__extends = undefined && undefined.__extends || function() {
    var extendStatics = function(d, b) {
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
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var $e9ffe68d05bccd81$var$__assign = undefined && undefined.__assign || function() {
    $e9ffe68d05bccd81$var$__assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return $e9ffe68d05bccd81$var$__assign.apply(this, arguments);
};
var $e9ffe68d05bccd81$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var $e9ffe68d05bccd81$var$__generator = undefined && undefined.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
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
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
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
    }
};
var $e9ffe68d05bccd81$export$7fc53215244aec38 = /** @class */ function(_super) {
    $e9ffe68d05bccd81$var$__extends(Media, _super);
    function Media(mediaType, option) {
        var _this_1 = _super.call(this) || this;
        _this_1.mediaStream = null;
        _this_1.mediaRecorder = null;
        _this_1.mediaBlobs = [];
        _this_1.soundMeter = null;
        _this_1.mediaState = "inactive";
        _this_1.mediaStreamConstraints = null;
        _this_1.mediaRecorderOptions = null;
        _this_1.timeSlice = null;
        if ((0, $76a7ace0608a6528$export$6c0517834721cef7).isUnifiedPlanSupported()) _this_1.setMediaType(mediaType).setConfig(option);
        else _this_1.emit("error", {
            type: "constructor",
            message: "".concat((0, $76a7ace0608a6528$export$6c0517834721cef7).toString())
        });
        return _this_1;
    }
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
        return $e9ffe68d05bccd81$var$__awaiter(this, void 0, void 0, function() {
            var _constraints, mediaType, _a, _b, err_1;
            return $e9ffe68d05bccd81$var$__generator(this, function(_c) {
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
        var _constraints = $e9ffe68d05bccd81$var$__assign($e9ffe68d05bccd81$var$__assign({}, this.getMediaStreamConstraints()), constraints);
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
        var _options = $e9ffe68d05bccd81$var$__assign($e9ffe68d05bccd81$var$__assign({}, this.getMediaRecorderOptions()), options);
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
        return $e9ffe68d05bccd81$var$__awaiter(this, void 0, void 0, function() {
            var media;
            return $e9ffe68d05bccd81$var$__generator(this, function(_a) {
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
            this.soundMeter = new (0, $7cb39737df18b77d$export$2e2bcd8739ae039)(audioContext);
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
        return $e9ffe68d05bccd81$var$__awaiter(this, void 0, void 0, function() {
            var devices, err_2;
            return $e9ffe68d05bccd81$var$__generator(this, function(_a) {
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
}((0, $0faa27846992b352$export$2e2bcd8739ae039));
var $e9ffe68d05bccd81$export$2e2bcd8739ae039 = $e9ffe68d05bccd81$export$7fc53215244aec38;


function $87d4d173ab66772c$export$592b77e6034db746(option) {
    var audio = new (0, $e9ffe68d05bccd81$exports.Media)("audio", option);
    return audio;
}
function $87d4d173ab66772c$export$5f8d3589eb8441ca(option) {
    var video = new (0, $e9ffe68d05bccd81$exports.Media)("video", option);
    return video;
}
function $87d4d173ab66772c$export$be623a1d3e871e62(option) {
    var screen = new (0, $e9ffe68d05bccd81$exports.Media)("screen", option);
    return screen;
}
var $87d4d173ab66772c$export$2e2bcd8739ae039 = (0, $e9ffe68d05bccd81$exports.Media);


export {$87d4d173ab66772c$export$592b77e6034db746 as audio, $87d4d173ab66772c$export$5f8d3589eb8441ca as video, $87d4d173ab66772c$export$be623a1d3e871e62 as screen, $87d4d173ab66772c$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=bundler.mjs.map
