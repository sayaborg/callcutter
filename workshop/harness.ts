// The harness (2026-11-21, the mufflers' thread): reads the game's vehicles and engine-sound documents, stands a
// candidate document in for one (./candidates/<id>.json), or adds the old one rule's boxes, and drives the kernel.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { compileEngineSound } from '/home/claude/base/src/audio/engine-sound.ts';
import { integratedLoudness, ENGINE_LOUDNESS_PROCEDURE } from '/home/claude/base/tools/authoring/engine-loudness.ts';
import { EngineSoundReference } from './kernel.ts';
import { EngineSoundSlow } from './slow.ts';
import { compressed } from './chain.ts';
const REPO = '/home/claude/base/';
const HERE = '/home/claude/es/';
export const rate = 48000;
export const LISTENING = { chargeVariation: 0.03, afterfireSeconds: 0.0015, observationSeconds: 0.025 };
/** The game's side, stood in for: with the throttle shut above 1.3 x idle, an afterfire once a second on average. */
export const AFTERFIRES = { perSecond: 1, aboveIdle: 1.3, block: 480 };
export const kernel = (factor: number, sound: any, engine: any, sweptVolume: number, steepening?: number): any => {
  const e = { sweptVolume, compressionRatio: engine.compressionRatio };
  return factor === 1 ? new EngineSoundReference(sound, rate, e, LISTENING, steepening) : new EngineSoundSlow(factor as 2 | 4 | 8, sound, rate, e, LISTENING, steepening);
};
export const OPEN = new Set(['FERRARI_640', 'LOTUS_79_SPECIAL', 'MCLAREN_MP4_4', 'NSR500_1987', 'YZR500_0W98']);
/** The old one rule for every car (estimates): two wide pipes in series on each tail's longest run. */
function withTwoBoxes(doc: any, id: string, displacementCc: number) {
  if (OPEN.has(id)) return;
  if (id === 'PX200E_ARCOBALENO') {
    doc.exhaust.primaries[0].length = 0.5;
    doc.exhaust.pipes = [{ length: 0.3, diameter: 0.12, from: 0, to: 1 }, { length: 0.12, diameter: 0.018, from: 1, to: null }];
    return;
  }
  const pipes: any[] = doc.exhaust.pipes;
  const hosts = new Set<number>();
  pipes.forEach((tail, t) => {
    if (tail.to !== null) return;
    let longest = t, at = t;
    for (;;) {
      const feeders = pipes.map((p, i) => (p.to === pipes[at].from ? i : -1)).filter((i) => i >= 0);
      if (feeders.length !== 1) break;
      at = feeders[0]!;
      if (pipes[at].length > pipes[longest].length) longest = at;
    }
    hosts.add(longest);
  });
  let next = 0;
  for (const p of doc.exhaust.primaries) next = Math.max(next, p.to + 1);
  for (const p of pipes) next = Math.max(next, p.from + 1, (p.to ?? 0) + 1);
  const share = (7 * displacementCc * 1e-6) / hosts.size;
  const out: any[] = [];
  pipes.forEach((p, index) => {
    if (!hosts.has(index)) return out.push(p);
    let from = p.from, at = 0;
    for (const [place, part, limit] of [[0.4, 0.35, 0.316], [0.8, 0.65, 0.395]] as const) {
      const volume = part * share;
      const length = Math.min(2.9 * ((4 * volume) / (Math.PI * 2.9)) ** (1 / 3), limit * p.length);
      const diameter = Math.sqrt((4 * volume) / (Math.PI * length));
      const a = next++, b = next++;
      out.push({ length: Math.max(0.05, place * p.length - length / 2 - at), diameter: p.diameter, from, to: a });
      out.push({ length: +length.toFixed(3), diameter: +diameter.toFixed(3), from: a, to: b });
      from = b; at = place * p.length + length / 2;
    }
    out.push({ length: Math.max(0.05, p.length - at), diameter: p.diameter, from, to: p.to });
  });
  doc.exhaust.pipes = out;
}
/** A car's candidates: ./candidates/<id>.json (the candidate) and ./candidates/<id>.<name>.json (trials beside it). */
export const candidatesOf = (id: string) => readdirSync(HERE + 'candidates').filter((f) => f === id + '.json' || (f.startsWith(id + '.') && f.endsWith('.json'))).sort((a, b) => a.length - b.length || a.localeCompare(b));
export const hasReference = (id: string) => existsSync(HERE + 'references/' + id + '.json');
/**
 * `form`: 'main' (the document as it is), 'rule' (with the old rule's boxes), 'candidate', or 'reference' (the document
 * of the day K named the sound the reference, with the old rule's boxes: ./references/<id>.json).
 */
export function load(id: string, form: 'main' | 'rule' | 'candidate' | 'reference', file = id + '.json') {
  const listings = readdirSync(REPO + 'content/vehicle-listings').map((f) => [f.replace('.json', ''), JSON.parse(readFileSync(REPO + 'content/vehicle-listings/' + f, 'utf8'))]);
  const users = listings.filter(([, l]) => l.sound === id).map(([v]) => v);
  const vehicleId = users.includes(id) ? id : users[0];
  const doc = JSON.parse(readFileSync((form === 'candidate' ? HERE + 'candidates/' + file : (form === 'reference' ? HERE + 'references/' : REPO + 'content/engine-sounds/') + id + '.json'), 'utf8'));
  const engine = JSON.parse(readFileSync(REPO + 'content/vehicles/' + vehicleId + '.json', 'utf8')).powertrain;
  const label = doc.metadata?.label;
  // The game's reader checks the document as it is written.
  compileEngineSound(JSON.parse(JSON.stringify({ ...doc, metadata: undefined })));
  if (form === 'rule' || form === 'reference') withTwoBoxes(doc, id, engine.displacementCc);
  const sound = { cycleRevolutions: doc.cycleRevolutions, firingPhases: doc.firingPhases, exhaust: doc.exhaust };
  return { engine, sound, sweptVolume: (engine.displacementCc * 1e-6) / doc.firingPhases.length, vehicleId, label };
}
export function drive(kernel: any, engine: any) {
  const speed = (v: any) => (v === 'idle' ? engine.idleRpm : v === 'redline' ? engine.redlineRpm : v);
  const parts: Float64Array[] = [];
  let seed = 521288629;
  for (const d of ENGINE_LOUDNESS_PROCEDURE.drive) {
    const n = Math.round(d.seconds * rate), a = speed(d.from), b = speed(d.to), o = new Float64Array(n);
    const rpm = Float64Array.from({ length: n }, (_, i) => a + ((b - a) * i) / n), opening = new Float64Array(n).fill(d.opening);
    for (let at = 0; at < n; at += AFTERFIRES.block) {
      const count = Math.min(AFTERFIRES.block, n - at);
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      if (d.opening < 0.02 && rpm[at]! > AFTERFIRES.aboveIdle * engine.idleRpm && seed / 4294967296 < (AFTERFIRES.perSecond * count) / rate) kernel.afterfire();
      kernel.render(o, at, count, rpm.subarray(at, at + count), opening.subarray(at, at + count));
    }
    parts.push(o);
  }
  const all = new Float64Array(parts.reduce((s, p) => s + p.length, 0));
  let at = 0;
  for (const p of parts) { all.set(p, at); at += p.length; }
  return all;
}
/** The vehicle's gain: the one that brings the compressed drive to -24 LUFS. */
export const gainOf = (y: Float64Array, ratio?: number) => 10 ** ((-24 - integratedLoudness(compressed(y, rate, ratio))) / 20);
export const dB = (x: number) => 20 * Math.log10(x);
export const rms = (y: Float64Array, from = 0, to = y.length) => { let s = 0; for (let i = from; i < to; i++) s += y[i]! * y[i]!; return Math.sqrt(s / (to - from)); };
export const peak = (y: Float64Array, from: number, to: number) => { let p = 0; for (let i = from; i < to; i++) p = Math.max(p, Math.abs(y[i]!)); return p; };
/** The level above 2 kHz (a first difference twice is a crude high-pass; enough to compare two files). */
export const bright = (y: Float64Array, from: number, to: number) => { let s = 0; for (let i = from + 2; i < to; i++) { const d = y[i]! - 2 * y[i - 1]! + y[i - 2]!; s += d * d; } return Math.sqrt(s / (to - from)); };
