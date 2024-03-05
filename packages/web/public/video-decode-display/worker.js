importScripts(
  './demuxer_mp4.js',
  './renderer_2d.js',
  './renderer_webgl.js',
  './renderer_webgpu.js',
);

// Status UI. Messages are batched per animation frame.
let pendingStatus = null;

function setStatus(type, message) {
  if (pendingStatus) {
    pendingStatus[type] = message;
  } else {
    pendingStatus = { [type]: message };
    self.requestAnimationFrame(statusAnimationFrame);
  }
}

function statusAnimationFrame() {
  self.postMessage(pendingStatus);
  pendingStatus = null;
}

// Rendering. Drawing is limited to once per animation frame.
let renderer = null;
let pendingFrame = null;
let startTime = null;
let frameCount = 0;

function renderFrame(frame) {
  if (!pendingFrame) {
    // Schedule rendering in the next animation frame.
    pendingFrame = frame;
    // requestAnimationFrame(renderAnimationFrame);
    renderAnimationFrame();
  } else {
    // Close the current pending frame before replacing it.
    pendingFrame.close();
  }
  // Set or replace the pending frame.
  // pendingFrame = frame;
}

async function renderAnimationFrame() {
  renderer.draw(pendingFrame);
  pendingFrame = null;
}

// Startup.
function start({ dataUri, rendererName, canvas, option }) {
  // Pick a renderer to use.
  switch (rendererName) {
    case '2d':
      renderer = new Canvas2DRenderer(canvas, option);
      break;
    case 'webgl':
      renderer = new WebGLRenderer(rendererName, canvas);
      break;
    case 'webgl2':
      renderer = new WebGLRenderer(rendererName, canvas);
      break;
    case 'webgpu':
      renderer = new WebGPURenderer(canvas);
      break;
  }

  // Set up a VideoDecoer.
  const decoder = new VideoDecoder({
    output(frame) {
      // Update statistics.
      if (startTime == null) {
        startTime = performance.now();
      } else {
        const elapsed = (performance.now() - startTime) / 1000;
        const fps = ++frameCount / elapsed;
        setStatus('render', `${fps.toFixed(0)} fps`);
      }

      // Schedule the frame to be rendered.
      renderFrame(frame);
    },
    error(e) {
      console.log('decoder error', e);
      setStatus('decode', e);
    },
  });

  // Fetch and demux the media data.
  const demuxer = new MP4Demuxer(dataUri, {
    onConfig(config) {
      setStatus('decode', `${config.codec} @ ${config.codedWidth}x${config.codedHeight}`);
      decoder.configure(config);
    },
    onChunk(chunk) {
      decoder.decode(chunk);
    },
    setStatus,
  });
}

// Listen for the start request.
self.addEventListener('message', (message) => start(message.data), { once: true });
