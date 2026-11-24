// The free-rev simulator: an engine with nothing on its crank, its throttle in the player's hand, sounded by the
// exhaust kernel and the engine's chain. The engine's own motion here is a simple stand-in (a torque curve, friction
// and one inertia), not a model of any engine.
import { EngineChain, engineGain } from '../src/engine-chain.js';
import { ExhaustRenderer, type ExhaustRateDivisor } from '../src/exhaust-rate.js';
import type { VehicleEngineSound } from '../src/vehicle-engine-sound.js';

/** The loudness every engine's compressed sound is brought to (SUPER OUTRIDE's `mix.engineDriveLufs`). */
export const ENGINE_DRIVE_LUFS = -24;
/** How long the kernel takes to follow the engine's speed and its throttle (SUPER OUTRIDE's `control.observationSeconds`). */
const OBSERVATION_SECONDS = 0.025;
const CHUNK = 512;

/** An engine as the page carries it (`build.mjs`). */
export interface PageEngine {
  readonly name: string;
  readonly sound: VehicleEngineSound;
  readonly idleRpm: number;
  readonly redlineRpm: number;
  readonly torqueCurve: readonly { readonly rpm: number; readonly torqueNewtonMeters: number }[];
  /** The free engine's inertia, kg m^2: a guess. */
  readonly inertia: number;
  /** Its measured loudness at each of the kernel's rates (`EXHAUST_RATE_DIVISORS`' order), LUFS. */
  readonly lufs: readonly number[];
}

export class Sim {
  /** The throttle's opening, 0 to 1. */
  throttle = 0;
  /** A held engine speed (rpm), or null for the free engine. */
  hold: number | null = null;
  rpm = 0;
  /** The fuel is cut: the engine is past its redline. */
  cut = false;
  /** The share of real time the sound takes to compute. */
  load = 0;
  private divisor: ExhaustRateDivisor = 2;
  private engine: PageEngine | null = null;
  private kernel: ExhaustRenderer | null = null;
  private chain: EngineChain | null = null;
  private seed = 521288629;
  private readonly rpmBlock = new Float64Array(CHUNK);
  private readonly openBlock = new Float64Array(CHUNK);
  private readonly raw = new Float64Array(CHUNK);

  constructor(
    private readonly engines: Readonly<Record<string, PageEngine>>,
    private readonly rate: number,
  ) {}

  private build(): void {
    const engine = this.engine;
    if (!engine) return;
    this.kernel = new ExhaustRenderer(engine.sound, this.rate, this.divisor, OBSERVATION_SECONDS);
    this.chain = new EngineChain(this.rate, engineGain(ENGINE_DRIVE_LUFS, engine.lufs[Math.log2(this.divisor)] ?? null));
  }

  /** The output's rate over the rate the kernel runs at. */
  setDivisor(divisor: ExhaustRateDivisor): void {
    this.divisor = divisor;
    this.build();
  }

  setEngine(id: string): void {
    const engine = this.engines[id];
    if (!engine) return;
    this.engine = engine;
    this.build();
    this.rpm = engine.idleRpm;
    this.cut = false;
  }

  private torque(rpm: number): number {
    const curve = this.engine!.torqueCurve;
    for (let i = 1; i < curve.length; i++) {
      const low = curve[i - 1]!,
        high = curve[i]!;
      if (rpm <= high.rpm)
        return (
          low.torqueNewtonMeters +
          (Math.max(0, rpm - low.rpm) / (high.rpm - low.rpm)) * (high.torqueNewtonMeters - low.torqueNewtonMeters)
        );
    }
    return curve[curve.length - 1]!.torqueNewtonMeters;
  }

  /** Fills `out` (any length) with sound; the engine's speed follows the throttle through its inertia. */
  process(out: Float32Array): void {
    const { engine, kernel, chain, rate } = this;
    if (!engine || !kernel || !chain) {
      out.fill(0);
      return;
    }
    const clock: { now(): number } = (globalThis as { performance?: { now(): number } }).performance ?? Date;
    const started = clock.now();
    const peakTorque = Math.max(...engine.torqueCurve.map((point) => point.torqueNewtonMeters));
    for (let at = 0; at < out.length; at += CHUNK) {
      const n = Math.min(CHUNK, out.length - at);
      const dt = n / rate;
      if (this.hold !== null) {
        this.rpm = this.hold;
        this.cut = false;
      } else {
        // The fuel is cut at 1.05 times the redline and comes back at 1.03 times.
        if (this.rpm > 1.05 * engine.redlineRpm) this.cut = true;
        else if (this.rpm < 1.03 * engine.redlineRpm) this.cut = false;
        // Torque by the throttle (an idle governor holds idle), friction rising with speed, one inertia.
        const governor = Math.max(0, Math.min(0.35, (2 * (engine.idleRpm - this.rpm)) / engine.idleRpm + 0.1));
        const drive = this.cut ? 0 : Math.max(this.throttle, governor) * this.torque(this.rpm);
        const friction = peakTorque * (0.08 + (0.17 * this.rpm) / engine.redlineRpm);
        this.rpm = Math.max(
          0.5 * engine.idleRpm,
          this.rpm + ((drive - friction) / engine.inertia) * dt * (30 / Math.PI),
        );
      }
      // With the throttle shut above 1.3 times idle, an afterfire once a second on average.
      this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
      if (this.throttle < 0.02 && this.rpm > 1.3 * engine.idleRpm && this.seed / 4294967296 < dt) kernel.afterfire();
      this.rpmBlock.fill(this.rpm, 0, n);
      this.openBlock.fill(this.throttle, 0, n);
      kernel.render(this.raw, 0, n, this.rpmBlock, this.openBlock, !this.cut);
      // The chain's ceiling is 2 and the output's own is 1: everything plays 6 dB down.
      for (let i = 0; i < n; i++) out[at + i] = 0.5 * chain.process(this.raw[i]!);
    }
    const spent = (clock.now() - started) / 1000 / (out.length / rate);
    this.load += 0.1 * (spent - this.load);
  }
}
