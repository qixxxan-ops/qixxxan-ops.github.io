"use client";

import { useEffect, useRef } from "react";
import Explorations from "./Explorations";
import { Bodies, Body, Composite, Engine, Sleeping, type Body as MatterBody } from "matter-js";

const vertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_ripple_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_scroll;
uniform sampler2D u_mask;
uniform sampler2D u_ripple;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotation * p * 2.03 + 13.7;
    amplitude *= 0.5;
  }
  return value;
}

vec3 filmPalette(float t) {
  t = fract(t);
  vec3 violet = vec3(0.48, 0.03, 1.00);
  vec3 magenta = vec3(1.00, 0.015, 0.52);
  vec3 coral = vec3(1.00, 0.12, 0.055);
  vec3 gold = vec3(1.00, 0.62, 0.015);
  vec3 aqua = vec3(0.00, 0.88, 0.78);
  vec3 cyan = vec3(0.00, 0.66, 1.00);
  vec3 cobalt = vec3(0.035, 0.12, 1.00);
  float blend;
  if (t < 0.14) {
    blend = smoothstep(0.0, 0.14, t);
    return mix(violet, magenta, blend);
  }
  if (t < 0.28) {
    blend = smoothstep(0.14, 0.28, t);
    return mix(magenta, coral, blend);
  }
  if (t < 0.42) {
    blend = smoothstep(0.28, 0.42, t);
    return mix(coral, gold, blend);
  }
  if (t < 0.56) {
    blend = smoothstep(0.42, 0.56, t);
    return mix(gold, aqua, blend);
  }
  if (t < 0.70) {
    blend = smoothstep(0.56, 0.70, t);
    return mix(aqua, cyan, blend);
  }
  if (t < 0.84) {
    blend = smoothstep(0.70, 0.84, t);
    return mix(cyan, cobalt, blend);
  }
  blend = smoothstep(0.84, 1.0, t);
  return mix(cobalt, violet, blend);
}

void main() {
  vec2 resolution = max(u_resolution, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 pixel = 1.0 / resolution;
  float mask = texture2D(u_mask, uv).r;

  vec2 ripplePixel = 1.0 / max(u_ripple_resolution, vec2(1.0));
  vec4 rippleData = texture2D(u_ripple, uv);
  float localActivity = rippleData.g;
  vec2 contactReach = ripplePixel * 2.8;
  float nearbyActivity = localActivity;
  nearbyActivity = max(nearbyActivity, texture2D(u_ripple, uv + vec2(contactReach.x, 0.0)).g);
  nearbyActivity = max(nearbyActivity, texture2D(u_ripple, uv - vec2(contactReach.x, 0.0)).g);
  nearbyActivity = max(nearbyActivity, texture2D(u_ripple, uv + vec2(0.0, contactReach.y)).g);
  nearbyActivity = max(nearbyActivity, texture2D(u_ripple, uv - vec2(0.0, contactReach.y)).g);
  nearbyActivity = max(nearbyActivity, texture2D(u_ripple, uv + contactReach * 0.72).g);
  nearbyActivity = max(nearbyActivity, texture2D(u_ripple, uv - contactReach * 0.72).g);
  nearbyActivity = max(nearbyActivity, texture2D(u_ripple, uv + vec2(contactReach.x, -contactReach.y) * 0.72).g);
  nearbyActivity = max(nearbyActivity, texture2D(u_ripple, uv + vec2(-contactReach.x, contactReach.y) * 0.72).g);
  float flowPresence = smoothstep(0.015, 0.28, localActivity);
  float nearbyContact = smoothstep(0.045, 0.34, nearbyActivity);
  float birthCore = smoothstep(0.68, 0.96, localActivity);
  vec2 motionVector = rippleData.ba * 2.0 - 1.0;
  float motionSpeed = clamp(length(motionVector), 0.0, 1.0);
  vec2 motionDirection = motionVector / max(motionSpeed, 0.001);
  float ripple = rippleData.r * 2.0 - 1.0;
  float rippleLeft = texture2D(u_ripple, uv - vec2(ripplePixel.x, 0.0)).r * 2.0 - 1.0;
  float rippleRight = texture2D(u_ripple, uv + vec2(ripplePixel.x, 0.0)).r * 2.0 - 1.0;
  float rippleDown = texture2D(u_ripple, uv - vec2(0.0, ripplePixel.y)).r * 2.0 - 1.0;
  float rippleUp = texture2D(u_ripple, uv + vec2(0.0, ripplePixel.y)).r * 2.0 - 1.0;
  vec2 rippleNormal = vec2(rippleLeft - rippleRight, rippleDown - rippleUp) * 1.72;
  float rippleEnergy = clamp(
    length(rippleNormal) * 1.34 + max(abs(ripple) - 0.018, 0.0) * 0.46,
    0.0,
    1.0
  );
  float flowTime = u_time * 0.078;
  float aspect = resolution.x / resolution.y;
  vec2 flowDomain = (uv - 0.5) * vec2(aspect, 1.0) * 4.2;
  flowDomain -= motionVector * flowPresence * (0.42 + motionSpeed * 0.72);
  vec2 turbulenceOffset = vec2(flowTime, -flowTime * 0.46);
  float turbulenceStep = 0.115;
  float turbulenceLeft = noise(
    flowDomain * 1.34 + turbulenceOffset - vec2(turbulenceStep, 0.0)
  );
  float turbulenceRight = noise(
    flowDomain * 1.34 + turbulenceOffset + vec2(turbulenceStep, 0.0)
  );
  float turbulenceDown = noise(
    flowDomain * 1.34 + turbulenceOffset - vec2(0.0, turbulenceStep)
  );
  float turbulenceUp = noise(
    flowDomain * 1.34 + turbulenceOffset + vec2(0.0, turbulenceStep)
  );
  vec2 curlFlow = vec2(
    turbulenceUp - turbulenceDown,
    turbulenceLeft - turbulenceRight
  ) * 2.65;
  vec2 driftFlow = vec2(
    noise(flowDomain * 0.72 - turbulenceOffset * 0.38) - 0.5,
    noise(flowDomain.yx * 0.86 + turbulenceOffset * 0.31) - 0.5
  );
  vec2 splitFlow = vec2(
    noise(flowDomain * 2.08 + turbulenceOffset.yx * 0.44) - 0.5,
    noise(flowDomain.yx * 1.76 - turbulenceOffset * 0.39) - 0.5
  );
  vec2 directionalFlow = motionDirection * motionSpeed * (0.74 + motionSpeed * 0.68);
  vec2 localFlow = curlFlow + driftFlow * 0.30 + splitFlow * 0.48 + directionalFlow;
  vec2 fluidUv = uv +
    rippleNormal * (0.020 + rippleEnergy * 0.014) +
    localFlow * flowPresence * (0.014 + rippleEnergy * 0.040) +
    motionVector * flowPresence * (0.006 + motionSpeed * 0.020);

  vec2 edgeUv = uv + localFlow * nearbyContact * pixel * 0.72;
  float maskLeft = texture2D(u_mask, edgeUv - vec2(pixel.x * 0.62, 0.0)).r;
  float maskRight = texture2D(u_mask, edgeUv + vec2(pixel.x * 0.62, 0.0)).r;
  float maskDown = texture2D(u_mask, edgeUv - vec2(0.0, pixel.y * 0.62)).r;
  float maskUp = texture2D(u_mask, edgeUv + vec2(0.0, pixel.y * 0.62)).r;
  float edge = clamp(
    abs(maskRight - maskLeft) + abs(maskUp - maskDown),
    0.0,
    1.0
  );

  vec2 p = (fluidUv - 0.5) * vec2(aspect, 1.0);

  float time = u_time * 0.028;
  float fieldA = fbm(p * 1.92 + vec2(time, -time * 0.36));
  float fieldB = fbm(p * 3.28 - vec2(time * 0.18, time * 0.12));
  float bands = sin(
    p.x * 1.25 +
    p.y * 0.72 +
    fieldA * 10.8 +
    fieldB * 4.3 +
    u_scroll * 0.9
  );
  float fineBands = sin(
    p.x * 0.38 -
    p.y * 0.62 +
    fieldB * 5.8 -
    fieldA * 2.4 -
    time * 0.12
  );
  float interference = 0.5 + 0.5 * bands;
  interference = smoothstep(0.10, 0.90, interference);
  float thinFilm = exp(-abs(fineBands) * 2.4);
  float ridge = exp(-abs(bands) * 3.2);
  float directionalPhase =
    dot(p, motionDirection) * motionSpeed * 2.8 -
    u_time * motionSpeed * 0.15;
  float layerWaveA = 0.5 + 0.5 * sin(
    p.x * 5.4 -
    p.y * 3.7 +
    fieldA * 8.2 +
    fieldB * 2.6 +
    localFlow.x * 1.8 -
    localFlow.y * 1.3 -
    time * 0.58 +
    directionalPhase
  );
  float layerWaveB = 0.5 + 0.5 * sin(
    -p.x * 4.2 +
    p.y * 6.0 +
    fieldB * 9.1 -
    fieldA * 2.5 -
    localFlow.x * 1.1 +
    localFlow.y * 1.7 +
    time * 0.41 -
    directionalPhase * 0.72
  );
  float primaryLayer = smoothstep(0.18, 0.76, layerWaveA);
  float secondaryLayer = smoothstep(0.40, 0.84, layerWaveB);
  vec2 veinWarp = vec2(fieldB - 0.5, fieldA - 0.5) * 3.2 +
    localFlow * 0.46 +
    motionVector * 0.72;
  float veinField = fbm(
    p * 2.15 + veinWarp * 0.72 + vec2(time * 0.10, -time * 0.07)
  );
  float veinTarget = 0.47 +
    (fieldA - 0.5) * 0.16 +
    noise(p * 1.15 - vec2(time * 0.052, time * 0.034)) * 0.07;
  float blackChannel = 1.0 - smoothstep(
    0.026,
    0.115,
    abs(veinField - veinTarget)
  );
  blackChannel *= 0.76 + noise(p * 3.0 + veinWarp * 0.24) * 0.24;
  float layeredOil = clamp(
    primaryLayer * 0.76 + secondaryLayer * 0.56,
    0.0,
    1.0
  );
  float channelGate = 1.0 - blackChannel * 0.68;
  float surfaceEnergy = flowPresence * clamp(
    rippleEnergy * 0.58 + layeredOil * 0.42,
    0.0,
    1.0
  ) * channelGate;
  float sweepWave = 0.5 + 0.5 * sin(
    (uv.x * 0.82 + uv.y * 0.48) * 6.28318 - u_time * 0.42
  );
  float edgeSweep = clamp(
    pow(sweepWave, 7.0) * 0.72 + pow(sweepWave, 20.0) * 0.62,
    0.0,
    1.0
  );

  float phase =
    fieldA * 0.78 +
    fieldB * 0.24 +
    p.x * 0.12 -
    p.y * 0.08 +
    ripple * 0.22 +
    rippleEnergy * 0.085 +
    localFlow.x * 0.084 -
    localFlow.y * 0.068 +
    time * 0.045 +
    bands * 0.055 +
    fineBands * 0.012;
  vec3 oil = filmPalette(phase * 1.46 + interference * 0.055);
  float oilLuma = dot(oil, vec3(0.299, 0.587, 0.114));
  oil = mix(vec3(oilLuma), oil, 0.985);
  oil = pow(max(oil, vec3(0.0)), vec3(0.82));
  oil *= vec3(1.08, 1.02, 1.07);
  oil = mix(oil, vec3(0.27, 0.34, 0.43), 0.025);
  vec3 secondaryOil = filmPalette(
    phase * 1.31 + 0.29 + fieldB * 0.14 - localFlow.y * 0.045
  );
  oil = mix(oil, secondaryOil, secondaryLayer * 0.52);
  oil = mix(oil, filmPalette(phase * 1.72 + 0.17), thinFilm * 0.18);
  oil = pow(max(oil, vec3(0.0)), vec3(0.78));
  oil *= (0.68 + interference * 0.72 + ridge * 0.30) *
    (1.0 + birthCore * 0.22);

  vec3 darkGlass = vec3(0.008, 0.012, 0.021);
  float reflection = surfaceEnergy * (
    0.82 +
    layeredOil * 0.20 +
    interference * 0.16 +
    ridge * 0.12 +
    thinFilm * 0.08 +
    birthCore * 0.28
  );
  vec3 glassColor = mix(darkGlass, oil, clamp(reflection, 0.0, 1.0));
  glassColor += mix(vec3(0.76, 0.84, 0.92), oil, 0.30) *
    surfaceEnergy * (0.065 + secondaryLayer * 0.040);

  vec3 edgeColor = mix(
    vec3(0.76, 0.86, 1.0),
    oil,
    0.22
  );
  float contactPulse = max(
    smoothstep(0.10, 0.48, surfaceEnergy),
    nearbyContact * 0.92
  );
  vec3 contactColor = filmPalette(
    phase * 1.52 + 0.075 + secondaryLayer * 0.20 + motionSpeed * 0.10
  );
  contactColor = pow(max(contactColor, vec3(0.0)), vec3(0.62));
  contactColor *= vec3(1.24, 1.10, 1.28);
  glassColor += edgeColor * edge *
    (edgeSweep * 0.15 + nearbyContact * 0.24);
  glassColor += vec3(1.0) * edge *
    (edgeSweep * 0.052 + nearbyContact * 0.08);
  glassColor += contactColor * edge * contactPulse *
    (0.46 + birthCore * 0.30);

  float glassAlpha = mask * (
    0.014 +
    surfaceEnergy * (
      0.72 + layeredOil * 0.18 + interference * 0.13 + ridge * 0.09
    )
  );
  glassAlpha = max(
    glassAlpha,
    edge * (
      0.018 +
      edgeSweep * 0.12 +
      nearbyContact * (0.34 + layeredOil * 0.10) +
      contactPulse * (0.14 + birthCore * 0.12)
    )
  );
  glassAlpha = clamp(glassAlpha, 0.0, 1.0);

  gl_FragColor = vec4(glassColor, glassAlpha);
}
`;

function FluidScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    const vertex = createShader(gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl.FRAGMENT_SHADER, fragmentShader);
    if (!program || !vertex || !fragment) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const rippleResolution = gl.getUniformLocation(program, "u_ripple_resolution");
    const mouseUniform = gl.getUniformLocation(program, "u_mouse");
    const timeUniform = gl.getUniformLocation(program, "u_time");
    const scrollUniform = gl.getUniformLocation(program, "u_scroll");
    const maskUniform = gl.getUniformLocation(program, "u_mask");
    const rippleUniform = gl.getUniformLocation(program, "u_ripple");
    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d");
    const maskTexture = gl.createTexture();
    const rippleTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, maskTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(maskUniform, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, rippleTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(rippleUniform, 1);

    let animationId = 0;
    let start = performance.now();
    let scroll = 0;
    let rippleWidth = 160;
    let rippleHeight = 96;
    let ripplePrevious = new Float32Array(rippleWidth * rippleHeight);
    let rippleCurrent = new Float32Array(rippleWidth * rippleHeight);
    let rippleNext = new Float32Array(rippleWidth * rippleHeight);
    let rippleActivity = new Float32Array(rippleWidth * rippleHeight);
    let rippleActivityNext = new Float32Array(rippleWidth * rippleHeight);
    let rippleVelocityX = new Float32Array(rippleWidth * rippleHeight);
    let rippleVelocityY = new Float32Array(rippleWidth * rippleHeight);
    let rippleVelocityNextX = new Float32Array(rippleWidth * rippleHeight);
    let rippleVelocityNextY = new Float32Array(rippleWidth * rippleHeight);
    let ripplePixels = new Uint8Array(rippleWidth * rippleHeight * 4);
    let rippleClock = performance.now();
    let rippleAccumulator = 0;
    let rippleStepCount = 0;
    const pointer = { x: 0.55, y: 0.5, tx: 0.55, ty: 0.5 };
    const trail = { x: 0.55, y: 0.5, active: false, time: performance.now() };

    const resetRippleField = () => {
      rippleWidth = window.innerWidth < 700 ? 104 : 160;
      rippleHeight = Math.max(
        72,
        Math.round(rippleWidth * (window.innerHeight / window.innerWidth)),
      );
      ripplePrevious = new Float32Array(rippleWidth * rippleHeight);
      rippleCurrent = new Float32Array(rippleWidth * rippleHeight);
      rippleNext = new Float32Array(rippleWidth * rippleHeight);
      rippleActivity = new Float32Array(rippleWidth * rippleHeight);
      rippleActivityNext = new Float32Array(rippleWidth * rippleHeight);
      rippleVelocityX = new Float32Array(rippleWidth * rippleHeight);
      rippleVelocityY = new Float32Array(rippleWidth * rippleHeight);
      rippleVelocityNextX = new Float32Array(rippleWidth * rippleHeight);
      rippleVelocityNextY = new Float32Array(rippleWidth * rippleHeight);
      ripplePixels = new Uint8Array(rippleWidth * rippleHeight * 4);
      rippleStepCount = 0;
      for (let index = 0; index < rippleCurrent.length; index += 1) {
        const pixelIndex = index * 4;
        ripplePixels[pixelIndex] = 128;
        ripplePixels[pixelIndex + 1] = 0;
        ripplePixels[pixelIndex + 2] = 128;
        ripplePixels[pixelIndex + 3] = 128;
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, rippleTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        rippleWidth,
        rippleHeight,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        ripplePixels,
      );
    };

    const disturbRipple = (
      x: number,
      y: number,
      strength: number,
      directionX = 0,
      directionY = 0,
      speed = 0,
    ) => {
      const centerX = x * (rippleWidth - 1);
      const centerY = y * (rippleHeight - 1);
      const radius = window.innerWidth < 700 ? 1.9 : 2.15;
      const minX = Math.max(1, Math.floor(centerX - radius));
      const maxX = Math.min(rippleWidth - 2, Math.ceil(centerX + radius));
      const minY = Math.max(1, Math.floor(centerY - radius));
      const maxY = Math.min(rippleHeight - 2, Math.ceil(centerY + radius));

      for (let py = minY; py <= maxY; py += 1) {
        for (let px = minX; px <= maxX; px += 1) {
          const dx = (px - centerX) / radius;
          const dy = (py - centerY) / radius;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared >= 1) continue;
          const forward = dx * directionX + dy * directionY;
          const trailingAmount =
            speed > 0.01
              ? Math.max(0, Math.min(1, 1 - Math.max(forward, 0) / 0.18))
              : 1;
          const trailingGate = trailingAmount * trailingAmount * (3 - 2 * trailingAmount);
          const spatialVariation =
            0.88 + 0.12 * Math.sin(px * 12.9898 + py * 78.233);
          const impulse =
            Math.cos(Math.sqrt(distanceSquared) * Math.PI * 0.5) *
            spatialVariation *
            trailingGate;
          const index = py * rippleWidth + px;
          const targetHeight = impulse * strength;
          rippleCurrent[index] = Math.max(
            -0.86,
            Math.min(0.86, rippleCurrent[index] * 0.76 + targetHeight),
          );
          ripplePrevious[index] = Math.max(
            -0.86,
            Math.min(
              0.86,
              ripplePrevious[index] * 0.82 + targetHeight * 0.30,
            ),
          );
        }
      }

      const revealRadius = window.innerWidth < 700 ? 2.25 : 2.45;
      const revealMinX = Math.max(1, Math.floor(centerX - revealRadius));
      const revealMaxX = Math.min(rippleWidth - 2, Math.ceil(centerX + revealRadius));
      const revealMinY = Math.max(1, Math.floor(centerY - revealRadius));
      const revealMaxY = Math.min(rippleHeight - 2, Math.ceil(centerY + revealRadius));
      for (let py = revealMinY; py <= revealMaxY; py += 1) {
        for (let px = revealMinX; px <= revealMaxX; px += 1) {
          const dx = (px - centerX) / revealRadius;
          const dy = (py - centerY) / revealRadius;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared >= 1) continue;
          const forward = dx * directionX + dy * directionY;
          const trailingAmount =
            speed > 0.01
              ? Math.max(0, Math.min(1, 1 - Math.max(forward, 0) / 0.18))
              : 1;
          const trailingGate = trailingAmount * trailingAmount * (3 - 2 * trailingAmount);
          const activity = Math.pow(1 - distanceSquared, 1.7) * trailingGate;
          const index = py * rippleWidth + px;
          rippleActivity[index] = Math.max(rippleActivity[index], activity);
          const velocityWeight = activity * speed;
          rippleVelocityX[index] = Math.max(
            -1,
            Math.min(
              1,
              rippleVelocityX[index] * (1 - velocityWeight * 0.52) +
                directionX * velocityWeight * 0.82,
            ),
          );
          rippleVelocityY[index] = Math.max(
            -1,
            Math.min(
              1,
              rippleVelocityY[index] * (1 - velocityWeight * 0.52) +
                directionY * velocityWeight * 0.82,
            ),
          );
        }
      }
    };

    const stepRipple = () => {
      rippleActivityNext.fill(0);
      rippleVelocityNextX.fill(0);
      rippleVelocityNextY.fill(0);
      rippleStepCount += 1;
      const writeFlow = (
        targetIndex: number,
        targetActivity: number,
        targetVelocityX: number,
        targetVelocityY: number,
      ) => {
        if (targetActivity <= rippleActivityNext[targetIndex]) return;
        rippleActivityNext[targetIndex] = targetActivity;
        rippleVelocityNextX[targetIndex] = targetVelocityX;
        rippleVelocityNextY[targetIndex] = targetVelocityY;
      };
      for (let y = 1; y < rippleHeight - 1; y += 1) {
        const row = y * rippleWidth;
        for (let x = 1; x < rippleWidth - 1; x += 1) {
          const index = row + x;
          const neighborSum =
            rippleCurrent[index - 1] +
              rippleCurrent[index + 1] +
              rippleCurrent[index - rippleWidth] +
              rippleCurrent[index + rippleWidth];
          const localDamping = 0.80 + rippleActivity[index] * 0.176;
          const nextHeight =
            (neighborSum * 0.5 - ripplePrevious[index]) * localDamping;
          rippleNext[index] = Math.max(-0.86, Math.min(0.86, nextHeight));

          const activity = rippleActivity[index];
          if (activity < 0.002) continue;
          const velocityX = rippleVelocityX[index] * 0.94;
          const velocityY = rippleVelocityY[index] * 0.94;
          const speed = Math.hypot(velocityX, velocityY);
          const decayedActivity = activity * 0.972;
          const travelX = Math.round(velocityX * 0.82);
          const travelY = Math.round(velocityY * 0.82);
          const destinationX = Math.max(
            1,
            Math.min(rippleWidth - 2, x + travelX),
          );
          const destinationY = Math.max(
            1,
            Math.min(rippleHeight - 2, y + travelY),
          );
          const destinationIndex = destinationY * rippleWidth + destinationX;

          writeFlow(
            index,
            decayedActivity * (speed > 0.36 ? 0.70 : 0.96),
            velocityX,
            velocityY,
          );
          writeFlow(
            destinationIndex,
            decayedActivity,
            velocityX,
            velocityY,
          );

          if (rippleStepCount % 3 === 0 && activity > 0.075) {
            const perpendicularX = speed > 0.06 ? -velocityY / speed : 1;
            const perpendicularY = speed > 0.06 ? velocityX / speed : 0;
            const spreadX = Math.round(perpendicularX);
            const spreadY = Math.round(perpendicularY);
            const spreadActivity = decayedActivity * 0.64;
            const spreadAX = Math.max(1, Math.min(rippleWidth - 2, x + spreadX));
            const spreadAY = Math.max(1, Math.min(rippleHeight - 2, y + spreadY));
            const spreadBX = Math.max(1, Math.min(rippleWidth - 2, x - spreadX));
            const spreadBY = Math.max(1, Math.min(rippleHeight - 2, y - spreadY));
            writeFlow(
              spreadAY * rippleWidth + spreadAX,
              spreadActivity,
              velocityX * 0.88,
              velocityY * 0.88,
            );
            writeFlow(
              spreadBY * rippleWidth + spreadBX,
              spreadActivity * 0.88,
              velocityX * 0.84,
              velocityY * 0.84,
            );
          }
        }
      }
      const recycled = ripplePrevious;
      ripplePrevious = rippleCurrent;
      rippleCurrent = rippleNext;
      rippleNext = recycled;
      const recycledActivity = rippleActivity;
      rippleActivity = rippleActivityNext;
      rippleActivityNext = recycledActivity;
      const recycledVelocityX = rippleVelocityX;
      rippleVelocityX = rippleVelocityNextX;
      rippleVelocityNextX = recycledVelocityX;
      const recycledVelocityY = rippleVelocityY;
      rippleVelocityY = rippleVelocityNextY;
      rippleVelocityNextY = recycledVelocityY;
    };

    const uploadRipple = () => {
      for (let index = 0; index < rippleCurrent.length; index += 1) {
        const height = Math.max(-1, Math.min(1, rippleCurrent[index]));
        const pixelIndex = index * 4;
        ripplePixels[pixelIndex] = Math.round((height * 0.5 + 0.5) * 255);
        ripplePixels[pixelIndex + 1] = Math.round(
          Math.max(0, Math.min(1, rippleActivity[index])) * 255,
        );
        ripplePixels[pixelIndex + 2] = Math.round(
          (Math.max(-1, Math.min(1, rippleVelocityX[index])) * 0.5 + 0.5) * 255,
        );
        ripplePixels[pixelIndex + 3] = Math.round(
          (Math.max(-1, Math.min(1, rippleVelocityY[index])) * 0.5 + 0.5) * 255,
        );
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, rippleTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        0,
        0,
        rippleWidth,
        rippleHeight,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        ripplePixels,
      );
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      resetRippleField();
      trail.active = false;
      trail.time = performance.now();

      if (maskContext) {
        maskContext.setTransform(dpr, 0, 0, dpr, 0, 0);
        maskContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        maskContext.fillStyle = "#ffffff";
        maskContext.textBaseline = "top";
        maskContext.textAlign = "left";

        const mobile = window.innerWidth < 900;
        const cnSize = mobile
          ? window.innerWidth * 0.31
          : Math.min(window.innerWidth * 0.205, 370);
        const enSize = mobile
          ? window.innerWidth * 0.275
          : Math.min(window.innerWidth * 0.205, 375);

        maskContext.font = `500 ${cnSize}px Arial, "PingFang SC", "Microsoft YaHei", sans-serif`;
        maskContext.fillText(
          "个人网站",
          mobile ? -window.innerWidth * 0.08 : window.innerWidth * 0.012,
          mobile ? window.innerHeight * 0.14 : window.innerHeight * 0.12,
        );

        maskContext.font = `500 ${enSize}px Arial, sans-serif`;
        maskContext.fillText(
          "PERSONAL",
          mobile ? -window.innerWidth * 0.17 : -window.innerWidth * 0.018,
          window.innerHeight * 0.43,
        );
        maskContext.fillText(
          "WEBSITE",
          mobile ? window.innerWidth * 0.02 : window.innerWidth * 0.18,
          window.innerHeight * 0.73,
        );
      }

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, maskTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        maskCanvas,
      );
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth;
      pointer.ty = 1 - event.clientY / window.innerHeight;
      if (trail.active) {
        const dx = pointer.tx - trail.x;
        const dy = pointer.ty - trail.y;
        const cellDistance = Math.hypot(
          dx * rippleWidth,
          dy * rippleHeight,
        );
        const sampleSpacing = 0.34;
        const samples = Math.floor(cellDistance / sampleSpacing);
        if (samples > 0) {
          const now = event.timeStamp || performance.now();
          const elapsed = Math.max(now - trail.time, 8);
          const speed = Math.min(1, cellDistance / (elapsed * 0.045));
          const directionX = (dx * rippleWidth) / cellDistance;
          const directionY = (dy * rippleHeight) / cellDistance;
          const strength = Math.min(0.28, 0.12 + speed * 0.12);
          for (let sample = 1; sample <= samples; sample += 1) {
            const progress = (sample * sampleSpacing) / cellDistance;
            disturbRipple(
              trail.x + dx * progress,
              trail.y + dy * progress,
              strength,
              directionX,
              directionY,
              speed,
            );
          }
          const consumedProgress = Math.min(
            (samples * sampleSpacing) / cellDistance,
            1,
          );
          trail.x += dx * consumedProgress;
          trail.y += dy * consumedProgress;
          trail.time = now;
        }
      } else {
        disturbRipple(pointer.tx, pointer.ty, 0.18);
        trail.active = true;
        trail.x = pointer.tx;
        trail.y = pointer.ty;
        trail.time = event.timeStamp || performance.now();
      }
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    const onScroll = () => {
      scroll = Math.min(window.scrollY / Math.max(window.innerHeight * 1.15, 1), 1);
      document.documentElement.style.setProperty("--scroll", scroll.toFixed(4));
    };

    const draw = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      rippleAccumulator += Math.min((now - rippleClock) / 1000, 0.05);
      rippleClock = now;
      let rippleSteps = 0;
      while (rippleAccumulator >= 1 / 60 && rippleSteps < 3) {
        stepRipple();
        rippleAccumulator -= 1 / 60;
        rippleSteps += 1;
      }
      uploadRipple();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(rippleResolution, rippleWidth, rippleHeight);
      gl.uniform2f(mouseUniform, pointer.x, pointer.y);
      gl.uniform1f(timeUniform, (now - start) / 1000);
      gl.uniform1f(scrollUniform, scroll);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteTexture(maskTexture);
      gl.deleteTexture(rippleTexture);
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />;
}

type Particle = {
  body: MatterBody;
  size: number;
  shape: number;
  color: string;
};

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = Engine.create({
      enableSleeping: true,
      positionIterations: 10,
      velocityIterations: 8,
      constraintIterations: 2,
    });
    engine.gravity.x = 0;
    engine.gravity.y = 1;
    engine.gravity.scale = 0.00115;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let walls: MatterBody[] = [];
    let mouseBody: MatterBody | null = null;
    let mouseRadius = 16;
    let animationId = 0;
    let previousFrame = performance.now();
    let accumulator = 0;
    const fixedStep = 1000 / 120;
    const pointer = {
      x: -999,
      y: -999,
      physicsX: -999,
      physicsY: -999,
      lastX: -999,
      lastY: -999,
      vx: 0,
      vy: 0,
      time: performance.now(),
      active: false,
    };
    const palette = [
      "#dce5ec",
      "#dce5ec",
      "#dce5ec",
      "#bccbd7",
      "#bccbd7",
      "#a9bac8",
      "#8395a3",
      "#8395a3",
      "#242128",
      "#242128",
      "#242128",
      "#11ee63",
      "#b522f6",
      "#ff373b",
      "#1736ff",
      "#d9ff00",
    ];
    const neutralPalette = [
      "#edf2f5",
      "#e4ebf0",
      "#dce5ec",
      "#d3dde5",
      "#c4d0d9",
      "#b4c2cd",
      "#98a9b6",
      "#8395a3",
      "#5f6e79",
      "#302e34",
    ];

    const drawShape = (particle: Particle) => {
      const { body, size } = particle;
      ctx.save();
      ctx.translate(body.position.x, body.position.y);
      ctx.rotate(body.angle);
      ctx.fillStyle = particle.color;
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = Math.max(2.2, size * 0.38);

      if (particle.shape === 0) {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.shape === 1) {
        ctx.fillRect(-size * 0.88, -size * 0.58, size * 1.76, size * 1.16);
      } else if (particle.shape === 2) {
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.94, size * 0.78);
        ctx.lineTo(-size * 0.94, size * 0.78);
        ctx.closePath();
        ctx.fill();
      } else if (particle.shape === 3) {
        ctx.scale(1.38, 0.72);
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (particle.shape === 4) {
        ctx.beginPath();
        for (let point = 0; point < 5; point += 1) {
          const angle = -Math.PI / 2 + (point / 5) * Math.PI * 2;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (point === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else if (particle.shape === 5) {
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.82, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-size, -size * 0.78);
        ctx.lineTo(0, -size * 0.25);
        ctx.lineTo(size, -size * 0.78);
        ctx.lineTo(size * 0.56, 0);
        ctx.lineTo(size, size * 0.78);
        ctx.lineTo(0, size * 0.25);
        ctx.lineTo(-size, size * 0.78);
        ctx.lineTo(-size * 0.56, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    const makeWorld = () => {
      Composite.clear(engine.world, false, true);
      particles = [];
      const mobile = window.innerWidth < 700;
      const spacing = mobile ? 35 : 44;
      const columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil((height * 0.41) / spacing) + 2;
      const bodyOptions = {
        restitution: 0.025,
        friction: 0.22,
        frictionStatic: 0.78,
        frictionAir: 0.007,
        density: 0.001,
        slop: 0.28,
        sleepThreshold: 42,
      };

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const baseX =
            (column - 1) * spacing + (row % 2 === 0 ? 0 : spacing * 0.5);
          const baseY = height - (row + 0.55) * spacing;
          const normalizedX = Math.abs(baseX - width * 0.5) / Math.max(width * 0.5, 1);
          const mixedSurface =
            height * (0.67 + Math.pow(normalizedX, 1.45) * 0.035) +
            Math.sin(baseX * 0.011) * 6;
          const neutralSurface = mixedSurface - height * 0.05;
          if (baseY < neutralSurface) continue;
          const isAddedNeutralLayer = baseY < mixedSurface;

          const size = (mobile ? 4.8 + Math.random() * 3.0 : 6.2 + Math.random() * 4.5) * 1.25;
          const collisionRadius = size * 1.38 + 3;
          const jitter = spacing * 0.018;
          const x = baseX + (Math.random() - 0.5) * jitter;
          const y = baseY + (Math.random() - 0.5) * jitter;
          const body = Bodies.circle(x, y, collisionRadius, bodyOptions);
          Body.setAngle(body, Math.random() * Math.PI * 2);
          particles.push({
            body,
            size,
            shape: Math.floor(Math.random() * 7),
            color: isAddedNeutralLayer
              ? neutralPalette[Math.floor(Math.random() * neutralPalette.length)]
              : palette[Math.floor(Math.random() * palette.length)],
          });
        }
      }

      const wallThickness = 120;
      walls = [
        Bodies.rectangle(-wallThickness * 0.5, height * 0.5, wallThickness, height * 2, {
          isStatic: true,
          restitution: 0,
          friction: 0.6,
        }),
        Bodies.rectangle(width + wallThickness * 0.5, height * 0.5, wallThickness, height * 2, {
          isStatic: true,
          restitution: 0,
          friction: 0.6,
        }),
        Bodies.rectangle(width * 0.5, height + wallThickness * 0.5, width * 2, wallThickness, {
          isStatic: true,
          restitution: 0,
          friction: 0.72,
          frictionStatic: 1,
        }),
        Bodies.rectangle(width * 0.5, -wallThickness * 0.5, width * 2, wallThickness, {
          isStatic: true,
          restitution: 0,
          friction: 0.4,
        }),
      ];

      mouseRadius = mobile ? 12 : 16;
      mouseBody = Bodies.circle(-999, -999, mouseRadius, {
        isStatic: true,
        restitution: 0,
        friction: 0.12,
        slop: 0.1,
      });
      Composite.add(engine.world, [
        ...walls,
        ...particles.map((particle) => particle.body),
        mouseBody,
      ]);

      for (let step = 0; step < 150; step += 1) {
        Engine.update(engine, fixedStep);
      }
      for (const particle of particles) {
        if (particle.body.speed < 0.16 && particle.body.angularSpeed < 0.035) {
          Sleeping.set(particle.body, true);
        }
      }
      pointer.physicsX = pointer.x;
      pointer.physicsY = pointer.y;
      accumulator = 0;
      previousFrame = performance.now();
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeWorld();
    };

    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const nextX = event.clientX - bounds.left;
      const nextY = event.clientY - bounds.top;
      const now = event.timeStamp || performance.now();
      const elapsed = Math.max(now - pointer.time, 8);
      const scale = 16.667 / elapsed;
      if (pointer.lastX > -900) {
        pointer.vx = pointer.vx * 0.45 + (nextX - pointer.lastX) * scale * 0.55;
        pointer.vy = pointer.vy * 0.45 + (nextY - pointer.lastY) * scale * 0.55;
      }
      pointer.x = nextX;
      pointer.y = nextY;
      pointer.lastX = nextX;
      pointer.lastY = nextY;
      pointer.time = now;
      pointer.active =
        nextX >= 0 &&
        nextX <= bounds.width &&
        nextY >= 0 &&
        nextY <= bounds.height;
    };

    const leave = () => {
      pointer.active = false;
      pointer.lastX = -999;
      pointer.lastY = -999;
    };

    const updateMouseCollider = () => {
      if (!mouseBody) return;
      if (!pointer.active) {
        Body.setPosition(mouseBody, { x: -999, y: -999 });
        pointer.physicsX = -999;
        pointer.physicsY = -999;
        return;
      }
      if (pointer.physicsX < -900) {
        pointer.physicsX = pointer.x;
        pointer.physicsY = pointer.y;
      }
      const dx = pointer.x - pointer.physicsX;
      const dy = pointer.y - pointer.physicsY;
      const distance = Math.hypot(dx, dy);
      const maximumTravel = 12;
      const ratio = distance > maximumTravel ? maximumTravel / distance : 1;
      pointer.physicsX += dx * ratio;
      pointer.physicsY += dy * ratio;
      Body.setPosition(mouseBody, {
        x: pointer.physicsX,
        y: pointer.physicsY,
      });
      Body.setVelocity(mouseBody, {
        x: pointer.vx * 0.62,
        y: pointer.vy * 0.62,
      });

      const pointerSpeed = Math.min(Math.hypot(pointer.vx, pointer.vy), 24);
      for (const particle of particles) {
        const particleDx = particle.body.position.x - pointer.physicsX;
        const particleDy = particle.body.position.y - pointer.physicsY;
        const particleDistance = Math.hypot(particleDx, particleDy);
        const particleRadius = particle.body.circleRadius ?? particle.size * 1.38 + 3;
        const wakeRadius = mouseRadius + particleRadius + 3;
        if (particleDistance >= wakeRadius) continue;

        Sleeping.set(particle.body, false);
        if (pointerSpeed < 0.08) continue;

        const influence = 1 - particleDistance / wakeRadius;
        const safeDistance = Math.max(particleDistance, 0.001);
        const normalX = particleDx / safeDistance;
        const normalY = particleDy / safeDistance;
        Body.setVelocity(particle.body, {
          x:
            particle.body.velocity.x +
            pointer.vx * 0.08 * influence +
            normalX * pointerSpeed * 0.05 * influence,
          y:
            particle.body.velocity.y +
            pointer.vy * 0.08 * influence +
            normalY * pointerSpeed * 0.05 * influence,
        });
        Body.setAngularVelocity(
          particle.body,
          particle.body.angularVelocity +
            (pointer.vx * normalY - pointer.vy * normalX) * 0.001 * influence,
        );
      }
    };

    const draw = (now: number) => {
      const elapsed = Math.min(now - previousFrame, 40);
      previousFrame = now;
      accumulator += elapsed;
      let substeps = 0;
      while (accumulator >= fixedStep && substeps < 5) {
        updateMouseCollider();
        Engine.update(engine, fixedStep);
        accumulator -= fixedStep;
        substeps += 1;
      }
      if (substeps === 5) accumulator = 0;

      pointer.vx *= 0.76;
      pointer.vy *= 0.76;
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) drawShape(particle);
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}

const featuredProjects = [
  {
    index: "01",
    title: "二合一闪补光灯",
    englishTitle: "2-IN-1 FLASH + FILL LIGHT",
    tags: "PRODUCT DESIGN · USER RESEARCH · IMAGING",
    image: "/projects/flash-fill-light.jpg",
    alt: "二合一闪补光灯安装在 Insta360 Ace Pro 2 上的使用场景",
    href: "/projects/flash-fill-light",
  },
  {
    index: "02",
    title: "AI 模板生产平台",
    englishTitle: "AI TEMPLATE PIPELINE",
    tags: "GENERATIVE AI · PIPELINE · CONTENT AUTOMATION",
    image: "/projects/ai-template-pipeline/hero.png",
    alt: "音乐、视觉素材和结构化输出组成的 AI 视频模板自动化生产管线",
    href: "/projects/ai-template-pipeline",
  },
  {
    index: "03",
    title: "相机端 AI 修图",
    englishTitle: "SCENE-AWARE AI RETOUCHING",
    tags: "AI PRODUCT · IMAGING · USER VALIDATION",
    image: "/projects/ai-retouching/hero.png",
    alt: "夜景人像从原始画面自然过渡为经过 AI 优化的高质感效果",
    href: "/projects/ai-retouching",
  },
  {
    index: "04",
    title: "学术研究｜智能体交互",
    englishTitle: "IASDR 2025 · HUMAN–AGENT INTERACTION",
    tags: "ACADEMIC RESEARCH · FIRST AUTHOR · HCAI",
    image: "/projects/ai-ehmi/cover-v2.png",
    alt: "驾驶者与自动驾驶车辆通过外部交互界面建立沟通的概念场景",
    href: "/projects/ai-ehmi",
  },
];

function ProjectGallery() {
  return (
    <section className="project-gallery" id="project-gallery">
      <div className="project-gallery-kicker">
        <span>HUYU · SELECTED WORK</span>
        <span className="code">2026 / 04</span>
      </div>

      <header className="project-gallery-heading">
        <h2>PROJECTS</h2>
        <div className="project-gallery-count">
          <span className="code">04</span>
          <i aria-hidden="true">↘</i>
        </div>
      </header>

      <div className="project-grid">
        {featuredProjects.map((project) => (
          <article className="project-card" id={`project-${project.index}`} key={project.index}>
            {project.href ? (
              <a className="project-card-link" href={project.href} aria-label={`查看项目案例：${project.title}`}>
                <div className="project-visual">
                  <img src={project.image} alt={project.alt} />
                  <div className="project-visual-index code">{project.index}</div>
                  <span className="project-open" aria-hidden="true">↗</span>
                </div>
                <p className="project-tags">{project.tags}</p>
                <div className="project-title-row">
                  <h3>{project.title}</h3>
                  <span>{project.englishTitle}</span>
                </div>
              </a>
            ) : (
              <>
                <div className="project-visual">
                  <img src={project.image} alt={project.alt} />
                  <div className="project-visual-index code">{project.index}</div>
                  <span className="project-open" aria-hidden="true">↗</span>
                </div>
                <p className="project-tags">{project.tags}</p>
                <div className="project-title-row">
                  <h3>{project.title}</h3>
                  <span>{project.englishTitle}</span>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Finale() {
  return (
    <section className="finale" id="finale">
      <ParticleField />
      <header className="finale-nav">
        <a className="finale-wordmark" href="#top">胡宇杰</a>
        <div className="finale-actions">
          <a className="finale-circle" href="/about" aria-label="查看个人信息">—</a>
          <a className="finale-pill finale-pill-dark" href="mailto:huyuj@hnu.edu.cn">
            LET&apos;S TALK <i>•</i>
          </a>
          <a className="finale-pill" href="/about">ABOUT <i>••</i></a>
        </div>
      </header>

      <span className="floating-mark mark-one" aria-hidden="true">＋</span>
      <span className="floating-mark mark-two" aria-hidden="true">＋</span>
      <span className="floating-mark mark-three" aria-hidden="true">＋</span>

      <div className="finale-copy">
        <p>IS YOUR NEXT IDEA READY TO COME ALIVE?</p>
        <h2>
          Let&apos;s work
          <br />
          together!
        </h2>
      </div>

      <a className="finale-cta" href="#top">
        <span>↓</span>
        BACK TO THE TOP
        <span>↓</span>
      </a>
    </section>
  );
}

export default function Home() {
  return (
    <main className="page">
      <div className="dark-chapter">
        <FluidScene />
        <div className="noise" aria-hidden="true" />

        <section className="stage" id="top">
          <header className="nav">
            <a className="wordmark" href="#top">胡宇杰</a>
            <div className="nav-center">
              <span>HU YUJIE</span>
              <span className="code">001</span>
              <span>AI &amp; IMAGING PRODUCT</span>
            </div>
            <div className="nav-actions">
              <a className="nav-circle" href="#project-gallery" aria-label="查看作品">—</a>
              <a className="nav-pill nav-pill-dark" href="mailto:huyuj@hnu.edu.cn">LET&apos;S TALK <i>•</i></a>
              <a className="nav-pill" href="/about">ABOUT <i>••</i></a>
            </div>
          </header>

          <div className="grid-lines" aria-hidden="true">
            <i /><i /><i />
          </div>

          <div className="content-layer">
            <section className="content-row row-works" id="works">
              <h1>SELECTED<br />WORKS</h1>
              <div className="row-marker">
                <span className="star">✦</span>
                <span className="code">01</span>
              </div>
              <div className="project-list">
                <a href="/projects/flash-fill-light"><span>01</span>二合一闪补光灯<i>↗</i></a>
                <a href="/projects/ai-template-pipeline"><span>02</span>AI 模板生产平台<i>↗</i></a>
                <a href="/projects/ai-retouching"><span>03</span>相机端 AI 修图<i>↗</i></a>
                <a href="/projects/ai-ehmi"><span>04</span>学术研究｜智能体交互<i>↗</i></a>
              </div>
            </section>

            <section className="content-row row-about" id="about">
              <h2>ABOUT<br />ME</h2>
              <div className="row-marker">
                <span className="dot-grid">⠿</span>
                <span className="code">02</span>
              </div>
              <div className="about-summary">
                <p>胡宇杰，湖南大学设计学硕士在读（2024—2027）。聚焦 AI 产品与智能影像，把用户问题、模型能力和工程约束组织成可验证的产品方案。</p>
                <a href="/about">查看个人信息 <span>↗</span></a>
                <a href="#explorations">设计作品集 <span>↗</span></a>
              </div>
            </section>

            <section className="content-row row-contact" id="contact">
              <h2>LET&apos;S<br />CONNECT</h2>
              <div className="row-marker">
                <span className="star star-small">✧</span>
                <span className="code">03</span>
              </div>
              <a className="contact-link" href="mailto:huyuj@hnu.edu.cn">
                HUYUJ@HNU.EDU.CN <span>↗</span>
              </a>
            </section>
          </div>

          <div className="scroll-label">
            <span>SCROLL TO EXPLORE</span>
            <i />
          </div>
        </section>
      </div>

      <ProjectGallery />
      <Explorations />
      <Finale />
    </main>
  );
}
