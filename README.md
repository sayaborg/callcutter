# CALL CUTTER

A cutting-call simulator: play a motorcycle's throttle as an instrument.

CALL CUTTER simulates cutting calls (コール切り), the Japanese art of revving a motorcycle in rhythm. The engine and
its exhaust are computed, not recorded.

**Status: the kernel's package.** This repository holds the exhaust kernel, its engines and everything known about
them, cut loose from the game it was made for ([SUPER OUTRIDE](https://github.com/sayaborg/superoutride), main
`45f943c`, 2026-11-24). The game went on with a lighter kernel; this one was kept whole for this simulator, which is
still to be built. What plays today is a free-rev page: one engine, its throttle under a finger.

## Run

Node 24.

```
npm install
npm test        # the types, then the kernel against the game's saved values
npm run page    # builds page/index.html, one file, and plays it once in Node
```

Open `page/index.html` in a browser: press the pad, move up and down. Space is full throttle; 1 to 9 are 10 to 90 %.

The saved values (`tests/exhaust-render.values.json`) are the game's own, and the kernel meets them within the game's
tolerance (1e-9 of a sound's peak) on Node 24. On Node 22 the last digits of some sounds differ (as far as 4e-7), and
the test fails: the kernel's arithmetic is the same, the engine's `Math` is not.

## The model, briefly

The exhaust is a net of **tubes** and of the **spaces** their ends open into.

- A tube carries two waves. A higher wave travels faster, so waves steepen into shocks as they go: the crack of an
  exhaust is made in the tube, not added.
- A space holds gas in a volume. A junction is a space with no volume; a cylinder is a space whose volume its piston
  moves, behind its valve; the outside is the one space that is heard.
- One law holds at every tube's end: a narrowing stream keeps its total pressure, a widening one keeps its momentum
  and loses the head of the difference.
- A silencer is a wide tube (a box), a turbine a short narrow one; wool lining a pipe takes loss alone.
- Two values were chosen by listening: how far one charge varies from the next (3 %), and how long an afterfire burns
  (1.5 ms). The rest are physical assumptions.

The kernel is one model at every rate: it runs at the output's rate over 1, 2, 4 or 8 and is brought back up by
doubling. The game played its own car at 24 kHz.

The full account is the game's: [origin/docs/audio.md](origin/docs/audio.md) (Engine synthesis, Derived values, Engine
chain, Engine loudness) and [origin/docs/calibration.md](origin/docs/calibration.md).

## What is here

| | |
| --- | --- |
| `src/` | The kernel, made to stand alone. `exhaust-waveguide.ts` and `exhaust-acoustics.ts` (the kernel and its gas, wall loss and wool), `engine-chain.ts` (compressor, gain, soft clip) and `vehicle-engine-sound.ts` are the game's files unchanged. `exhaust-rate.ts` keeps the renderer and its doubler and drops the game's other kernel and its quality settings; `engine-sound.ts` carries its own error class. |
| `engines/sounds/` | The 34 engine sounds, as the game had them: valve, primaries, pipes with their diameters, boxes and wool, and each one's authoring notes (`metadata`). |
| `engines/vehicles.json` | The game's 37 vehicles: which sound each plays, what the sound reads of its engine, and its measured loudness (LUFS of its compressed sound at each rate, 48, 24, 12 and 6 kHz). |
| `tests/` | The game's two tests of this kernel, reading the engines here, and the game's saved values. |
| `page/` | The free-rev page: `sim.ts` (a stand-in engine, the kernel, the chain), `page.html`, `build.mjs`, `check.mjs`. |
| `origin/` | The game's files that touch this kernel and were not made to run here, at their paths, unchanged: the worklet and its voice, the document reader, the loudness tool and ledger, the original tests, the two documents. Also the engines' sources as the game recorded them (from its main `f196885`): the three vehicle documents (`docs/chase-turbo-vehicles.md`, `docs/racing-vehicles.md`, `docs/road-bikes.md`) and their numeric ledgers, whose `sound.exhaust.*` rows give each primary's and pipe's source. And one engine sound the game gained after the copy, as first written (`content/engine-sounds/VOLKSWAGEN_BEETLE_1500_1968.json`, from `dffe8e0`); it is not among `engines/`. |
| `workshop/` | The listening workshop the kernel was designed in, as it stood (Claude's, 2026-11-20 to 11-22): the reference kernel the game's was written from (`kernel.ts`), the drive and measures, and the mufflers' candidates. It names absolute paths and does not run here. |
| `notes/` | The mufflers' rules and each car's instruction, in Japanese, as written for the game's implementer. |

The kernel's design history (the research memos, the reference kernel's five forms, the design written down) lives
in the SUPER OUTRIDE project's documents and is not copied here; `notes/README.md` names them.

## 日本語

コール切りのシミュレーターです。エンジンと排気は録音ではなく計算です。今あるのは、SUPER OUTRIDE(main `45f943c`)から切り出したエンジン音のカーネルと、その全部の情報、そして空ぶかしのページです。シミュレーター本体は、これから作ります。
