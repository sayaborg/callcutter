// The engine's own chain, after the kernel's sound is at the output's rate: the compressor, the vehicle's gain, the
// soft clip. Sound effects and music are mixed after it.

/** The compressor follows the sound's mean square over this long. */
export const LEVEL_SECONDS = 0.05;
/** The compressor's ratio, to 1: it divides the spread of the sound's level, in dB, by this. Its threshold is at the bottom: all of the sound is in its range. */
export const RATIO = 2;
/** The soft clip's ceiling, over the level the gain brings the sound to. */
export const CEILING = 2;

/** The compressor: a sample of a sound whose mean square is `level`. */
export function compress(x: number, level: number, ratio = RATIO): number {
  return level > 0 ? x * level ** (-(1 - 1 / ratio) / 2) : 0;
}

/** A whole sound through the compressor alone: what the vehicle's gain is measured on. */
export function compressed(signal: Float64Array, rate: number, ratio = RATIO): Float64Array {
  const follow = 1 - Math.exp(-1 / (LEVEL_SECONDS * rate));
  const out = new Float64Array(signal.length);
  let level = 0;
  for (let i = 0; i < signal.length; i++) {
    level += follow * (signal[i]! * signal[i]! - level);
    out[i] = compress(signal[i]!, level, ratio);
  }
  return out;
}

/**
 * The chain of one engine. `gain` is its vehicle's, for the rate its kernel runs at: the one that brings the
 * compressed sound of the loudness procedure's drive to the mix's engine loudness.
 */
export class EngineChain {
  private level = 0;
  private readonly follow: number;
  constructor(
    rate: number,
    private readonly gain: number,
    /** The page's trial of another ratio; the game's is RATIO. */
    private readonly ratio = RATIO,
  ) {
    this.follow = 1 - Math.exp(-1 / (LEVEL_SECONDS * rate));
  }
  /** One sample of the kernel's sound in, one of the engine's out; it stays under CEILING. */
  process(x: number): number {
    this.level += this.follow * (x * x - this.level);
    const y = this.gain * compress(x, this.level, this.ratio);
    return y / (1 + Math.abs(y) / CEILING);
  }
}
