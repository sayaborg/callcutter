import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { compileEngineSound } from '../src/engine-sound.js';
import { compileVehicleEngineSound } from '../src/vehicle-engine-sound.js';

const ENGINES = new URL('../engines/', import.meta.url);

/** Every vehicle of `engines/vehicles.json`, in its order: its facts, and its engine sound as it sounds it. */
export async function loadVehicles() {
  const listed = JSON.parse(await readFile(new URL('vehicles.json', ENGINES), 'utf8'));
  return Promise.all(
    Object.entries(listed).map(async ([id, vehicle]) => {
      const bytes = await readFile(new URL(`sounds/${vehicle.sound}.json`, ENGINES));
      const { metadata, cycleRevolutions, firingPhases, exhaust } = JSON.parse(bytes.toString('utf8'));
      const compiled = {
        ...compileEngineSound({ cycleRevolutions, firingPhases, exhaust }),
        id: vehicle.sound,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        metadata,
      };
      return { id, ...vehicle, sound: compileVehicleEngineSound(compiled, vehicle.engine) };
    }),
  );
}
