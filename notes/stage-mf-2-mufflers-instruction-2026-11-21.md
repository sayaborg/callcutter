【Stage MF-2:XR600R、NSR500、959、F40 の音の定義に消音器を入れ、タービンの書き方を 1 つにする(RX-7 TURBO II も合わせる)】

監査役(Claude)が書いた(2026-11-21)。K が実装者にそのまま渡す。
段階の名前 `MF` は監査役の案で、K はまだ決めていない。MF-1(TESTAROSSA、RX-7 TURBO II、928 S4)の続き。

K の決定(2026-11-21。空ぶかしのページで聴いて決めた)

- **タービンは、どの車も同じ 2 本の管で書く。** 実車の喉の太さの管(長さ 0.08 m)と、そのすぐ後ろの小部屋(0.10 m × 150 mm)。
  喉を出た流れが広い部屋で動圧を失う形で、羽根車が持って行く分に当たる。式も欄も足さない。ツインターボは 1 個ずつに 1 組。
- この書き方を、959、F40、RX-7 TURBO II に入れる。**RX-7 TURBO II は MF-1 の形から変わる**(小部屋が 1 本増える。ほかは MF-1 のまま)。
- XR600R、NSR500、959、F40 は、下の形で「とりあえず確定」。最後は、ゲームの中で走らせて K が決める。
- NSR500 の点火の間隔を、90 度の等間隔に直す(今の 112 度ずらしは誤りだった)。
- MF-1 の決まり(消音器は太い管、長さは実車に寄せて太さは耳、同じ枝は 1 本にまとめる、資料のある太さは資料の値)は、そのまま。

始める時:Stage ES が入った今の main から。MF-1 がまだ入っていなければ、MF-1 と一緒に入れてよい(RX-7 TURBO II は、この文書の形を使う)。
`pipes` は 4 本、16 本、10 本、10 本、8 本。ES で上がった上限(32 本)に収まる。

---

## 1. 変える物

5 つの音の定義(`content/engine-sounds/`)の `exhaust.primaries`、`exhaust.pipes`、`metadata.note`。NSR500 だけ `firingPhases` も。

- `format`、`version`、`cycleRevolutions`、`exhaust.valve` は変えない。NSR500 のほかは `firingPhases` も変えない。
- ほかの車の音の定義は 1 バイトも変えない。ターボのほかの車(DELTA、911 TURBO、GTO、TURBO ESPRIT、MP4/4)は、まだ今のまま。
- 形式、解き手、カーネルは変えない。

### 1.1 `XR600R_1985.json`

```json
"primaries": [
  { "length": 0.42, "diameter": 0.0365, "to": 0 }
],
"pipes": [
  { "length": 0.18, "diameter": 0.152, "from": 0, "to": 1 },
  { "length": 0.16, "diameter": 0.04, "from": 1, "to": 2 },
  { "length": 0.44, "diameter": 0.131, "from": 2, "to": 3 },
  { "length": 0.12, "diameter": 0.04, "from": 3, "to": null }
]
```

- 今との違い:一次管(2 本のヘッドパイプを 1 本にまとめた物)を 0.60 m × 49.5 mm → 0.42 m × 36.5 mm に。
  合流後の 0.95 m × 45 mm の管を、膨張室(0.18 m × 152 mm)、つなぎ(0.16 m × 40 mm)、消音器の箱(0.44 m × 131 mm)に。
  出口を 0.10 m × 28 mm → 0.12 m × 40 mm に(絞らない)。ポートから出口まで 1.32 m。
- 一次管のすぐ後ろの膨張室は、実車に無い。K が耳で入れた。
- `metadata.note`(弁の文は、今の注記の「Valve: …」から後ろをそのまま残す。その前を次に置き換える):

```text
The radial four-valve head's two exhaust ports and their two head pipes, round the front of the engine to their join, written as one tube of their combined area: two of about 26 mm inside (1 1/8 in outside and a little under 1/16 in of wall, an owner's measurement of the XR650L's stock header, which an owners' forum says shares the XR600R's small primaries; whether it holds for the 1985 header, part 18320-MK2-670, is not confirmed). The joined pipe is 40 mm inside (1 11/16 in outside, the same measurement). Between the head pipes and the joined pipe stands an expansion chamber the motorcycle does not have (K, 2026-11-21, by ear). The silencer on the right is a wide pipe, and its outlet is as wide as the joined pipe: a narrower outlet sharpened the report and raised the closed-throttle drone. The whole run, 1.32 m, is an estimate from the wheelbase and the engine's place. All lengths are estimates; the chamber's and the silencer's widths were set by ear.
```

### 1.2 `NSR500_1987.json`

```json
"firingPhases": [0, 0.25, 0.5, 0.75],
"primaries": [
  { "length": 0.2, "diameter": 0.038, "to": 0 },
  { "length": 0.2, "diameter": 0.038, "to": 1 },
  { "length": 0.2, "diameter": 0.038, "to": 2 },
  { "length": 0.2, "diameter": 0.038, "to": 3 }
],
"pipes": [
  { "length": 0.45, "diameter": 0.083, "from": 0, "to": 4 },
  { "length": 0.49, "diameter": 0.088, "from": 1, "to": 5 },
  { "length": 0.45, "diameter": 0.083, "from": 2, "to": 6 },
  { "length": 0.49, "diameter": 0.088, "from": 3, "to": 7 },
  { "length": 0.18, "diameter": 0.024, "from": 4, "to": 8 },
  { "length": 0.18, "diameter": 0.024, "from": 5, "to": 9 },
  { "length": 0.18, "diameter": 0.024, "from": 6, "to": 10 },
  { "length": 0.18, "diameter": 0.024, "from": 7, "to": 11 },
  { "length": 0.26, "diameter": 0.065, "from": 8, "to": 12 },
  { "length": 0.26, "diameter": 0.065, "from": 9, "to": 13 },
  { "length": 0.26, "diameter": 0.065, "from": 10, "to": 14 },
  { "length": 0.26, "diameter": 0.065, "from": 11, "to": 15 },
  { "length": 0.12, "diameter": 0.024, "from": 12, "to": null },
  { "length": 0.12, "diameter": 0.024, "from": 13, "to": null },
  { "length": 0.12, "diameter": 0.024, "from": 14, "to": null },
  { "length": 0.12, "diameter": 0.024, "from": 15, "to": null }
]
```

- 今との違い:点火を 0・112・180・292 度 → 0・90・180・270 度に。一次管(ヘッダー)を 0.48〜0.66 m × 32 mm → 4 本とも 0.20 m × 38 mm に。
  チャンバーを 0.30 m × 70 mm → 後ろのバンク(点火 0 と 0.5 の 2 本)0.45 m × 83 mm、前のバンク 0.49 m × 88 mm に。
  スティンガー 0.28 m × 20 mm を、スティンガー(0.18 m × 24 mm)、サイレンサー(0.26 m × 65 mm)、出口(0.12 m × 24 mm)に。
- 4 本は合流しない。前後のバンクでチャンバーを少し変えたのは K の決定(4 本とも同じだと、整いすぎた音になる)。
- `metadata.note`(全部を次に置き換える):

```text
112-degree single-crank V4 firing one cylinder every 90 degrees: the NSR500 fired at even 90-degree intervals until the 180-degree paired engine of 1990 (Japanese and English histories of the machine agree; a 1988 magazine's "180-degree intervals" is not followed). The banks are taken to alternate, each bank's two cylinders half a turn apart (not confirmed). One cycle per revolution. Four independent pipes, each a header, an expansion chamber, a stinger, a silencer and an outlet. The rear bank's two (firing at 0 and 0.5; from 1987 they exhaust rearward) and the front bank's two differ a little in their chambers' length and volume (K, 2026-11-21: four alike sounded too even). The chambers are straight wide pipes: header and chamber together are the tuned length for 13,000 rpm and 200 degrees of port, about 0.67 m, and the chambers' volume started from the real shape's (cones from 38 mm to 100 mm, Honda's figure for the 1985 machine's widest, and back to the stinger); their widths and the silencers' were then set by ear. Port area approximated by a 28 mm equivalent circle, 200 degrees open. Every length and diameter is an estimate.
```

### 1.3 `PORSCHE_959_1987.json`

```json
"primaries": [
  { "length": 0.47, "diameter": 0.038, "to": 0 },
  { "length": 0.23, "diameter": 0.038, "to": 1 },
  { "length": 0.35, "diameter": 0.038, "to": 0 },
  { "length": 0.47, "diameter": 0.038, "to": 1 },
  { "length": 0.23, "diameter": 0.038, "to": 0 },
  { "length": 0.35, "diameter": 0.038, "to": 1 }
],
"pipes": [
  { "length": 0.08, "diameter": 0.0276, "from": 0, "to": 8 },
  { "length": 0.1, "diameter": 0.15, "from": 8, "to": 2 },
  { "length": 0.08, "diameter": 0.0276, "from": 1, "to": 9 },
  { "length": 0.1, "diameter": 0.15, "from": 9, "to": 3 },
  { "length": 0.52, "diameter": 0.056, "from": 2, "to": 4 },
  { "length": 0.62, "diameter": 0.056, "from": 3, "to": 4 },
  { "length": 0.46, "diameter": 0.25, "from": 4, "to": 5 },
  { "length": 0.35, "diameter": 0.07, "from": 5, "to": 6 },
  { "length": 0.28, "diameter": 0.21, "from": 6, "to": 7 },
  { "length": 0.3, "diameter": 0.079, "from": 7, "to": null }
]
```

- 今との違い:一次管を等長 0.35 m → バンクごとに 0.47・0.35・0.23 m に。**渡りの管(0.8 m × 45 mm)を書かない。**
  タービンを共通の形に(喉 27.6 mm はそのまま。小部屋が左右に 1 本ずつ増える)。タービンから消音器までを 0.50 m ずつ → 0.52 m と 0.62 m に。
  消音器の胴(0.6 m × 56 mm の 2 本)を、前の室(0.46 m × 250 mm)、つなぎ(0.35 m × 70 mm)、後ろの室(0.28 m × 210 mm)に。
  テール 2 本を、断面積を合わせた 1 本(79 mm)に。
- 渡りの管は実車にある。K が聴いて、書かない方を選んだ(入れると雑音が勝つ)。
- `metadata.note`:今の注記のうち、配置の文(「Two 3-into-1 manifolds …」から「… (not confirmed).」まで)の中の渡りの管と消音器の所、
  「Primary, cross-tube and pipe lengths …」の文、「Silencer bodies …」の文を、次に置き換える。部品表の出どころの文と「Valve: …」の文は残す。

```text
Two 3-into-1 manifolds, one per bank (cylinders 1-3 left, 4-6 right; firing 1-6-2-4-3-5 alternates the banks), their primaries unequal (0.47, 0.35 and 0.23 m are estimates). The car's cross tube, which takes the right bank's exhaust to the left turbine, is not written: with it the sound was noise (K, 2026-11-21, by ear), so each bank feeds its own turbine. The left and right KKK K26 turbines (housing size 6, 6 cm2: 27.6 mm) are written in the one form of every turbine here: the throat, 0.08 m long, and a room 0.10 m long and 150 mm wide after it, where the throat's stream loses its head as it does to the wheel. A 56 mm pipe from each turbine (0.52 and 0.62 m, estimates) into the one silencer, written as two rooms joined by a 70 mm pipe (the division is this model's; no dimension of the silencer was found); its two outlets (56 mm, not confirmed) are written as one of their combined area. No catalyst. Lengths are estimates; the silencer's widths were set by ear.
```

### 1.4 `FERRARI_F40_1988.json`

```json
"primaries": [
  { "length": 0.47, "diameter": 0.035, "to": 0 },
  { "length": 0.47, "diameter": 0.035, "to": 1 },
  { "length": 0.29, "diameter": 0.035, "to": 0 },
  { "length": 0.29, "diameter": 0.035, "to": 1 },
  { "length": 0.2, "diameter": 0.035, "to": 0 },
  { "length": 0.2, "diameter": 0.035, "to": 1 },
  { "length": 0.38, "diameter": 0.035, "to": 0 },
  { "length": 0.38, "diameter": 0.035, "to": 1 }
],
"pipes": [
  { "length": 0.08, "diameter": 0.0276, "from": 0, "to": 8 },
  { "length": 0.1, "diameter": 0.15, "from": 8, "to": 2 },
  { "length": 0.08, "diameter": 0.0276, "from": 1, "to": 9 },
  { "length": 0.1, "diameter": 0.15, "from": 9, "to": 3 },
  { "length": 0.42, "diameter": 0.054, "from": 2, "to": 4 },
  { "length": 0.42, "diameter": 0.054, "from": 3, "to": 4 },
  { "length": 0.5, "diameter": 0.22, "from": 4, "to": 5 },
  { "length": 0.34, "diameter": 0.07, "from": 5, "to": 6 },
  { "length": 0.26, "diameter": 0.21, "from": 6, "to": 7 },
  { "length": 0.32, "diameter": 0.076, "from": 7, "to": null }
]
```

- 今との違い:一次管を等長 0.35 m → バンクごとに 0.47・0.29・0.20・0.38 m に(点火の順に並べた値。タービンに近い筒ほど短い)。
  **渡りの管(0.6 m × 38 mm)を書かない**(959 と同じ扱い)。タービンを共通の形に(喉 27.6 mm はそのまま)。
  タービンから消音器までを 0.40 m → 0.42 m に。消音器の胴(0.6 m × 54 mm の 2 本)を、前の室(0.50 m × 220 mm)、つなぎ(0.34 m × 70 mm)、
  後ろの室(0.26 m × 210 mm)に。外側の出口 2 本を、断面積を合わせた 1 本(76 mm)に。
- `metadata.note`:今の注記のうち、渡りの管の所(「the pipe between the manifolds (part 122561) joins the banks before the turbines and is always open」)、
  「Primary, crossover and pipe lengths …」の文、「Silencer bodies are straight pipes of their inlet diameter;」の所を、次に置き換える。ほかの文は残す。

```text
The manifolds' primaries are unequal (0.47, 0.29, 0.20 and 0.38 m in each bank's firing order, the turbine behind the bank; estimates). The pipe between the manifolds (part 122561) is not written, as the 959's cross tube is not (K, 2026-11-21). Each turbine is written in the one form of every turbine here: its throat, 0.08 m long, and a room 0.10 m long and 150 mm wide after it. The one silencer is written as two rooms joined by a 70 mm pipe (the division is this model's; no dimension of the silencer was found), about ten times the displacement in all; its two outer outlets are written as one of their combined area. Lengths are estimates; the silencer's widths were set by ear.
```

### 1.5 `RX_7_TURBO_II_1987.json`(MF-1 の形から、小部屋を 1 本足す)

`primaries` は MF-1 のまま。

```json
"pipes": [
  { "length": 0.08, "diameter": 0.044, "from": 0, "to": 7 },
  { "length": 0.1, "diameter": 0.15, "from": 7, "to": 1 },
  { "length": 0.9, "diameter": 0.054, "from": 1, "to": 2 },
  { "length": 0.35, "diameter": 0.13, "from": 2, "to": 3 },
  { "length": 0.75, "diameter": 0.054, "from": 3, "to": 4 },
  { "length": 0.55, "diameter": 0.068, "from": 4, "to": 5 },
  { "length": 0.45, "diameter": 0.27, "from": 5, "to": 6 },
  { "length": 0.2, "diameter": 0.068, "from": 6, "to": null }
]
```

- MF-1 との違い:タービンの喉(0.08 m × 44 mm)の後ろに小部屋(0.10 m × 150 mm)。継ぎ目の番号がそこで 1 つ増える(喉は 0 → 7、小部屋は 7 → 1)。ほかは同じ。
- `metadata.note`:MF-1 の注記の「… both open; 0.08 m is an estimate.」の後ろに、次の文を足す。

```text
After the throat stands a room 0.10 m long and 150 mm wide, where the throat's stream loses its head as it does to the wheel: the one form of every turbine here (K, 2026-11-21).
```

## 2. 決まりの文書

`docs/calibration.md` の「Exhaust topologies」:

- 足す決まり:**タービンは、実車の喉の太さで長さ 0.08 m の管と、そのすぐ後ろの長さ 0.10 m・太さ 150 mm の管の 2 本で書く。どの車も同じ長さと同じ小部屋。
  まだ書き直していない車は、今までどおり喉だけ。**
- 5 台の行を、1. の値に書き直す。NSR500 の点火の間隔も。
- 959 と F40 の台帳(`docs/chase-turbo-vehicles.md` など)と、`docs/racing-vehicles.md` の NSR500 に排気や点火の値を書いている所があれば、合わせる。

`docs/NEXT.md`:Stage MF の節に、3. の中身を足す。

## 3. 決まっていない事(`docs/NEXT.md` に書く)

- 5 台とも「とりあえず確定」。K は空ぶかしのページで聴いた。ゲームの中で走らせて、もう一度決める。
- 小部屋の 0.10 m × 150 mm は、耳で決めた 1 つの値。実物の羽根車の部屋(見積もりで 0.3 L 前後)より大きい。羽根車そのものは、モデルに無い。
- 959 と F40 の渡りの管は、実車にあるが書いていない。
- XR600R の一次管の後ろの膨張室は、実車に無い。出口の太さは、1985 年式のバッフルの径が分からなかったので、絞らない形にした。
- NSR500 は、どちらのバンクが先に点火するかの資料が無い。12 kHz と 6 kHz(ライバル)では、高域が大きく落ちる(耳で確かめていない)。
- RX-7 TURBO II は、小部屋を足しただけで、箱は MF-1 のまま。高域がほかのターボ車より低い(K は「これでいい」)。
- ターボの残りの車(DELTA、911 TURBO、GTO、TURBO ESPRIT、MP4/4)は、まだ喉だけ。

## 4. 確かめと報告

- 5 台の音の定義が、今の読み手(`compileEngineSound`)を通る事。継ぎ目の番号は 0 から詰めてある。
- 音の大きさ(`content/engine-loudness/`)を、今の手順で測り直す。前と後を報告する。
- ENGINE SOUND QUALITY の 3 段階(自車とライバルの速さ)で、5 台とも壊れない事。
- 重さの目安(監査役の作業場、24 kHz、1 コアに対して):XR600R 2%、NSR500 9%、959 9%、F40 11%、RX-7 TURBO II 6%。
- 1 行目は、K が変更を見られる所。
- この 5 台を使うシリーズのコースの測り直しは要らない(音だけの変更)。
