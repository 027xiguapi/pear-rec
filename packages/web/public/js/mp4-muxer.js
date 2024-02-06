"use strict";
var Mp4Muxer = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    ArrayBufferTarget: () => ArrayBufferTarget,
    FileSystemWritableFileStreamTarget: () => FileSystemWritableFileStreamTarget,
    Muxer: () => Muxer,
    StreamTarget: () => StreamTarget
  });

  // src/misc.ts
  var bytes = new Uint8Array(8);
  var view = new DataView(bytes.buffer);
  var u8 = (value) => {
    return [(value % 256 + 256) % 256];
  };
  var u16 = (value) => {
    view.setUint16(0, value, false);
    return [bytes[0], bytes[1]];
  };
  var i16 = (value) => {
    view.setInt16(0, value, false);
    return [bytes[0], bytes[1]];
  };
  var u24 = (value) => {
    view.setUint32(0, value, false);
    return [bytes[1], bytes[2], bytes[3]];
  };
  var u32 = (value) => {
    view.setUint32(0, value, false);
    return [bytes[0], bytes[1], bytes[2], bytes[3]];
  };
  var u64 = (value) => {
    view.setUint32(0, Math.floor(value / 2 ** 32), false);
    view.setUint32(4, value, false);
    return [bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7]];
  };
  var fixed_8_8 = (value) => {
    view.setInt16(0, 2 ** 8 * value, false);
    return [bytes[0], bytes[1]];
  };
  var fixed_16_16 = (value) => {
    view.setInt32(0, 2 ** 16 * value, false);
    return [bytes[0], bytes[1], bytes[2], bytes[3]];
  };
  var fixed_2_30 = (value) => {
    view.setInt32(0, 2 ** 30 * value, false);
    return [bytes[0], bytes[1], bytes[2], bytes[3]];
  };
  var ascii = (text, nullTerminated = false) => {
    let bytes2 = Array(text.length).fill(null).map((_, i) => text.charCodeAt(i));
    if (nullTerminated)
      bytes2.push(0);
    return bytes2;
  };
  var last = (arr) => {
    return arr && arr[arr.length - 1];
  };
  var intoTimescale = (timeInSeconds, timescale, round = true) => {
    let value = timeInSeconds * timescale;
    return round ? Math.round(value) : value;
  };
  var rotationMatrix = (rotationInDegrees) => {
    let theta = rotationInDegrees * (Math.PI / 180);
    let cosTheta = Math.cos(theta);
    let sinTheta = Math.sin(theta);
    return [
      cosTheta,
      sinTheta,
      0,
      -sinTheta,
      cosTheta,
      0,
      0,
      0,
      1
    ];
  };
  var IDENTITY_MATRIX = rotationMatrix(0);
  var matrixToBytes = (matrix) => {
    return [
      fixed_16_16(matrix[0]),
      fixed_16_16(matrix[1]),
      fixed_2_30(matrix[2]),
      fixed_16_16(matrix[3]),
      fixed_16_16(matrix[4]),
      fixed_2_30(matrix[5]),
      fixed_16_16(matrix[6]),
      fixed_16_16(matrix[7]),
      fixed_2_30(matrix[8])
    ];
  };
  var deepClone = (x) => {
    if (!x)
      return x;
    if (typeof x !== "object")
      return x;
    if (Array.isArray(x))
      return x.map(deepClone);
    return Object.fromEntries(Object.entries(x).map(([key, value]) => [key, deepClone(value)]));
  };

  // src/box.ts
  var box = (type, contents, children) => ({
    type,
    contents: contents && new Uint8Array(contents.flat(10)),
    children
  });
  var fullBox = (type, version, flags, contents, children) => box(
    type,
    [u8(version), u24(flags), contents ?? []],
    children
  );
  var ftyp = (holdsHevc) => {
    if (holdsHevc)
      return box("ftyp", [
        ascii("isom"),
        // Major brand
        u32(0),
        // Minor version
        ascii("iso4"),
        // Compatible brand 1
        ascii("hvc1")
        // Compatible brand 2
      ]);
    return box("ftyp", [
      ascii("isom"),
      // Major brand
      u32(0),
      // Minor version
      ascii("isom"),
      // Compatible brand 1
      ascii("avc1"),
      // Compatible brand 2
      ascii("mp41")
      // Compatible brand 3
    ]);
  };
  var mdat = (reserveLargeSize) => ({ type: "mdat", largeSize: reserveLargeSize });
  var free = (size) => ({ type: "free", size });
  var moov = (tracks, creationTime) => box("moov", null, [
    mvhd(creationTime, tracks),
    ...tracks.map((x) => trak(x, creationTime))
  ]);
  var mvhd = (creationTime, tracks) => {
    let duration = intoTimescale(Math.max(
      0,
      ...tracks.filter((x) => x.samples.length > 0).map((x) => last(x.samples).timestamp + last(x.samples).duration)
    ), GLOBAL_TIMESCALE);
    let nextTrackId = Math.max(...tracks.map((x) => x.id)) + 1;
    return fullBox("mvhd", 0, 0, [
      u32(creationTime),
      // Creation time
      u32(creationTime),
      // Modification time
      u32(GLOBAL_TIMESCALE),
      // Timescale
      u32(duration),
      // Duration
      fixed_16_16(1),
      // Preferred rate
      fixed_8_8(1),
      // Preferred volume
      Array(10).fill(0),
      // Reserved
      matrixToBytes(IDENTITY_MATRIX),
      // Matrix
      Array(24).fill(0),
      // Pre-defined
      u32(nextTrackId)
      // Next track ID
    ]);
  };
  var trak = (track, creationTime) => box("trak", null, [
    tkhd(track, creationTime),
    mdia(track, creationTime)
  ]);
  var tkhd = (track, creationTime) => {
    let lastSample = last(track.samples);
    let durationInGlobalTimescale = intoTimescale(
      lastSample ? lastSample.timestamp + lastSample.duration : 0,
      GLOBAL_TIMESCALE
    );
    return fullBox("tkhd", 0, 3, [
      u32(creationTime),
      // Creation time
      u32(creationTime),
      // Modification time
      u32(track.id),
      // Track ID
      u32(0),
      // Reserved
      u32(durationInGlobalTimescale),
      // Duration
      Array(8).fill(0),
      // Reserved
      u16(0),
      // Layer
      u16(0),
      // Alternate group
      fixed_8_8(track.info.type === "audio" ? 1 : 0),
      // Volume
      u16(0),
      // Reserved
      matrixToBytes(rotationMatrix(track.info.type === "video" ? track.info.rotation : 0)),
      // Matrix
      fixed_16_16(track.info.type === "video" ? track.info.width : 0),
      // Track width
      fixed_16_16(track.info.type === "video" ? track.info.height : 0)
      // Track height
    ]);
  };
  var mdia = (track, creationTime) => box("mdia", null, [
    mdhd(track, creationTime),
    hdlr(track.info.type === "video" ? "vide" : "soun"),
    minf(track)
  ]);
  var mdhd = (track, creationTime) => {
    let lastSample = last(track.samples);
    let localDuration = intoTimescale(
      lastSample ? lastSample.timestamp + lastSample.duration : 0,
      track.timescale
    );
    return fullBox("mdhd", 0, 0, [
      u32(creationTime),
      // Creation time
      u32(creationTime),
      // Modification time
      u32(track.timescale),
      // Timescale
      u32(localDuration),
      // Duration
      u16(21956),
      // Language ("und", undetermined)
      u16(0)
      // Quality
    ]);
  };
  var hdlr = (componentSubtype) => fullBox("hdlr", 0, 0, [
    ascii("mhlr"),
    // Component type
    ascii(componentSubtype),
    // Component subtype
    u32(0),
    // Component manufacturer
    u32(0),
    // Component flags
    u32(0),
    // Component flags mask
    ascii("mp4-muxer-hdlr")
    // Component name
  ]);
  var minf = (track) => box("minf", null, [
    track.info.type === "video" ? vmhd() : smhd(),
    dinf(),
    stbl(track)
  ]);
  var vmhd = () => fullBox("vmhd", 0, 1, [
    u16(0),
    // Graphics mode
    u16(0),
    // Opcolor R
    u16(0),
    // Opcolor G
    u16(0)
    // Opcolor B
  ]);
  var smhd = () => fullBox("smhd", 0, 0, [
    u16(0),
    // Balance
    u16(0)
    // Reserved
  ]);
  var dinf = () => box("dinf", null, [
    dref()
  ]);
  var dref = () => fullBox("dref", 0, 0, [
    u32(1)
    // Entry count
  ], [
    url()
  ]);
  var url = () => fullBox("url ", 0, 1);
  var stbl = (track) => box("stbl", null, [
    stsd(track),
    stts(track),
    stss(track),
    stsc(track),
    stsz(track),
    stco(track)
  ]);
  var stsd = (track) => fullBox("stsd", 0, 0, [
    u32(1)
    // Entry count
  ], [
    track.info.type === "video" ? videoSampleDescription(
      VIDEO_CODEC_TO_BOX_NAME[track.info.codec],
      track
    ) : soundSampleDescription(
      AUDIO_CODEC_TO_BOX_NAME[track.info.codec],
      track
    )
  ]);
  var videoSampleDescription = (compressionType, track) => box(compressionType, [
    Array(6).fill(0),
    // Reserved
    u16(1),
    // Data reference index
    u16(0),
    // Pre-defined
    u16(0),
    // Reserved
    Array(12).fill(0),
    // Pre-defined
    u16(track.info.width),
    // Width
    u16(track.info.height),
    // Height
    u32(4718592),
    // Horizontal resolution
    u32(4718592),
    // Vertical resolution
    u32(0),
    // Reserved
    u16(1),
    // Frame count
    Array(32).fill(0),
    // Compressor name
    u16(24),
    // Depth
    i16(65535)
    // Pre-defined
  ], [
    VIDEO_CODEC_TO_CONFIGURATION_BOX[track.info.codec](track)
  ]);
  var avcC = (track) => track.codecPrivate && box("avcC", [...track.codecPrivate]);
  var hvcC = (track) => track.codecPrivate && box("hvcC", [...track.codecPrivate]);
  var vpcC = (track) => track.codecPrivate && box("vpcC", [...track.codecPrivate]);
  var av1C = (track) => track.codecPrivate && box("av1C", [...track.codecPrivate]);
  var soundSampleDescription = (compressionType, track) => box(compressionType, [
    Array(6).fill(0),
    // Reserved
    u16(1),
    // Data reference index
    u16(0),
    // Version
    u16(0),
    // Revision level
    u32(0),
    // Vendor
    u16(track.info.numberOfChannels),
    // Number of channels
    u16(16),
    // Sample size (bits)
    u16(0),
    // Compression ID
    u16(0),
    // Packet size
    fixed_16_16(track.info.sampleRate)
    // Sample rate
  ], [
    AUDIO_CODEC_TO_CONFIGURATION_BOX[track.info.codec](track)
  ]);
  var esds = (track) => fullBox("esds", 0, 0, [
    // https://stackoverflow.com/a/54803118
    u32(58753152),
    // TAG(3) = Object Descriptor ([2])
    u8(32 + track.codecPrivate.byteLength),
    // length of this OD (which includes the next 2 tags)
    u16(1),
    // ES_ID = 1
    u8(0),
    // flags etc = 0
    u32(75530368),
    // TAG(4) = ES Descriptor ([2]) embedded in above OD
    u8(18 + track.codecPrivate.byteLength),
    // length of this ESD
    u8(64),
    // MPEG-4 Audio
    u8(21),
    // stream type(6bits)=5 audio, flags(2bits)=1
    u24(0),
    // 24bit buffer size
    u32(130071),
    // max bitrate
    u32(130071),
    // avg bitrate
    u32(92307584),
    // TAG(5) = ASC ([2],[3]) embedded in above OD
    u8(track.codecPrivate.byteLength),
    // length
    ...track.codecPrivate,
    u32(109084800),
    // TAG(6)
    u8(1),
    // length
    u8(2)
    // data
  ]);
  var dOps = (track) => box("dOps", [
    u8(0),
    // Version
    u8(track.info.numberOfChannels),
    // OutputChannelCount
    u16(3840),
    // PreSkip, should be at least 80 milliseconds worth of playback, measured in 48000 Hz samples
    u32(track.info.sampleRate),
    // InputSampleRate
    fixed_8_8(0),
    // OutputGain
    u8(0)
    // ChannelMappingFamily
  ]);
  var stts = (track) => {
    return fullBox("stts", 0, 0, [
      u32(track.timeToSampleTable.length),
      // Number of entries
      track.timeToSampleTable.map((x) => [
        // Time-to-sample table
        u32(x.sampleCount),
        // Sample count
        u32(x.sampleDelta)
        // Sample duration
      ])
    ]);
  };
  var stss = (track) => {
    if (track.samples.every((x) => x.type === "key"))
      return null;
    let keySamples = [...track.samples.entries()].filter(([, sample]) => sample.type === "key");
    return fullBox("stss", 0, 0, [
      u32(keySamples.length),
      // Number of entries
      keySamples.map(([index]) => u32(index + 1))
      // Sync sample table
    ]);
  };
  var stsc = (track) => {
    return fullBox("stsc", 0, 0, [
      u32(track.compactlyCodedChunkTable.length),
      // Number of entries
      track.compactlyCodedChunkTable.map((x) => [
        // Sample-to-chunk table
        u32(x.firstChunk),
        // First chunk
        u32(x.samplesPerChunk),
        // Samples per chunk
        u32(1)
        // Sample description index
      ])
    ]);
  };
  var stsz = (track) => fullBox("stsz", 0, 0, [
    u32(0),
    // Sample size (0 means non-constant size)
    u32(track.samples.length),
    // Number of entries
    track.samples.map((x) => u32(x.size))
    // Sample size table
  ]);
  var stco = (track) => {
    if (track.finalizedChunks.length > 0 && last(track.finalizedChunks).offset >= 2 ** 32) {
      return fullBox("co64", 0, 0, [
        u32(track.finalizedChunks.length),
        // Number of entries
        track.finalizedChunks.map((x) => u64(x.offset))
        // Chunk offset table
      ]);
    }
    return fullBox("stco", 0, 0, [
      u32(track.finalizedChunks.length),
      // Number of entries
      track.finalizedChunks.map((x) => u32(x.offset))
      // Chunk offset table
    ]);
  };
  var VIDEO_CODEC_TO_BOX_NAME = {
    "avc": "avc1",
    "hevc": "hvc1",
    "vp9": "vp09",
    "av1": "av01"
  };
  var VIDEO_CODEC_TO_CONFIGURATION_BOX = {
    "avc": avcC,
    "hevc": hvcC,
    "vp9": vpcC,
    "av1": av1C
  };
  var AUDIO_CODEC_TO_BOX_NAME = {
    "aac": "mp4a",
    "opus": "Opus"
  };
  var AUDIO_CODEC_TO_CONFIGURATION_BOX = {
    "aac": esds,
    "opus": dOps
  };

  // src/target.ts
  var ArrayBufferTarget = class {
    constructor() {
      this.buffer = null;
    }
  };
  var StreamTarget = class {
    constructor(onData, onDone, options) {
      this.onData = onData;
      this.onDone = onDone;
      this.options = options;
    }
  };
  var FileSystemWritableFileStreamTarget = class {
    constructor(stream, options) {
      this.stream = stream;
      this.options = options;
    }
  };

  // src/writer.ts
  var _helper, _helperView;
  var Writer = class {
    constructor() {
      this.pos = 0;
      __privateAdd(this, _helper, new Uint8Array(8));
      __privateAdd(this, _helperView, new DataView(__privateGet(this, _helper).buffer));
      /**
       * Stores the position from the start of the file to where boxes elements have been written. This is used to
       * rewrite/edit elements that were already added before, and to measure sizes of things.
       */
      this.offsets = /* @__PURE__ */ new WeakMap();
    }
    /** Sets the current position for future writes to a new one. */
    seek(newPos) {
      this.pos = newPos;
    }
    writeU32(value) {
      __privateGet(this, _helperView).setUint32(0, value, false);
      this.write(__privateGet(this, _helper).subarray(0, 4));
    }
    writeU64(value) {
      __privateGet(this, _helperView).setUint32(0, Math.floor(value / 2 ** 32), false);
      __privateGet(this, _helperView).setUint32(4, value, false);
      this.write(__privateGet(this, _helper).subarray(0, 8));
    }
    writeAscii(text) {
      for (let i = 0; i < text.length; i++) {
        __privateGet(this, _helperView).setUint8(i % 8, text.charCodeAt(i));
        if (i % 8 === 7)
          this.write(__privateGet(this, _helper));
      }
      if (text.length % 8 !== 0) {
        this.write(__privateGet(this, _helper).subarray(0, text.length % 8));
      }
    }
    writeBox(box2) {
      this.offsets.set(box2, this.pos);
      if (box2.contents && !box2.children) {
        this.writeBoxHeader(box2, box2.size ?? box2.contents.byteLength + 8);
        this.write(box2.contents);
      } else {
        let startPos = this.pos;
        this.writeBoxHeader(box2, 0);
        if (box2.contents)
          this.write(box2.contents);
        if (box2.children) {
          for (let child of box2.children)
            if (child)
              this.writeBox(child);
        }
        let endPos = this.pos;
        let size = box2.size ?? endPos - startPos;
        this.seek(startPos);
        this.writeBoxHeader(box2, size);
        this.seek(endPos);
      }
    }
    writeBoxHeader(box2, size) {
      this.writeU32(box2.largeSize ? 1 : size);
      this.writeAscii(box2.type);
      if (box2.largeSize)
        this.writeU64(size);
    }
    measureBoxHeader(box2) {
      return 8 + (box2.largeSize ? 8 : 0);
    }
    patchBox(box2) {
      let endPos = this.pos;
      this.seek(this.offsets.get(box2));
      this.writeBox(box2);
      this.seek(endPos);
    }
    measureBox(box2) {
      if (box2.contents && !box2.children) {
        let headerSize = this.measureBoxHeader(box2);
        return headerSize + box2.contents.byteLength;
      } else {
        let result = this.measureBoxHeader(box2);
        if (box2.contents)
          result += box2.contents.byteLength;
        if (box2.children) {
          for (let child of box2.children)
            if (child)
              result += this.measureBox(child);
        }
        return result;
      }
    }
  };
  _helper = new WeakMap();
  _helperView = new WeakMap();
  var _target, _buffer, _bytes, _maxPos, _ensureSize, ensureSize_fn;
  var ArrayBufferTargetWriter = class extends Writer {
    constructor(target) {
      super();
      __privateAdd(this, _ensureSize);
      __privateAdd(this, _target, void 0);
      __privateAdd(this, _buffer, new ArrayBuffer(2 ** 16));
      __privateAdd(this, _bytes, new Uint8Array(__privateGet(this, _buffer)));
      __privateAdd(this, _maxPos, 0);
      __privateSet(this, _target, target);
    }
    write(data) {
      __privateMethod(this, _ensureSize, ensureSize_fn).call(this, this.pos + data.byteLength);
      __privateGet(this, _bytes).set(data, this.pos);
      this.pos += data.byteLength;
      __privateSet(this, _maxPos, Math.max(__privateGet(this, _maxPos), this.pos));
    }
    finalize() {
      __privateMethod(this, _ensureSize, ensureSize_fn).call(this, this.pos);
      __privateGet(this, _target).buffer = __privateGet(this, _buffer).slice(0, Math.max(__privateGet(this, _maxPos), this.pos));
    }
  };
  _target = new WeakMap();
  _buffer = new WeakMap();
  _bytes = new WeakMap();
  _maxPos = new WeakMap();
  _ensureSize = new WeakSet();
  ensureSize_fn = function(size) {
    let newLength = __privateGet(this, _buffer).byteLength;
    while (newLength < size)
      newLength *= 2;
    if (newLength === __privateGet(this, _buffer).byteLength)
      return;
    let newBuffer = new ArrayBuffer(newLength);
    let newBytes = new Uint8Array(newBuffer);
    newBytes.set(__privateGet(this, _bytes), 0);
    __privateSet(this, _buffer, newBuffer);
    __privateSet(this, _bytes, newBytes);
  };
  var _target2, _sections;
  var StreamTargetWriter = class extends Writer {
    constructor(target) {
      super();
      __privateAdd(this, _target2, void 0);
      __privateAdd(this, _sections, []);
      __privateSet(this, _target2, target);
    }
    write(data) {
      __privateGet(this, _sections).push({
        data: data.slice(),
        start: this.pos
      });
      this.pos += data.byteLength;
    }
    flush() {
      if (__privateGet(this, _sections).length === 0)
        return;
      let chunks = [];
      let sorted = [...__privateGet(this, _sections)].sort((a, b) => a.start - b.start);
      chunks.push({
        start: sorted[0].start,
        size: sorted[0].data.byteLength
      });
      for (let i = 1; i < sorted.length; i++) {
        let lastChunk = chunks[chunks.length - 1];
        let section = sorted[i];
        if (section.start <= lastChunk.start + lastChunk.size) {
          lastChunk.size = Math.max(lastChunk.size, section.start + section.data.byteLength - lastChunk.start);
        } else {
          chunks.push({
            start: section.start,
            size: section.data.byteLength
          });
        }
      }
      for (let chunk of chunks) {
        chunk.data = new Uint8Array(chunk.size);
        for (let section of __privateGet(this, _sections)) {
          if (chunk.start <= section.start && section.start < chunk.start + chunk.size) {
            chunk.data.set(section.data, section.start - chunk.start);
          }
        }
        __privateGet(this, _target2).onData(chunk.data, chunk.start);
      }
      __privateGet(this, _sections).length = 0;
    }
    finalize() {
      __privateGet(this, _target2).onDone?.();
    }
  };
  _target2 = new WeakMap();
  _sections = new WeakMap();
  var DEFAULT_CHUNK_SIZE = 2 ** 24;
  var MAX_CHUNKS_AT_ONCE = 2;
  var _target3, _chunkSize, _chunks, _writeDataIntoChunks, writeDataIntoChunks_fn, _insertSectionIntoChunk, insertSectionIntoChunk_fn, _createChunk, createChunk_fn, _flushChunks, flushChunks_fn;
  var ChunkedStreamTargetWriter = class extends Writer {
    constructor(target) {
      super();
      __privateAdd(this, _writeDataIntoChunks);
      __privateAdd(this, _insertSectionIntoChunk);
      __privateAdd(this, _createChunk);
      __privateAdd(this, _flushChunks);
      __privateAdd(this, _target3, void 0);
      __privateAdd(this, _chunkSize, void 0);
      /**
       * The data is divided up into fixed-size chunks, whose contents are first filled in RAM and then flushed out.
       * A chunk is flushed if all of its contents have been written.
       */
      __privateAdd(this, _chunks, []);
      __privateSet(this, _target3, target);
      __privateSet(this, _chunkSize, target.options?.chunkSize ?? DEFAULT_CHUNK_SIZE);
      if (!Number.isInteger(__privateGet(this, _chunkSize)) || __privateGet(this, _chunkSize) < 2 ** 10) {
        throw new Error("Invalid StreamTarget options: chunkSize must be an integer not smaller than 1024.");
      }
    }
    write(data) {
      __privateMethod(this, _writeDataIntoChunks, writeDataIntoChunks_fn).call(this, data, this.pos);
      __privateMethod(this, _flushChunks, flushChunks_fn).call(this);
      this.pos += data.byteLength;
    }
    finalize() {
      __privateMethod(this, _flushChunks, flushChunks_fn).call(this, true);
      __privateGet(this, _target3).onDone?.();
    }
  };
  _target3 = new WeakMap();
  _chunkSize = new WeakMap();
  _chunks = new WeakMap();
  _writeDataIntoChunks = new WeakSet();
  writeDataIntoChunks_fn = function(data, position) {
    let chunkIndex = __privateGet(this, _chunks).findIndex((x) => x.start <= position && position < x.start + __privateGet(this, _chunkSize));
    if (chunkIndex === -1)
      chunkIndex = __privateMethod(this, _createChunk, createChunk_fn).call(this, position);
    let chunk = __privateGet(this, _chunks)[chunkIndex];
    let relativePosition = position - chunk.start;
    let toWrite = data.subarray(0, Math.min(__privateGet(this, _chunkSize) - relativePosition, data.byteLength));
    chunk.data.set(toWrite, relativePosition);
    let section = {
      start: relativePosition,
      end: relativePosition + toWrite.byteLength
    };
    __privateMethod(this, _insertSectionIntoChunk, insertSectionIntoChunk_fn).call(this, chunk, section);
    if (chunk.written[0].start === 0 && chunk.written[0].end === __privateGet(this, _chunkSize)) {
      chunk.shouldFlush = true;
    }
    if (__privateGet(this, _chunks).length > MAX_CHUNKS_AT_ONCE) {
      for (let i = 0; i < __privateGet(this, _chunks).length - 1; i++) {
        __privateGet(this, _chunks)[i].shouldFlush = true;
      }
      __privateMethod(this, _flushChunks, flushChunks_fn).call(this);
    }
    if (toWrite.byteLength < data.byteLength) {
      __privateMethod(this, _writeDataIntoChunks, writeDataIntoChunks_fn).call(this, data.subarray(toWrite.byteLength), position + toWrite.byteLength);
    }
  };
  _insertSectionIntoChunk = new WeakSet();
  insertSectionIntoChunk_fn = function(chunk, section) {
    let low = 0;
    let high = chunk.written.length - 1;
    let index = -1;
    while (low <= high) {
      let mid = Math.floor(low + (high - low + 1) / 2);
      if (chunk.written[mid].start <= section.start) {
        low = mid + 1;
        index = mid;
      } else {
        high = mid - 1;
      }
    }
    chunk.written.splice(index + 1, 0, section);
    if (index === -1 || chunk.written[index].end < section.start)
      index++;
    while (index < chunk.written.length - 1 && chunk.written[index].end >= chunk.written[index + 1].start) {
      chunk.written[index].end = Math.max(chunk.written[index].end, chunk.written[index + 1].end);
      chunk.written.splice(index + 1, 1);
    }
  };
  _createChunk = new WeakSet();
  createChunk_fn = function(includesPosition) {
    let start = Math.floor(includesPosition / __privateGet(this, _chunkSize)) * __privateGet(this, _chunkSize);
    let chunk = {
      start,
      data: new Uint8Array(__privateGet(this, _chunkSize)),
      written: [],
      shouldFlush: false
    };
    __privateGet(this, _chunks).push(chunk);
    __privateGet(this, _chunks).sort((a, b) => a.start - b.start);
    return __privateGet(this, _chunks).indexOf(chunk);
  };
  _flushChunks = new WeakSet();
  flushChunks_fn = function(force = false) {
    for (let i = 0; i < __privateGet(this, _chunks).length; i++) {
      let chunk = __privateGet(this, _chunks)[i];
      if (!chunk.shouldFlush && !force)
        continue;
      for (let section of chunk.written) {
        __privateGet(this, _target3).onData(
          chunk.data.subarray(section.start, section.end),
          chunk.start + section.start
        );
      }
      __privateGet(this, _chunks).splice(i--, 1);
    }
  };
  var FileSystemWritableFileStreamTargetWriter = class extends ChunkedStreamTargetWriter {
    constructor(target) {
      super(new StreamTarget(
        (data, position) => target.stream.write({
          type: "write",
          data,
          position
        }),
        void 0,
        { chunkSize: target.options?.chunkSize }
      ));
    }
  };

  // src/muxer.ts
  var GLOBAL_TIMESCALE = 1e3;
  var SUPPORTED_VIDEO_CODECS2 = ["avc", "hevc", "vp9", "av1"];
  var SUPPORTED_AUDIO_CODECS2 = ["aac", "opus"];
  var TIMESTAMP_OFFSET = 2082844800;
  var MAX_CHUNK_DURATION = 0.5;
  var FIRST_TIMESTAMP_BEHAVIORS = ["strict", "offset"];
  var _options, _writer, _ftypSize, _mdat, _videoTrack, _audioTrack, _creationTime, _finalizedChunks, _finalized, _validateOptions, validateOptions_fn, _writeHeader, writeHeader_fn, _computeMoovSizeUpperBound, computeMoovSizeUpperBound_fn, _prepareTracks, prepareTracks_fn, _generateMpeg4AudioSpecificConfig, generateMpeg4AudioSpecificConfig_fn, _addSampleToTrack, addSampleToTrack_fn, _validateTimestamp, validateTimestamp_fn, _finalizeCurrentChunk, finalizeCurrentChunk_fn, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn, _ensureNotFinalized, ensureNotFinalized_fn;
  var Muxer = class {
    constructor(options) {
      __privateAdd(this, _validateOptions);
      __privateAdd(this, _writeHeader);
      __privateAdd(this, _computeMoovSizeUpperBound);
      __privateAdd(this, _prepareTracks);
      // https://wiki.multimedia.cx/index.php/MPEG-4_Audio
      __privateAdd(this, _generateMpeg4AudioSpecificConfig);
      __privateAdd(this, _addSampleToTrack);
      __privateAdd(this, _validateTimestamp);
      __privateAdd(this, _finalizeCurrentChunk);
      __privateAdd(this, _maybeFlushStreamingTargetWriter);
      __privateAdd(this, _ensureNotFinalized);
      __privateAdd(this, _options, void 0);
      __privateAdd(this, _writer, void 0);
      __privateAdd(this, _ftypSize, void 0);
      __privateAdd(this, _mdat, void 0);
      __privateAdd(this, _videoTrack, null);
      __privateAdd(this, _audioTrack, null);
      __privateAdd(this, _creationTime, Math.floor(Date.now() / 1e3) + TIMESTAMP_OFFSET);
      __privateAdd(this, _finalizedChunks, []);
      __privateAdd(this, _finalized, false);
      __privateMethod(this, _validateOptions, validateOptions_fn).call(this, options);
      options.video = deepClone(options.video);
      options.audio = deepClone(options.audio);
      options.fastStart = deepClone(options.fastStart);
      this.target = options.target;
      __privateSet(this, _options, {
        firstTimestampBehavior: "strict",
        ...options
      });
      if (options.target instanceof ArrayBufferTarget) {
        __privateSet(this, _writer, new ArrayBufferTargetWriter(options.target));
      } else if (options.target instanceof StreamTarget) {
        __privateSet(this, _writer, options.target.options?.chunked ? new ChunkedStreamTargetWriter(options.target) : new StreamTargetWriter(options.target));
      } else if (options.target instanceof FileSystemWritableFileStreamTarget) {
        __privateSet(this, _writer, new FileSystemWritableFileStreamTargetWriter(options.target));
      } else {
        throw new Error(`Invalid target: ${options.target}`);
      }
      __privateMethod(this, _writeHeader, writeHeader_fn).call(this);
      __privateMethod(this, _prepareTracks, prepareTracks_fn).call(this);
    }
    addVideoChunk(sample, meta, timestamp) {
      let data = new Uint8Array(sample.byteLength);
      sample.copyTo(data);
      this.addVideoChunkRaw(data, sample.type, timestamp ?? sample.timestamp, sample.duration, meta);
    }
    addVideoChunkRaw(data, type, timestamp, duration, meta) {
      __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
      if (!__privateGet(this, _options).video)
        throw new Error("No video track declared.");
      if (typeof __privateGet(this, _options).fastStart === "object" && __privateGet(this, _videoTrack).samples.length === __privateGet(this, _options).fastStart.expectedVideoChunks) {
        throw new Error(`Cannot add more video chunks than specified in 'fastStart' (${__privateGet(this, _options).fastStart.expectedVideoChunks}).`);
      }
      __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _videoTrack), data, type, timestamp, duration, meta);
    }
    addAudioChunk(sample, meta, timestamp) {
      let data = new Uint8Array(sample.byteLength);
      sample.copyTo(data);
      this.addAudioChunkRaw(data, sample.type, timestamp ?? sample.timestamp, sample.duration, meta);
    }
    addAudioChunkRaw(data, type, timestamp, duration, meta) {
      __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
      if (!__privateGet(this, _options).audio)
        throw new Error("No audio track declared.");
      if (typeof __privateGet(this, _options).fastStart === "object" && __privateGet(this, _audioTrack).samples.length === __privateGet(this, _options).fastStart.expectedAudioChunks) {
        throw new Error(`Cannot add more audio chunks than specified in 'fastStart' (${__privateGet(this, _options).fastStart.expectedAudioChunks}).`);
      }
      __privateMethod(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet(this, _audioTrack), data, type, timestamp, duration, meta);
    }
    /** Finalizes the file, making it ready for use. Must be called after all video and audio chunks have been added. */
    finalize() {
      if (__privateGet(this, _finalized)) {
        throw new Error("Cannot finalize a muxer more than once.");
      }
      if (__privateGet(this, _videoTrack))
        __privateMethod(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, __privateGet(this, _videoTrack));
      if (__privateGet(this, _audioTrack))
        __privateMethod(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, __privateGet(this, _audioTrack));
      let tracks = [__privateGet(this, _videoTrack), __privateGet(this, _audioTrack)].filter(Boolean);
      if (__privateGet(this, _options).fastStart === "in-memory") {
        let mdatSize;
        for (let i = 0; i < 2; i++) {
          let movieBox2 = moov(tracks, __privateGet(this, _creationTime));
          let movieBoxSize = __privateGet(this, _writer).measureBox(movieBox2);
          mdatSize = __privateGet(this, _writer).measureBox(__privateGet(this, _mdat));
          let currentChunkPos = __privateGet(this, _writer).pos + movieBoxSize + mdatSize;
          for (let chunk of __privateGet(this, _finalizedChunks)) {
            chunk.offset = currentChunkPos;
            for (let bytes2 of chunk.sampleData) {
              currentChunkPos += bytes2.byteLength;
              mdatSize += bytes2.byteLength;
            }
          }
          if (currentChunkPos < 2 ** 32)
            break;
          if (mdatSize >= 2 ** 32)
            __privateGet(this, _mdat).largeSize = true;
        }
        let movieBox = moov(tracks, __privateGet(this, _creationTime));
        __privateGet(this, _writer).writeBox(movieBox);
        __privateGet(this, _mdat).size = mdatSize;
        __privateGet(this, _writer).writeBox(__privateGet(this, _mdat));
        for (let chunk of __privateGet(this, _finalizedChunks)) {
          for (let bytes2 of chunk.sampleData)
            __privateGet(this, _writer).write(bytes2);
          chunk.sampleData = null;
        }
      } else {
        let mdatPos = __privateGet(this, _writer).offsets.get(__privateGet(this, _mdat));
        let mdatSize = __privateGet(this, _writer).pos - mdatPos;
        __privateGet(this, _mdat).size = mdatSize;
        __privateGet(this, _mdat).largeSize = mdatSize >= 2 ** 32;
        __privateGet(this, _writer).patchBox(__privateGet(this, _mdat));
        let movieBox = moov(tracks, __privateGet(this, _creationTime));
        if (typeof __privateGet(this, _options).fastStart === "object") {
          __privateGet(this, _writer).seek(__privateGet(this, _ftypSize));
          __privateGet(this, _writer).writeBox(movieBox);
          let remainingBytes = mdatPos - __privateGet(this, _writer).pos;
          __privateGet(this, _writer).writeBox(free(remainingBytes));
        } else {
          __privateGet(this, _writer).writeBox(movieBox);
        }
      }
      __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
      __privateGet(this, _writer).finalize();
      __privateSet(this, _finalized, true);
    }
  };
  _options = new WeakMap();
  _writer = new WeakMap();
  _ftypSize = new WeakMap();
  _mdat = new WeakMap();
  _videoTrack = new WeakMap();
  _audioTrack = new WeakMap();
  _creationTime = new WeakMap();
  _finalizedChunks = new WeakMap();
  _finalized = new WeakMap();
  _validateOptions = new WeakSet();
  validateOptions_fn = function(options) {
    if (options.video) {
      if (!SUPPORTED_VIDEO_CODECS2.includes(options.video.codec)) {
        throw new Error(`Unsupported video codec: ${options.video.codec}`);
      }
      if (options.video.rotation !== void 0 && ![0, 90, 180, 270].includes(options.video.rotation)) {
        throw new Error(`Invalid video rotation: ${options.video.rotation}. Has to be 0, 90, 180 or 270.`);
      }
    }
    if (options.audio && !SUPPORTED_AUDIO_CODECS2.includes(options.audio.codec)) {
      throw new Error(`Unsupported audio codec: ${options.audio.codec}`);
    }
    if (options.firstTimestampBehavior && !FIRST_TIMESTAMP_BEHAVIORS.includes(options.firstTimestampBehavior)) {
      throw new Error(`Invalid first timestamp behavior: ${options.firstTimestampBehavior}`);
    }
    if (typeof options.fastStart === "object") {
      if (options.video && options.fastStart.expectedVideoChunks === void 0) {
        throw new Error(`'fastStart' is an object but is missing property 'expectedVideoChunks'.`);
      }
      if (options.audio && options.fastStart.expectedAudioChunks === void 0) {
        throw new Error(`'fastStart' is an object but is missing property 'expectedAudioChunks'.`);
      }
    } else if (![false, "in-memory"].includes(options.fastStart)) {
      throw new Error(`'fastStart' option must be false, 'in-memory' or an object.`);
    }
  };
  _writeHeader = new WeakSet();
  writeHeader_fn = function() {
    let holdsHevc = __privateGet(this, _options).video?.codec === "hevc";
    __privateGet(this, _writer).writeBox(ftyp(holdsHevc));
    __privateSet(this, _ftypSize, __privateGet(this, _writer).pos);
    if (__privateGet(this, _options).fastStart === "in-memory") {
      __privateSet(this, _mdat, mdat(false));
    } else {
      if (typeof __privateGet(this, _options).fastStart === "object") {
        let moovSizeUpperBound = __privateMethod(this, _computeMoovSizeUpperBound, computeMoovSizeUpperBound_fn).call(this);
        __privateGet(this, _writer).seek(__privateGet(this, _writer).pos + moovSizeUpperBound);
      }
      __privateSet(this, _mdat, mdat(true));
      __privateGet(this, _writer).writeBox(__privateGet(this, _mdat));
    }
    __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
  };
  _computeMoovSizeUpperBound = new WeakSet();
  computeMoovSizeUpperBound_fn = function() {
    if (typeof __privateGet(this, _options).fastStart !== "object")
      return;
    let upperBound = 0;
    let sampleCounts = [
      __privateGet(this, _options).fastStart.expectedVideoChunks,
      __privateGet(this, _options).fastStart.expectedAudioChunks
    ];
    for (let n of sampleCounts) {
      if (!n)
        continue;
      upperBound += (4 + 4) * Math.ceil(2 / 3 * n);
      upperBound += 4 * n;
      upperBound += (4 + 4 + 4) * Math.ceil(2 / 3 * n);
      upperBound += 4 * n;
      upperBound += 8 * n;
    }
    upperBound += 4096;
    return upperBound;
  };
  _prepareTracks = new WeakSet();
  prepareTracks_fn = function() {
    if (__privateGet(this, _options).video) {
      __privateSet(this, _videoTrack, {
        id: 1,
        info: {
          type: "video",
          codec: __privateGet(this, _options).video.codec,
          width: __privateGet(this, _options).video.width,
          height: __privateGet(this, _options).video.height,
          rotation: __privateGet(this, _options).video.rotation ?? 0
        },
        timescale: 720,
        // = lcm(24, 30, 60, 120, 144, 240, 360), so should fit with many framerates
        codecPrivate: new Uint8Array(0),
        samples: [],
        finalizedChunks: [],
        currentChunk: null,
        firstTimestamp: void 0,
        lastTimestamp: -1,
        timeToSampleTable: [],
        lastTimescaleUnits: null,
        compactlyCodedChunkTable: []
      });
    }
    if (__privateGet(this, _options).audio) {
      let guessedCodecPrivate = __privateMethod(this, _generateMpeg4AudioSpecificConfig, generateMpeg4AudioSpecificConfig_fn).call(
        this,
        2,
        // Object type for AAC-LC, since it's the most common
        __privateGet(this, _options).audio.sampleRate,
        __privateGet(this, _options).audio.numberOfChannels
      );
      __privateSet(this, _audioTrack, {
        id: __privateGet(this, _options).video ? 2 : 1,
        info: {
          type: "audio",
          codec: __privateGet(this, _options).audio.codec,
          numberOfChannels: __privateGet(this, _options).audio.numberOfChannels,
          sampleRate: __privateGet(this, _options).audio.sampleRate
        },
        timescale: __privateGet(this, _options).audio.sampleRate,
        codecPrivate: guessedCodecPrivate,
        samples: [],
        finalizedChunks: [],
        currentChunk: null,
        firstTimestamp: void 0,
        lastTimestamp: -1,
        timeToSampleTable: [],
        lastTimescaleUnits: null,
        compactlyCodedChunkTable: []
      });
    }
  };
  _generateMpeg4AudioSpecificConfig = new WeakSet();
  generateMpeg4AudioSpecificConfig_fn = function(objectType, sampleRate, numberOfChannels) {
    let frequencyIndices = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
    let frequencyIndex = frequencyIndices.indexOf(sampleRate);
    let channelConfig = numberOfChannels;
    let configBits = "";
    configBits += objectType.toString(2).padStart(5, "0");
    configBits += frequencyIndex.toString(2).padStart(4, "0");
    if (frequencyIndex === 15)
      configBits += sampleRate.toString(2).padStart(24, "0");
    configBits += channelConfig.toString(2).padStart(4, "0");
    let paddingLength = Math.ceil(configBits.length / 8) * 8;
    configBits = configBits.padEnd(paddingLength, "0");
    let configBytes = new Uint8Array(configBits.length / 8);
    for (let i = 0; i < configBits.length; i += 8) {
      configBytes[i / 8] = parseInt(configBits.slice(i, i + 8), 2);
    }
    return configBytes;
  };
  _addSampleToTrack = new WeakSet();
  addSampleToTrack_fn = function(track, data, type, timestamp, duration, meta) {
    let timestampInSeconds = timestamp / 1e6;
    let durationInSeconds = duration / 1e6;
    if (track.firstTimestamp === void 0)
      track.firstTimestamp = timestampInSeconds;
    timestampInSeconds = __privateMethod(this, _validateTimestamp, validateTimestamp_fn).call(this, timestampInSeconds, track);
    track.lastTimestamp = timestampInSeconds;
    if (!track.currentChunk || timestampInSeconds - track.currentChunk.startTimestamp >= MAX_CHUNK_DURATION) {
      if (track.currentChunk)
        __privateMethod(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, track);
      track.currentChunk = {
        startTimestamp: timestampInSeconds,
        sampleData: [],
        sampleCount: 0
      };
    }
    track.currentChunk.sampleData.push(data);
    track.currentChunk.sampleCount++;
    if (meta?.decoderConfig?.description) {
      track.codecPrivate = new Uint8Array(meta.decoderConfig.description);
    }
    track.samples.push({
      timestamp: timestampInSeconds,
      duration: durationInSeconds,
      size: data.byteLength,
      type
    });
    if (track.lastTimescaleUnits !== null) {
      let timescaleUnits = intoTimescale(timestampInSeconds, track.timescale, false);
      let delta = Math.round(timescaleUnits - track.lastTimescaleUnits);
      track.lastTimescaleUnits += delta;
      let lastTableEntry = last(track.timeToSampleTable);
      if (lastTableEntry.sampleCount === 1) {
        lastTableEntry.sampleDelta = delta;
        lastTableEntry.sampleCount++;
      } else if (lastTableEntry.sampleDelta === delta) {
        lastTableEntry.sampleCount++;
      } else {
        lastTableEntry.sampleCount--;
        track.timeToSampleTable.push({
          sampleCount: 2,
          sampleDelta: delta
        });
      }
    } else {
      track.lastTimescaleUnits = 0;
      track.timeToSampleTable.push({
        sampleCount: 1,
        sampleDelta: intoTimescale(durationInSeconds, track.timescale)
      });
    }
  };
  _validateTimestamp = new WeakSet();
  validateTimestamp_fn = function(timestamp, track) {
    if (__privateGet(this, _options).firstTimestampBehavior === "strict" && track.lastTimestamp === -1 && timestamp !== 0) {
      throw new Error(
        `The first chunk for your media track must have a timestamp of 0 (received ${timestamp}). Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of the document, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
`
      );
    } else if (__privateGet(this, _options).firstTimestampBehavior === "offset") {
      timestamp -= track.firstTimestamp;
    }
    if (timestamp < track.lastTimestamp) {
      throw new Error(
        `Timestamps must be monotonically increasing (went from ${track.lastTimestamp * 1e6} to ${timestamp * 1e6}).`
      );
    }
    return timestamp;
  };
  _finalizeCurrentChunk = new WeakSet();
  finalizeCurrentChunk_fn = function(track) {
    if (!track.currentChunk)
      return;
    if (track.compactlyCodedChunkTable.length === 0 || last(track.compactlyCodedChunkTable).samplesPerChunk !== track.currentChunk.sampleCount) {
      track.compactlyCodedChunkTable.push({
        firstChunk: track.finalizedChunks.length + 1,
        // 1-indexed
        samplesPerChunk: track.currentChunk.sampleCount
      });
    }
    track.finalizedChunks.push(track.currentChunk);
    __privateGet(this, _finalizedChunks).push(track.currentChunk);
    if (__privateGet(this, _options).fastStart === "in-memory") {
      track.currentChunk.offset = 0;
      return;
    }
    track.currentChunk.offset = __privateGet(this, _writer).pos;
    for (let bytes2 of track.currentChunk.sampleData)
      __privateGet(this, _writer).write(bytes2);
    track.currentChunk.sampleData = null;
    __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
  };
  _maybeFlushStreamingTargetWriter = new WeakSet();
  maybeFlushStreamingTargetWriter_fn = function() {
    if (__privateGet(this, _writer) instanceof StreamTargetWriter) {
      __privateGet(this, _writer).flush();
    }
  };
  _ensureNotFinalized = new WeakSet();
  ensureNotFinalized_fn = function() {
    if (__privateGet(this, _finalized)) {
      throw new Error("Cannot add new video or audio chunks after the file has been finalized.");
    }
  };
  return __toCommonJS(src_exports);
})();
if (typeof module === "object" && typeof module.exports === "object") Object.assign(module.exports, Mp4Muxer)
