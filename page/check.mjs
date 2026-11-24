// Runs the built page's own scripts in Node behind a stand-in document: draws every engine's exhaust, then plays each
// rate's simulator for three seconds at full throttle.
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
const elements = {};
const element = (id) =>
  (elements[id] ??= {
    style: {},
    classList: { toggle() {} },
    setAttribute() {},
    addEventListener() {},
    appendChild() {},
    getBoundingClientRect: () => ({ top: 0, height: 1 }),
  });
globalThis.document = {
  getElementById: element,
  querySelector: () => ({ value: '2' }),
  querySelectorAll: () => [],
  createElement: () => ({}),
};
globalThis.window = { addEventListener() {} };
new Function(`${scripts[0]};globalThis.CC = CC;${scripts[1]};globalThis.ENGINES = CARS;globalThis.selectCar = selectCar;`)();

const ids = Object.keys(ENGINES);
for (const id of ids) selectCar(id);
console.log(`exhausts drawn: ${ids.length}`);
for (const divisor of [1, 2, 4]) {
  const sim = new CC.Sim(ENGINES, 48000);
  sim.setDivisor(divisor);
  sim.setEngine(ids[0]);
  sim.throttle = 1;
  const out = new Float32Array(3 * 48000);
  const started = performance.now();
  sim.process(out);
  const load = (performance.now() - started) / 30;
  let peak = 0,
    square = 0;
  for (const x of out) {
    peak = Math.max(peak, Math.abs(x));
    square += x * x;
  }
  if (!out.every(Number.isFinite) || !(peak > 0 && peak < 1)) throw new Error(`${ids[0]} at divisor ${divisor} does not sound`);
  console.log(
    `${ids[0]} at ${48 / divisor} kHz: ${Math.round(sim.rpm)} rpm, fuel cut ${sim.cut}, peak ${peak.toFixed(2)}, ` +
      `${(10 * Math.log10(square / out.length)).toFixed(1)} dB, load ${load.toFixed(1)} %`,
  );
}
