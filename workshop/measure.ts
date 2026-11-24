// node run.mjs measure TESTAROSSA:main TESTAROSSA:rule TESTAROSSA:candidate ...
import * as H from './harness.ts';
import { compressed, CEILING } from './chain.ts';
const r = H.rate;
for (const name of process.argv.slice(2)) {
  const [id, form, file] = name.split(':') as [string, any, string?];
  const { engine, sound, sweptVolume } = H.load(id, form, file);
  const pipes = sound.exhaust.pipes.length;
  for (const factor of [1, 2, 4, 8]) {
    const k = H.kernel(factor, sound, engine, sweptVolume);
    const t = performance.now();
    const y = H.drive(k, engine);
    const cost = (performance.now() - t) / 1000 / (y.length / r);
    const finite = y.every((x) => Number.isFinite(x));
    const [a, b] = [r, Math.round(4.3 * r)];
    const g = H.gainOf(y), c = compressed(y, r);
    // After the chain: how far the full-throttle part's peaks go into the soft clip, and idle against full.
    const out = c.map((x) => { const v = g * x; return v / (1 + Math.abs(v) / CEILING); });
    console.log(name.padEnd(28), `${48 / factor}k`.padStart(4), finite ? 'ok ' : 'NOT FINITE', `pipes ${pipes}`, `cost ${(100 * cost).toFixed(1)}%`,
      `full ${H.dB(H.rms(y, a, b)).toFixed(1)} crest ${H.dB(H.peak(y, a, b) / H.rms(y, a, b)).toFixed(1)} bright ${H.dB(H.bright(y, a, b) / H.rms(y, a, b)).toFixed(1)}`,
      `| raw idle-full ${(H.dB(H.rms(y, r / 2, r)) - H.dB(H.rms(y, a, b))).toFixed(1)}`,
      `| out full ${H.dB(H.rms(out, a, b)).toFixed(1)} idle ${H.dB(H.rms(out, r / 2, r)).toFixed(1)} peak ${H.peak(out, 0, out.length).toFixed(2)}`);
  }
}
