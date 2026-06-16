import { useEffect, useRef } from 'react'

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: false, antialias: true })
    if (!gl) return

    let W = 0, H = 0, dpr = 1
    let animId: number
    let mx = 0.5, my = 0.5
    let time = 0

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2)
      W = canvas!.clientWidth
      H = canvas!.clientHeight
      canvas!.width = W * dpr
      canvas!.height = H * dpr
      gl!.viewport(0, 0, W * dpr, H * dpr)
    }

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `

    const frag = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      uniform vec2 u_mouse;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        uv.y = 1.0 - uv.y;

        vec2 drift = (u_mouse - 0.5) * 0.06;
        uv += drift * 0.3;

        float grad = 1.0 - length(uv - vec2(0.1, 0.9)) * 0.7;
        grad = clamp(grad, 0.0, 1.0);

        float n1 = noise(uv * 2.0 + u_time * 0.05);
        float n2 = noise(uv * 1.5 - u_time * 0.03 + 10.0);

        float pulse = 0.5 + 0.5 * sin(u_time * 0.4);

        vec3 col = vec3(0.11, 0.098, 0.09);

        vec3 amber = vec3(0.271, 0.102, 0.012);
        col = mix(col, amber * 1.5, grad * n1 * 0.5 * (0.7 + 0.3 * pulse));

        vec3 gold = vec3(0.984, 0.749, 0.141);
        float goldBlob = 1.0 - length(uv - vec2(0.15, 0.85)) * 2.5;
        goldBlob = clamp(goldBlob, 0.0, 1.0);
        col = mix(col, gold * 0.3, goldBlob * n2 * 0.4 * pulse);

        float vig = 1.0 - length(uv - 0.5) * 1.2;
        vig = clamp(vig, 0.0, 1.0);
        col *= vig;

        gl_FragColor = vec4(col, 1.0);
      }
    `

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX / W
      my = e.clientY / H
    }
    window.addEventListener('mousemove', onMouseMove)

    let lastT = 0
    function render(t: number) {
      time += (t - lastT) * 0.001
      lastT = t
      gl!.uniform1f(uTime, time)
      gl!.uniform2f(uRes, W * dpr, H * dpr)
      gl!.uniform2f(uMouse, mx, my)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
      animId = requestAnimationFrame(render)
    }
    animId = requestAnimationFrame((t) => { lastT = t; render(t) })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
