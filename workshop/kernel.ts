// SUPER OUTRIDE engine sound: the reference kernel of 2026-11-20, seventh form (the sixth, pared: offline, one sample at a time). Tubes and the spaces their ends open into: cylinders, junctions and the outside. One law holds at every
// end, and every space (a junction is a cylinder with no volume) finds its pressure within the sample. Waves are w = p / (rho c^2); a flow's Mach number is the
// difference of the two waves at a tube's end. It keeps the game's engine-sound document (valve, primaries, pipes) and
// wall loss as they are.
import { ACOUSTICS, openEndCutoffHz, wallLossPoles, wallLossNepers } from '/home/claude/base/src/audio/exhaust-acoustics.ts';

/** Physical assumptions, none chosen by listening. */
export const GAS = Object.freeze({
  gamma: 1.4,
  steepening: 1.2,
  choked: 0.5787,
  /** The tubes' gas: it sets the waves' speed, and is the unit of density. */
  pipeKelvin: 573.15,
  intakeKelvin: 293.15,
  burnedKelvin: 1100,
  discharge: 0.65,
  /** The share of a full charge a cylinder draws with the throttle shut. */
  closedCharge: 0.3,
});

/**
 * Wool (adopted 2026-11-22, K by ear): a wall that gives. Round the gas's way lies wool `wool` thick: its resistance to
 * flow R = resistivity x wool, and behind it the wool's own depth of gas, a spring. Such a wall takes nothing of a slow
 * wave and all its resistance allows of a fast one, the turn at
 *   f0 = gamma p0 / (2 pi R wool),
 * and a wave running the tube's length loses at most
 *   A = (2 length / (diameter - 2 wool)) (rho c / R)   nepers   (rho c = gamma p0 / c),
 * between them A f^2 / (f0^2 + f^2). One first-order shelf carries it: pole at fp = f0 sqrt((1 - e^(-2A)) / (2A)) (so its
 * loss far below f0 is the wall's, A f^2 / f0^2), zero at fp e^A (so its loss far above is A). A rate that does not carry
 * the pole (fp at or above 0.49 of it) has no wool.
 */
export const WOOL = { resistivity: 3e4, pressure: 101325 };
export function woolShelf(length: number, diameter: number, wool: number, rate: number): [number, number, number] | null {
  const R = WOOL.resistivity * wool, stiff = GAS.gamma * WOOL.pressure;
  const f0 = stiff / (2 * Math.PI * R * wool);
  const A = ((2 * length) / (diameter - 2 * wool)) * (stiff / ACOUSTICS.waveSpeed / R);
  const fp = f0 * Math.sqrt((1 - Math.exp(-2 * A)) / (2 * A));
  if (fp >= 0.49 * rate) return null;
  const fz = Math.min(fp * Math.exp(A), 0.49 * rate);
  const K = 2 * rate, wp = K * Math.tan((Math.PI * fp) / rate), wz = K * Math.tan((Math.PI * fz) / rate), g = wp / wz, a0 = K + wp;
  return [(g * (K + wz)) / a0, (g * (wz - K)) / a0, (wp - K) / a0];
}

/** Trial (2026-11-22, K): what the model makes of a real valve: 0.8 of its diameter, open 1.2 times as long. */
export const VALVE = { diameter: 1, open: 1 };

export interface Listening {
  chargeVariation: number;
  afterfireSeconds: number;
  observationSeconds: number;
}

/**
 * The one law of a tube's end. The end opens, through a throat of `a` of the tube's cross-section, into a space whose
 * width is 1 / `sigma` of the tube's (a cylinder or the outside: sigma = 0). A narrowing stream keeps its total
 * pressure; a widening one keeps its momentum and so loses the head of (u_throat - u_after). With m the flow from the
 * tube into the space (a Mach number) and pressures over rho c^2:
 *   tube -> space:  p_end - P =  m^2 / 2 * ((1/a - sigma)^2 + sigma^2 - 1)
 *   space -> tube:  p_end - P = -m^2 / 2 * (1 + (1/a - 1)^2 - sigma^2) / q
 * `q` weighs the space's gas against the tube's (1 where they are the same gas; a cylinder's is in its valve's flow).
 */
export function endHead(a: number, sigma: number, q: number, outward: boolean): number {
  return outward ? (1 / a - sigma) ** 2 + sigma * sigma - 1 : (1 + (1 / a - 1) ** 2 - sigma * sigma) / q;
}
/** The flow m of an end whose pressure, with its flow stopped, stands `d` above its space's: m + head m |m| / 2 = d. */
export function endFlow(d: number, a: number, sigma: number, q: number): number {
  const K = endHead(a, sigma, q, d >= 0);
  const size = Math.abs(d);
  const m = Math.abs(K) > 1e-9 ? (-1 + Math.sqrt(Math.max(0, 1 + 2 * K * size))) / K : size;
  return d >= 0 ? m : -m;
}


/** The game's wallLossSections. */
export function wallLossSections(length: number, diameter: number, rate: number): Float64Array {
  const cornersHz = [20, 160, 1280, 10240], ratio = 8, zeroCap = 0.49;
  const kappa = wallLossNepers(length, diameter, 1);
  const out = new Float64Array(cornersHz.length * 3);
  const K = 2 * rate;
  cornersHz.forEach((fp, k) => {
    let depth = kappa * ((Math.SQRT2 * Math.log(ratio)) / Math.PI) * Math.sqrt(fp);
    if (k === 0) depth *= Math.sqrt(ratio) / (Math.sqrt(ratio) - 1);
    const fz = Math.min(fp * Math.exp(depth), zeroCap * rate);
    const wp = K * Math.tan((Math.PI * fp) / rate), wz = K * Math.tan((Math.PI * fz) / rate);
    const g = wp / wz, a0 = K + wp;
    out[3 * k] = (g * (K + wz)) / a0;
    out[3 * k + 1] = (g * (wz - K)) / a0;
    out[3 * k + 2] = (wp - K) / a0;
  });
  return out;
}
/**
 * A tube's wall loss at `rate`, as the game has it (first-order shelves in series, written as a constant and one
 * weight per shelf's pole), with the shelves whose corners the rate does not carry (at or above half of it, where the
 * pole leaves the unit circle) left out: `[C, R_0 .. R_3]`, a left-out shelf's weight 0.
 */
function wallLossWeightsAt(length: number, diameter: number, rate: number): Float64Array {
  const s = wallLossSections(length, diameter, rate);
  const shelves = s.length / 3;
  const b0 = (k: number) => s[3 * k]!,
    b1 = (k: number) => s[3 * k + 1]!,
    a = (k: number) => s[3 * k + 2]!;
  const carried = (k: number) => Math.abs(a(k)) < 1;
  const out = new Float64Array(shelves + 1);
  let direct = 1;
  for (let k = 0; k < shelves; k++) if (carried(k)) direct *= b1(k) / a(k);
  out[0] = direct;
  for (let k = 0; k < shelves; k++) {
    if (!carried(k)) continue;
    const w = -1 / a(k);
    let residue = b0(k) + b1(k) * w;
    for (let j = 0; j < shelves; j++) if (j !== k && carried(j)) residue *= (b0(j) + b1(j) * w) / (1 + a(j) * w);
    out[k + 1] = residue;
  }
  return out;
}

/** How near its pressure a space's search stops (pressures are over rho c^2; a loud wave is 0.1). */
const TOLERANCE = 1e-9;

/**
 * Trial (2026-11-22): wool as the kernel's own things. A pipe with `shell` (the diameter of the wool wound round it) is
 * its own narrow tube, cut into short lengths, and at each cut a space of the wool's volume that the gas reaches
 * through the wool: its head is r u + K u^2 / 2 for the gas's speed u through the pipe's wall (r = packing x the wool's
 * thickness; K the holes'). No frequency is written anywhere.
 */
const WOOL_SPACE = { packing: 17, holes: 22, lengths: [0.08, 0.1, 0.06, 0.12] };
function woolExpanded(sound: any): any {
  const ex = sound.exhaust;
  if (!ex.pipes.some((p: any) => p.shell)) return sound;
  let next = 0;
  for (const p of ex.primaries) next = Math.max(next, p.to + 1);
  for (const p of ex.pipes) next = Math.max(next, p.from + 1, (p.to ?? -1) + 1);
  const pipes: any[] = [], wool: any[] = [];
  for (const p of ex.pipes) {
    if (!p.shell) { pipes.push(p); continue; }
    const lengths: number[] = [];
    let left = p.length, i = 0;
    while (left > 0.14 + 1e-9) { const l = WOOL_SPACE.lengths[i++ % 4]!; lengths.push(l); left -= l; }
    lengths.push(Math.round(left * 100) / 100);
    const nodes: (number | null)[] = [p.from];
    for (let n = 1; n < lengths.length; n++) nodes.push(next++);
    nodes.push(p.to);
    lengths.forEach((length, n) => pipes.push({ length, diameter: p.diameter, from: nodes[n], to: nodes[n + 1] }));
    const real = nodes.filter((n) => n !== null) as number[];
    const thickness = (p.shell - p.diameter) / 2;
    for (const junction of real)
      wool.push({ junction, area: (4 * p.diameter * p.length) / real.length, volume: ((Math.PI / 4) * (p.shell ** 2 - p.diameter ** 2) * p.length) / real.length, r: (p.packing ?? WOOL_SPACE.packing) * thickness, K: p.holes ?? WOOL_SPACE.holes });
  }
  return { ...sound, exhaust: { ...ex, pipes, wool } };
}
/**
 * The kernel, laid flat: the same arithmetic as the form written with objects (a Line per direction of a tube, an End
 * per tube's end, a Space per junction and cylinder), in typed arrays.
 *
 * A line is one direction of one tube: its wall loss, then N samples in which a value w travels at
 * c (1 + steepening w), later values overtaking earlier ones into shocks that keep the wave's area. The value arriving
 * now is the one sent at the t that makes -k S(t) + (t - (now - N))^2 / 2 least (S the running sum of w,
 * k = steepening N: Lax and Oleinik). Each t is a straight line in (now - N), so the least is the lower envelope of
 * the lines: sent in order and asked in order, each line enters and leaves the envelope once.
 *
 * A space is what tubes' ends open into. It holds gas G, counted as the volume the gas would fill at the outside's
 * pressure, in a volume V, and its pressure is (G / V)^gamma. A junction has no volume and so holds nothing; a cylinder
 * is a junction with a volume, which its piston moves, and one end, its valve the end's throat.
 */
export class EngineSoundReference {
  // Lines: forward (cylinder to junction) and backward of each primary, then down and up of each pipe.
  private readonly lineN: Int32Array;
  private readonly lineMask: Int32Array;
  private readonly lineBase: Int32Array;
  private readonly lineK: Float64Array;
  private readonly woolShelves: Float64Array;
  private readonly woolState: Float64Array;
  /** Trial (2026-11-22): a line's drag g, the gas rubbing through wool by the square of its speed: dw/dx = -(g/L) |w| w, so a wave w leaves as w / (1 + g |w|). */
  private readonly lineDrag: Float64Array;
  private readonly lineHead: Float64Array;
  private readonly lineTail: Float64Array;
  private readonly lineLast: Float64Array;
  private readonly w: Float64Array;
  private readonly sum: Float64Array;
  /** Each line's envelope, oldest first: a line's t, and the (now - N) from which it lies below the line before it. */
  private readonly at: Float64Array;
  private readonly from: Float64Array;
  private readonly filter: Float64Array;
  private readonly loss: Float64Array;
  private readonly poles: Float64Array;
  private n = 0;
  // Junctions' ends, junction by junction: junction j's are endFirst[j] .. endFirst[j + 1] - 1.
  private readonly endFirst: Int32Array;
  private readonly endArea: Float64Array;
  private readonly endRead: Int32Array;
  private readonly endWrite: Int32Array;
  /** At a junction the law's heads are fixed: into the junction, and out of it. */
  private readonly endHeadIn: Float64Array;
  private readonly endHeadOut: Float64Array;
  private readonly endArriving: Float64Array;
  private readonly endFlow: Float64Array;
  private readonly junctionPressure: Float64Array;
  private readonly woolArea!: Float64Array;
  private readonly woolVolume!: Float64Array;
  private readonly woolR!: Float64Array;
  private readonly woolK!: Float64Array;
  private readonly woolPressure!: Float64Array;
  private readonly swelling: Float64Array;
  // Cylinders: the gas each holds, its density at the outside's pressure over the tubes' gas's, its primary's area.
  private readonly gas: Float64Array;
  private readonly density: Float64Array;
  private readonly valveArea: Float64Array;
  private readonly valveArriving: Float64Array;
  private readonly valveFlow: Float64Array;
  /** The charge (of the tubes' gas, a volume) each cylinder let out unburned for an afterfire, until its valve shuts. */
  private readonly unburned: Float64Array;
  private readonly burning: { junction: number; volume: number; elapsed: number }[] = [];
  private readonly outlet: Float64Array;
  private readonly mouth: Float64Array;
  private readonly follow: Float64Array;
  private readonly smoothing: number;
  private afterfiring = false;
  private phase = 0;
  private rpm = 1000;
  private opening = 0;
  private chargeSeed = 123456789;
  constructor(
    private readonly sound: any,
    private readonly rate: number,
    private readonly engine: { sweptVolume: number; compressionRatio: number },
    private readonly listening: Listening,
    /** Trial (2026-11-21): how much faster a higher wave travels; the gas's own is the game's. */
    steepening: number = GAS.steepening,
  ) {
    (this as any).sound = sound = woolExpanded(sound);
    const { primaries, pipes } = sound.exhaust;
    const cylinders = primaries.length;
    const tubes = [...primaries, ...primaries, ...pipes, ...pipes];
    const lines = tubes.length;
    this.poles = wallLossPoles(rate).map((pole: number) => (Math.abs(pole) < 1 ? pole : 0));
    this.lineN = new Int32Array(lines);
    this.lineMask = new Int32Array(lines);
    this.lineBase = new Int32Array(lines);
    this.lineK = new Float64Array(lines);
    this.lineDrag = Float64Array.from(tubes, (tube: any) => tube.drag ?? 0);
    this.lineHead = new Float64Array(lines);
    this.lineTail = new Float64Array(lines);
    this.lineLast = new Float64Array(lines).fill(-1);
    this.filter = new Float64Array(4 * lines);
    this.loss = new Float64Array(5 * lines);
    this.woolShelves = new Float64Array(3 * lines);
    this.woolState = new Float64Array(2 * lines);
    let cells = 0;
    tubes.forEach((tube: any, l: number) => {
      const N = Math.max(1, Math.round((tube.length * rate) / ACOUSTICS.waveSpeed));
      let size = 4;
      while (size < 4 * N + 8) size *= 2;
      this.lineN[l] = N;
      this.lineMask[l] = size - 1;
      this.lineBase[l] = cells;
      this.lineK[l] = steepening * N;
      this.loss.set(wallLossWeightsAt(tube.length, tube.diameter, rate), 5 * l);
      const shelf = tube.wool > 0 ? woolShelf(tube.length, tube.diameter, tube.wool, rate) : null;
      if (shelf) this.woolShelves.set(shelf, 3 * l);
      else this.woolShelves[3 * l] = NaN;
      cells += size;
    });
    this.w = new Float64Array(cells);
    this.sum = new Float64Array(cells);
    this.at = new Float64Array(cells);
    this.from = new Float64Array(cells);
    const forward = (i: number) => i;
    const backward = (i: number) => cylinders + i;
    const down = (j: number) => 2 * cylinders + j;
    const up = (j: number) => 2 * cylinders + pipes.length + j;
    const junctions: { area: number; read: number; write: number }[][] = [];
    const at = (junction: number) => {
      while (junctions.length <= junction) junctions.push([]);
      return junctions[junction]!;
    };
    primaries.forEach((primary: any, i: number) => at(primary.to).push({ area: primary.diameter * primary.diameter, read: forward(i), write: backward(i) }));
    pipes.forEach((pipe: any, j: number) => {
      at(pipe.from).push({ area: pipe.diameter * pipe.diameter, read: up(j), write: down(j) });
      if (pipe.to !== null) at(pipe.to).push({ area: pipe.diameter * pipe.diameter, read: down(j), write: up(j) });
    });
    const ends = junctions.reduce((count, junction) => count + junction.length, 0);
    this.endFirst = new Int32Array(junctions.length + 1);
    this.endArea = new Float64Array(ends);
    this.endRead = new Int32Array(ends);
    this.endWrite = new Int32Array(ends);
    this.endHeadIn = new Float64Array(ends);
    this.endHeadOut = new Float64Array(ends);
    this.endArriving = new Float64Array(ends);
    this.endFlow = new Float64Array(ends);
    let e = 0;
    junctions.forEach((junction, j) => {
      this.endFirst[j] = e;
      for (const one of junction) {
        let others = 0;
        for (const other of junction) if (other !== one) others += other.area;
        // The tube's cross-section over its space's (the other ends' sum), at most 1.
        const sigma = Math.min(1, one.area / others);
        this.endArea[e] = one.area;
        this.endRead[e] = one.read;
        this.endWrite[e] = one.write;
        this.endHeadIn[e] = endHead(1, sigma, 1, true);
        this.endHeadOut[e] = endHead(1, sigma, 1, false);
        e++;
      }
    });
    this.endFirst[junctions.length] = e;
    this.junctionPressure = new Float64Array(junctions.length);
    this.woolArea = new Float64Array(junctions.length);
    this.woolVolume = new Float64Array(junctions.length).fill(1);
    this.woolR = new Float64Array(junctions.length);
    this.woolK = new Float64Array(junctions.length);
    this.woolPressure = new Float64Array(junctions.length);
    for (const one of sound.exhaust.wool ?? []) {
      this.woolVolume[one.junction] = this.woolArea[one.junction]! > 0 ? this.woolVolume[one.junction]! + one.volume : one.volume;
      this.woolArea[one.junction]! += one.area;
      this.woolR[one.junction] = one.r;
      this.woolK[one.junction] = one.K;
    }
    this.swelling = new Float64Array(junctions.length);
    this.gas = new Float64Array(cylinders).fill(engine.sweptVolume);
    this.density = new Float64Array(cylinders).fill(GAS.pipeKelvin / GAS.burnedKelvin);
    this.valveArea = Float64Array.from(primaries, (primary: any) => primary.diameter * primary.diameter);
    this.valveArriving = new Float64Array(cylinders);
    this.valveFlow = new Float64Array(cylinders);
    this.unburned = new Float64Array(cylinders);
    this.outlet = new Float64Array(pipes.length);
    this.mouth = new Float64Array(pipes.length);
    this.follow = Float64Array.from(pipes, (pipe: any) => 1 - Math.exp((-2 * Math.PI * openEndCutoffHz(pipe.diameter)) / rate));
    this.smoothing = 1 - Math.exp(-1 / (listening.observationSeconds * rate));
  }
  private draw(seed: number): number {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return seed;
  }
  /** The next charge leaves its cylinder unburned and burns in the pipe: an afterfire. When is the game's to say. */
  afterfire(): void {
    this.afterfiring = true;
  }
  /** The value arriving now at a line's far end. */
  private read(l: number): number {
    const { w, at, from } = this;
    const mask = this.lineMask[l]!;
    const base = this.lineBase[l]!;
    const k = this.lineK[l]!;
    const n = this.n;
    const linear = n - this.lineN[l]!;
    const tail = this.lineTail[l]!;
    let head = this.lineHead[l]!;
    if (linear < 0 || head === tail) return 0;
    while (tail - head > 1 && (from[base + ((head + 1) & mask)]! <= linear || at[base + (head & mask)]! < n - mask)) head++;
    this.lineHead[l] = head;
    const best = at[base + (head & mask)]!;
    const earliest = this.lineLast[l]!;
    this.lineLast[l] = best;
    // residual(t) = t - linear - k w(t): where it crosses nothing between two samples, the value arriving lies between.
    const value = w[base + (best & mask)]!;
    const here = best - linear - k * value;
    if (here > 0 && best > earliest && best > 0) {
      const earlier = w[base + ((best - 1) & mask)]!;
      const before = best - 1 - linear - k * earlier;
      if (before < 0) return earlier + (before / (before - here)) * (value - earlier);
    } else if (here < 0 && best < n - 1) {
      const later = w[base + ((best + 1) & mask)]!;
      const after = best + 1 - linear - k * later;
      if (after > 0) return value + (here / (here - after)) * (later - value);
    }
    return value;
  }
  /** Sends a value into a line: through the wall loss, then onto the envelope's end; lines it leaves no room for go. */
  private write(l: number, x: number): void {
    const { w, sum, at, from, filter, loss, poles } = this;
    const mask = this.lineMask[l]!;
    const base = this.lineBase[l]!;
    const k = this.lineK[l]!;
    const f = 4 * l;
    const c = 5 * l;
    let y = loss[c]! * x;
    for (let s = 0; s < 4; s++) {
      filter[f + s] = x - poles[s]! * filter[f + s]!;
      y += loss[c + s + 1]! * filter[f + s]!;
    }
    const b0 = this.woolShelves[3 * l]!;
    if (b0 === b0) {
      const shelved = b0 * y + this.woolShelves[3 * l + 1]! * this.woolState[2 * l]! - this.woolShelves[3 * l + 2]! * this.woolState[2 * l + 1]!;
      this.woolState[2 * l] = y;
      this.woolState[2 * l + 1] = shelved;
      y = shelved;
    }
    const probe = (globalThis as any).__probe;
    if (probe) { probe.n[l]++; probe.sum[l] += y; probe.sq[l] += y * y; if (y > probe.hi[l]) probe.hi[l] = y; if (y < probe.lo[l]) probe.lo[l] = y; }
    const drag = this.lineDrag[l]!;
    if (drag > 0) y /= 1 + drag * Math.abs(y);
    const n = this.n;
    const i = base + (n & mask);
    const previous = base + ((n - 1) & mask);
    w[i] = y;
    const total = n === 0 ? 0 : sum[previous]! + 0.5 * (w[previous]! + y);
    sum[i] = total;
    let head = this.lineHead[l]!;
    let tail = this.lineTail[l]!;
    let enters = -Infinity;
    while (tail > head) {
      const last = base + ((tail - 1) & mask);
      const b = at[last]!;
      const apart = n - b;
      const fallen = -k * (total - sum[base + (b & mask)]!);
      enters = (apart === 1 ? fallen : fallen / apart) + 0.5 * (n + b);
      if (tail - head > 1 && enters <= from[last]!) tail--;
      else break;
    }
    if (tail - head > mask) head++;
    at[base + (tail & mask)] = n;
    from[base + (tail & mask)] = enters;
    this.lineHead[l] = head;
    this.lineTail[l] = tail + 1;
  }
  /**
   * A junction finds its pressure P within the sample: the one at which what `entering` (a volume) and its ends'
   * flows, each by the law, bring in over the sample is nothing, for it holds nothing.
   */
  private settleJunction(j: number, entering: number): void {
    const { endArea, endArriving, endFlow, endHeadIn, endHeadOut } = this;
    const first = this.endFirst[j]!;
    const beyond = this.endFirst[j + 1]!;
    const woolArea = this.woolArea[j]!;
    if (entering === 0 && beyond - first === 2 && woolArea === 0) {
      // Two ends: what one end brings the other takes, and the two laws make one quadratic.
      const forth = endArriving[first]! >= endArriving[first + 1]!;
      const from = forth ? first : first + 1;
      const to = forth ? first + 1 : first;
      const ratio = endArea[from]! / endArea[to]!;
      const K = endHeadIn[from]! + ratio * ratio * endHeadOut[to]!;
      const b = 1 + ratio;
      const d = 2 * (endArriving[from]! - endArriving[to]!);
      const m = Math.abs(K) > 1e-9 ? (-b + Math.sqrt(Math.max(0, b * b + 2 * K * d))) / K : d / b;
      endFlow[from] = m;
      endFlow[to] = -ratio * m;
      return;
    }
    // What is left over falls as P rises, so Newton's step, kept between the pressures already known to be too low
    // and too high, finds it.
    const perSample = (Math.PI * ACOUSTICS.waveSpeed) / (4 * this.rate);
    let P = this.junctionPressure[j]!;
    let low = -Infinity;
    let high = Infinity;
    let taken = 0;
    for (let round = 0; round < 60; round++) {
      let brought = 0;
      let slope = 0;
      for (let e = first; e < beyond; e++) {
        const d = 2 * endArriving[e]! - P;
        const size = d >= 0 ? d : -d;
        const K = d >= 0 ? endHeadIn[e]! : endHeadOut[e]!;
        const m = K > 1e-9 || K < -1e-9 ? (-1 + Math.sqrt(Math.max(0, 1 + 2 * K * size))) / K : size;
        const give = 1 / Math.max(1e-3, 1 + K * m);
        const flow = d >= 0 ? m : -m;
        endFlow[e] = flow;
        brought += perSample * endArea[e]! * flow;
        slope += perSample * endArea[e]! * give;
      }
      if (woolArea > 0) {
        // The wool's space: its pressure after this sample is its pressure before plus what it takes, over its volume.
        const apart = P - this.woolPressure[j]!;
        const size = apart >= 0 ? apart : -apart;
        const r = this.woolR[j]! + (perSample * woolArea) / this.woolVolume[j]!;
        const K = this.woolK[j]!;
        const u = K > 1e-9 ? (-r + Math.sqrt(r * r + 2 * K * size)) / K : size / r;
        taken = perSample * woolArea * (apart >= 0 ? u : -u);
        brought -= taken;
        slope += (perSample * woolArea) / (r + K * u);
      }
      const left = entering + brought;
      if (left > 0) low = P;
      else high = P;
      let next = P + left / slope;
      if (!(next > low && next < high)) {
        const reach = Math.max(1e-6, 2 * Math.abs(left / slope));
        next = low === -Infinity ? P - reach : high === Infinity ? P + reach : 0.5 * (low + high);
      }
      const moved = Math.abs(next - P);
      P = next;
      // Within TOLERANCE of the pressure, the flows just found are the flows.
      if (moved < TOLERANCE) break;
    }
    this.junctionPressure[j] = P;
    if (woolArea > 0) this.woolPressure[j]! += taken / this.woolVolume[j]!;
  }
  /**
   * A cylinder finds its pressure within the sample the same way, with one end, its valve of `throat`, and the gas it
   * holds: within the sample the gas fills the volume along the tangent of fill = (1 + gamma P)^(1 / gamma) at the
   * pressure it starts from. Its gas is density * fill as dense as its tube's, and `density` as dense once it is out:
   * the law is one of mass, and what the tube carries is volume. It returns the flow from the tube into the cylinder.
   */
  private settleCylinder(i: number, volume: number, throat: number, arriving: number): number {
    const { gamma, choked } = GAS;
    const density = this.density[i]!;
    const area = this.valveArea[i]!;
    const perSample = (Math.PI * ACOUSTICS.waveSpeed) / (4 * this.rate);
    const held = this.gas[i]!;
    const fillStart = held / volume;
    const full = fillStart ** gamma;
    const fillSlope = fillStart / full;
    const pressureStart = (full - 1) / gamma;
    let P = pressureStart;
    let low = pressureStart - (0.5 / fillSlope) * fillStart;
    let high = Infinity;
    let brought = 0;
    let flow = 0;
    for (let round = 0; round < 60; round++) {
      const fill = fillStart + fillSlope * (P - pressureStart);
      const q = fill / density;
      const d = 2 * arriving - P;
      const size = d >= 0 ? d : -d;
      const K = endHead(throat, 0, q, d >= 0);
      let m = K > 1e-9 || K < -1e-9 ? (-1 + Math.sqrt(Math.max(0, 1 + 2 * K * size))) / K : size;
      let give = 1 / Math.max(1e-3, 1 + K * m);
      // A valve's flow is not faster than sound in its throat.
      const most = d >= 0 ? choked * throat : choked * throat * Math.sqrt((fill * (1 + gamma * P)) / density);
      if (m > most) {
        m = most;
        give = 0;
      }
      flow = d >= 0 ? m : -m;
      brought = 0;
      brought += perSample * area * flow;
      const slope = volume * fillSlope + perSample * area * give;
      const left = held + brought - volume * fill;
      if (left > 0) low = P;
      else high = P;
      let next = P + left / slope;
      if (!(next > low && next < high)) {
        const reach = Math.max(1e-6, 2 * Math.abs(left / slope));
        next = high === Infinity ? P + reach : 0.5 * (low + high);
      }
      const moved = Math.abs(next - P);
      P = next;
      if (moved < TOLERANCE) break;
    }
    // A cylinder keeps what it held and what its valve brought.
    this.gas[i] = Math.max(held + brought, 1e-9 * volume);
    return flow;
  }
  /** `burns`: false while the fuel is cut, and the cylinders let out the air they drew. */
  render(out: Float64Array, offset: number, count: number, rpm: ArrayLike<number>, opening: ArrayLike<number>, burns = true): void {
    const { sound, rate, engine, listening, mouth, outlet, follow, swelling, endFirst, endRead, endWrite, endArriving, endFlow, valveArriving, valveFlow, gas, density, unburned, burning } = this;
    // Trial (2026-11-22, K): the real valve's diameter and opening each take one factor, the same for every vehicle.
    const { primaries, pipes } = sound.exhaust;
    // Only an engine of valves on cams (a cycle of two revolutions) takes them: a port's size and timing are the engine's own.
    const cams = sound.cycleRevolutions === 2 || sound.exhaust.factorsAnyway === true;
    const valve = cams ? { diameter: VALVE.diameter * sound.exhaust.valve.diameter, open: Math.min(1, VALVE.open * sound.exhaust.valve.open) } : sound.exhaust.valve;
    const { gamma } = GAS;
    const cylinders = primaries.length;
    const junctions = swelling.length;
    const ends = endRead.length;
    const clearance = engine.sweptVolume / (engine.compressionRatio - 1);
    // A valve's opening is centred: a four-stroke's on the middle of the exhaust stroke, a two-stroke's port on bottom
    // dead centre.
    const centre = sound.cycleRevolutions === 2 ? 1.5 * Math.PI : Math.PI;
    const turn = sound.cycleRevolutions * 2 * Math.PI;
    for (let k = 0; k < count; k++) {
      this.rpm += this.smoothing * (rpm[k]! - this.rpm);
      this.opening += this.smoothing * (opening[k]! - this.opening);
      const step = this.rpm / (60 * sound.cycleRevolutions * rate);
      const previous = this.phase;
      const phase = (previous + step) % 1;
      this.phase = phase;
      const charge = GAS.closedCharge + (1 - GAS.closedCharge) * this.opening;

      // 1. Junctions: spaces with no volume. Gas burning at one (an afterfire) enters it as that gas's swelling.
      if (burning.length > 0) {
        swelling.fill(0);
        for (let b = burning.length - 1; b >= 0; b--) {
          const burn = burning[b]!;
          const span = listening.afterfireSeconds * rate;
          swelling[burn.junction]! += (burn.volume * (1 - Math.cos((2 * Math.PI * (burn.elapsed + 0.5)) / span))) / span;
          if (++burn.elapsed >= span) burning.splice(b, 1);
        }
        for (let e = 0; e < ends; e++) endArriving[e] = this.read(endRead[e]!);
        for (let j = 0; j < junctions; j++) this.settleJunction(j, swelling[j]!);
      } else {
        for (let e = 0; e < ends; e++) endArriving[e] = this.read(endRead[e]!);
        for (let j = 0; j < junctions; j++) this.settleJunction(j, 0);
      }

      // 2. Mouths. The outside is a space of sigma = 0 whose pressure at the mouth is P = w_in - lowpass(w_in), the
      //    corner at ka = 1 (c / (2 pi a)). What is heard is that pressure, times the mouth's diameter.
      let heard = 0;
      for (let j = 0; j < pipes.length; j++) {
        if (pipes[j].to !== null) continue;
        const outgoing = this.read(2 * cylinders + j);
        outlet[j]! += follow[j]! * (outgoing - outlet[j]!);
        mouth[j] = outgoing - endFlow_(outgoing + outlet[j]!);
        heard += pipes[j].diameter * (outgoing - outlet[j]!);
      }

      // 3. Cylinders: spaces whose volume the piston moves, each with one end, its valve the end's throat.
      for (let i = 0; i < cylinders; i++) {
        const opens = sound.firingPhases[i];
        const crossed = phase >= previous ? opens > previous && opens <= phase : opens > previous || opens <= phase;
        let since = phase - opens + 1;
        if (since >= 1) since -= 1;
        const angle = centre + (since - valve.open / 2) * turn;
        // The volume matters only as the valve opens and while it is open.
        const volume = crossed || since < valve.open ? clearance + (engine.sweptVolume * (1 - Math.cos(angle))) / 2 : 0;
        if (crossed) {
          let varied = charge;
          if (listening.chargeVariation > 0) {
            this.chargeSeed = this.draw(this.chargeSeed);
            varied += listening.chargeVariation * (this.chargeSeed / 2147483648);
          }
          varied = Math.max(1e-3, varied);
          // The charge burns in its cylinder; or, an afterfire, in the pipe; or, its fuel cut, nowhere.
          const inPipe = burns && this.afterfiring;
          this.afterfiring = false;
          // Burning, the charge would have stood at burnedKelvin at this opening, having cooled as it swelled from the
          // clearance: so much hotter it was at top dead centre. The same heat, given at the junction's steady
          // pressure, warms it 1 / gamma as much, and it swells by that over its own temperature.
          if (inPipe) unburned[i] = (varied * engine.sweptVolume * (GAS.burnedKelvin - GAS.intakeKelvin) * (volume / clearance) ** (gamma - 1)) / (gamma * GAS.intakeKelvin);
          // A charge that does not burn in its cylinder leaves at the intake's temperature.
          const kelvin = burns && !inPipe ? GAS.burnedKelvin : GAS.intakeKelvin;
          const opened = (varied * (kelvin / GAS.intakeKelvin) * engine.sweptVolume) / volume;
          gas[i] = volume * opened ** (1 / gamma);
          density[i] = (GAS.pipeKelvin / kelvin) * opened ** ((gamma - 1) / gamma);
        }
        const arriving = this.read(cylinders + i);
        valveArriving[i] = arriving;
        valveFlow[i] = 0;
        if (since < valve.open) {
          const position = since / valve.open;
          const lift = position * (1 - position);
          const throat = Math.min(1, GAS.discharge * (valve.diameter / primaries[i].diameter) ** 2 * 16 * lift * lift);
          if (throat > 0) valveFlow[i] = this.settleCylinder(i, volume, throat, arriving);
        } else if (unburned[i]! > 0) {
          burning.push({ junction: primaries[i].to, volume: unburned[i]!, elapsed: 0 });
          unburned[i] = 0;
        }
      }

      // 4. Send every wave.
      for (let i = 0; i < cylinders; i++) this.write(i, valveArriving[i]! - valveFlow[i]!);
      for (let e = 0; e < ends; e++) this.write(endWrite[e]!, endArriving[e]! - endFlow[e]!);
      for (let j = 0; j < pipes.length; j++) if (pipes[j].to === null) this.write(2 * cylinders + pipes.length + j, mouth[j]!);
      this.n++;
      out[offset + k] = heard;
    }
  }
}
/** A mouth's flow: the law with no throat, into the outside. */
function endFlow_(d: number): number {
  return endFlow(d, 1, 0, 1);
}
