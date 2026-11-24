import { ExhaustWaveguide } from './exhaust-waveguide.js';
import type { VehicleEngineSound } from './vehicle-engine-sound.js';

/** The output's rate over the rate an exhaust kernel runs at: each a halving of the one before. */
export const EXHAUST_RATE_DIVISORS = Object.freeze([1, 2, 4, 8] as const);
export type ExhaustRateDivisor = (typeof EXHAUST_RATE_DIVISORS)[number];

/** Doubles a stream's rate: for each sample in, the sample between the two before it, then the one before it. */
class Doubler {
  private a = 0;
  private b = 0;
  private c = 0;
  between = 0;
  on = 0;
  push(d: number): void {
    // The cubic through the four samples around the one between.
    this.between = (-this.a + 9 * this.b + 9 * this.c - d) / 16;
    this.on = this.c;
    this.a = this.b;
    this.b = this.c;
    this.c = d;
  }
}

/**
 * The kernel run at the output's `rate` over `divisor`, its sound brought up to the output's rate by doubling once for
 * each halving. The kernel takes the targets of the first output sample of each of its own; with divisor 1 it renders
 * the output's samples itself. The kernel is one model at every rate: only the rate it is given differs.
 * `observationSeconds` is how long the kernel takes to follow its targets (the game's was 0.025).
 */
export class ExhaustRenderer {
  private readonly kernel: ExhaustWaveguide;
  private readonly divisor: ExhaustRateDivisor;
  private readonly one = new Float64Array(1);
  private readonly speed = new Float64Array(1);
  private readonly open = new Float64Array(1);
  private readonly doublers: readonly Doubler[];
  /** The output samples of the kernel's latest sample, and the next of them to give. */
  private readonly ready: Float64Array;
  private at: number;

  constructor(sound: VehicleEngineSound, rate: number, divisor: ExhaustRateDivisor, observationSeconds: number) {
    this.kernel = new ExhaustWaveguide(sound, rate / divisor, observationSeconds);
    this.divisor = divisor;
    this.doublers = Array.from({ length: Math.log2(divisor) }, () => new Doubler());
    this.ready = new Float64Array(divisor);
    this.at = divisor;
  }

  /** The kernel's next charge burns in the pipe ({@link ExhaustWaveguide.afterfire}). */
  afterfire(): void {
    this.kernel.afterfire();
  }

  /** Sends one sample through the doublers from `stage` on, laying what comes out at ready[at ..]. */
  private raise(stage: number, sample: number, at: number): void {
    if (stage === this.doublers.length) {
      this.ready[at] = sample;
      return;
    }
    const doubler = this.doublers[stage]!;
    doubler.push(sample);
    const half = this.divisor >> (stage + 1);
    this.raise(stage + 1, doubler.between, at);
    this.raise(stage + 1, doubler.on, at + half);
  }

  /** Render `count` output samples into `out` from `offset`, as {@link ExhaustWaveguide.render} does. */
  render(
    out: Float64Array,
    offset: number,
    count: number,
    rpm: ArrayLike<number>,
    opening: ArrayLike<number>,
    burns: boolean,
  ): void {
    const { divisor, ready } = this;
    // At the output's rate the kernel takes every sample's targets, whose calls may divide the samples as they come.
    if (divisor === 1) {
      this.kernel.render(out, offset, count, rpm, opening, burns);
      return;
    }
    for (let k = 0; k < count; k++) {
      if (this.at === divisor) {
        this.speed[0] = rpm[k]!;
        this.open[0] = opening[k]!;
        this.kernel.render(this.one, 0, 1, this.speed, this.open, burns);
        this.raise(0, this.one[0]!, 0);
        this.at = 0;
      }
      out[offset + k] = ready[this.at++]!;
    }
  }
}
