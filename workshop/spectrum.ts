// The spectrum of a held engine speed at full throttle, at 24 kHz: node run.mjs spectrum <rpm> <id:form[:file]> ...
// Prints the level in third-octave-like bands (dB re the loudest) and the strongest lines.
import * as H from './harness.ts';
const rpm = +process.argv[2]!;
function fft(re: Float64Array, im: Float64Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j]!, re[i]!]; [im[i], im[j]] = [im[j]!, im[i]!]; } }
  for (let len = 2; len <= n; len <<= 1) { const a = (-2 * Math.PI) / len; for (let i = 0; i < n; i += len) for (let k = 0; k < len / 2; k++) { const c = Math.cos(a * k), s = Math.sin(a * k), u = i + k, v = u + len / 2; const xr = re[v]! * c - im[v]! * s, xi = re[v]! * s + im[v]! * c; re[v] = re[u]! - xr; im[v] = im[u]! - xi; re[u]! += xr; im[u]! += xi; } }
}
const edges = [50, 100, 200, 400, 800, 1600, 3200, 6400, 12000];
for (const name of process.argv.slice(3)) {
  const [id, form, file] = name.split(':') as [string, any, string?];
  const { engine, sound, sweptVolume } = H.load(id, form, file);
  const k = H.kernel(2, sound, engine, sweptVolume);
  const n = 65536, lead = 24000, y = new Float64Array(lead + n);
  k.render(y, 0, lead + n, new Float64Array(lead + n).fill(rpm), new Float64Array(lead + n).fill(1));
  const re = new Float64Array(n), im = new Float64Array(n);
  for (let i = 0; i < n; i++) re[i] = y[lead + i]! * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n));
  fft(re, im);
  const power = Float64Array.from({ length: n / 2 }, (_, i) => re[i]! ** 2 + im[i]! ** 2), hz = (i: number) => (i * H.rate) / n;
  const bands = edges.slice(0, -1).map((lo, b) => { let s = 0; for (let i = 0; i < n / 2; i++) if (hz(i) >= lo && hz(i) < edges[b + 1]!) s += power[i]!; return s; });
  const top = Math.max(...bands);
  const lines: [number, number][] = [];
  for (let i = 2; i < n / 2 - 2; i++) if (power[i]! > power[i - 1]! && power[i]! >= power[i + 1]!) lines.push([hz(i), power[i]!]);
  lines.sort((a, b) => b[1] - a[1]);
  const fire = (rpm / 60) * sound.firingPhases.length / sound.cycleRevolutions;
  console.log((file ?? form).replace(id + '.', '').padEnd(14), 'bands', bands.map((b, i) => `${edges[i]}:${(10 * Math.log10(b / top)).toFixed(0)}`).join(' '), '| lines', lines.slice(0, 6).map(([f, p]) => `${f.toFixed(0)}Hz(x${(f / fire).toFixed(2)})`).join(' '));
}
