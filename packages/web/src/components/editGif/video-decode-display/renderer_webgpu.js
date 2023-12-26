class WebGPURenderer {
  #canvas = null;
  #ctx = null;

  // Promise for `#start()`, WebGPU setup is asynchronous.
  #started = null;

  // WebGPU state shared between setup and drawing.
  #format = null;
  #device = null;
  #pipeline = null;
  #sampler = null;

  // Generates two triangles covering the whole canvas.
  static vertexShaderSource = `
    struct VertexOutput {
      @builtin(position) Position: vec4<f32>,
      @location(0) uv: vec2<f32>,
    }

    @vertex
    fn vert_main(@builtin(vertex_index) VertexIndex: u32) -> VertexOutput {
      var pos = array<vec2<f32>, 6>(
        vec2<f32>( 1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0,  1.0),
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(-1.0,  1.0)
      );

      var uv = array<vec2<f32>, 6>(
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 0.0)
      );

      var output : VertexOutput;
      output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
      output.uv = uv[VertexIndex];
      return output;
    }
  `;

  // Samples the external texture using generated UVs.
  static fragmentShaderSource = `
    @group(0) @binding(1) var mySampler: sampler;
    @group(0) @binding(2) var myTexture: texture_external;
    
    @fragment
    fn frag_main(@location(0) uv : vec2<f32>) -> @location(0) vec4<f32> {
      return textureSampleBaseClampToEdge(myTexture, mySampler, uv);
    }
  `;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#started = this.#start();
  }

  async #start() {
    const adapter = await navigator.gpu.requestAdapter();
    this.#device = await adapter.requestDevice();
    this.#format = navigator.gpu.getPreferredCanvasFormat();

    this.#ctx = this.#canvas.getContext("webgpu");
    this.#ctx.configure({
      device: this.#device,
      format: this.#format,
      alphaMode: "opaque",
    });

    this.#pipeline = this.#device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: this.#device.createShaderModule({code: WebGPURenderer.vertexShaderSource}),
        entryPoint: "vert_main"
      },
      fragment: {
        module: this.#device.createShaderModule({code: WebGPURenderer.fragmentShaderSource}),
        entryPoint: "frag_main",
        targets: [{format: this.#format}]
      },
      primitive: {
        topology: "triangle-list"
      }
    });
  
    // Default sampler configuration is nearset + clamp.
    this.#sampler = this.#device.createSampler({});
  }

  async draw(frame) {
    // Don't try to draw any frames until the context is configured.
    await this.#started;

    this.#canvas.width = frame.displayWidth;
    this.#canvas.height = frame.displayHeight;

    const uniformBindGroup = this.#device.createBindGroup({
      layout: this.#pipeline.getBindGroupLayout(0),
      entries: [
        {binding: 1, resource: this.#sampler},
        {binding: 2, resource: this.#device.importExternalTexture({source: frame})}
      ],
    });

    const commandEncoder = this.#device.createCommandEncoder();
    const textureView = this.#ctx.getCurrentTexture().createView();
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: [1.0, 0.0, 0.0, 1.0],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(this.#pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();
    this.#device.queue.submit([commandEncoder.finish()]);

    frame.close();
  }
};
