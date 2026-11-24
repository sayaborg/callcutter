// Builds the free-rev page, one file: bundles sim.ts and lays it and the engines into page.html.  -> page/index.html
import { buildSync } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { loadVehicles } from '../tests/engines.mjs';

const here = (name) => new URL(name, import.meta.url);
// Class fields are kept native (target es2022): lowered, the kernel is several times slower.
const { outputFiles } = buildSync({
  entryPoints: [here('sim.ts').pathname],
  bundle: true,
  format: 'iife',
  globalName: 'CC',
  target: 'es2022',
  minify: true,
  write: false,
});
const engines = Object.fromEntries(
  (await loadVehicles()).map(({ id, name, sound, engine, lufs }) => {
    const litres = engine.displacementCc / 1000,
      cylinders = sound.firingPhases.length;
    return [
      id,
      {
        name: `${name} (${id.replace(/_/g, ' ')})`,
        cylinders,
        litres,
        sound: { ...sound, metadata: undefined },
        idleRpm: engine.idleRpm,
        redlineRpm: engine.redlineRpm,
        torqueCurve: engine.torqueCurve,
        // The free engine's inertia (kg m^2): a guess.
        inertia: +(0.6 * (0.04 + 0.05 * litres) * (cylinders <= 2 ? 0.6 : 1)).toFixed(4),
        lufs,
      },
    ];
  }),
);
const first = process.argv[2] ?? Object.keys(engines)[0];
writeFileSync(
  here('index.html'),
  readFileSync(here('page.html'), 'utf8')
    .replace('__BUNDLE__', () => outputFiles[0].text)
    .replace('__ENGINES__', () => JSON.stringify(engines))
    .replace('__FIRST__', first),
);
console.log(`page/index.html: ${Object.keys(engines).length} engines, first ${first}`);
