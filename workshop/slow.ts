// The kernel run at the output's rate over 2, 4 or 8, and its sound brought up to the output's rate by doubling once
// for each halving: each sample between two is the cubic through the four around it.
import { EngineSoundReference as Kernel, type Listening } from './kernel.ts';

/** Doubles a stream's rate: for each sample in, the sample between the two before it, then the one before it. */
class Doubler {
  private a = 0;
  private b = 0;
  private c = 0;
  between = 0;
  on = 0;
  push(d: number): void {
    this.between = (-this.a + 9 * this.b + 9 * this.c - d) / 16;
    this.on = this.c;
    this.a = this.b;
    this.b = this.c;
    this.c = d;
  }
}

export class EngineSoundSlow {
  private readonly kernel: Kernel;
  private readonly one = new Float64Array(1);
  private readonly speed = new Float64Array(1);
  private readonly open = new Float64Array(1);
  private readonly doublers: Doubler[] = [];
  private readonly ready: Float64Array;
  private at: number;
  constructor(private readonly factor: 2 | 4 | 8, sound: any, rate: number, engine: { sweptVolume: number; compressionRatio: number }, listening: Listening, steepening?: number) {
    this.kernel = new Kernel(sound, rate / factor, engine, listening, steepening);
    for (let f = factor; f > 1; f /= 2) this.doublers.push(new Doubler());
    this.ready = new Float64Array(factor);
    this.at = factor;
  }
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
    const half = this.factor >> (stage + 1);
    this.raise(stage + 1, doubler.between, at);
    this.raise(stage + 1, doubler.on, at + half);
  }
  render(out: Float64Array, offset: number, count: number, rpm: ArrayLike<number>, opening: ArrayLike<number>, burns = true): void {
    const { factor, ready } = this;
    for (let k = 0; k < count; k++) {
      if (this.at === factor) {
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
