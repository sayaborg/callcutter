【Stage MF-1:TESTAROSSA、RX-7 TURBO II、928 S4 の音の定義に、消音器を入れる】

監査役(Claude)が書いた(2026-11-21)。K が実装者にそのまま渡す。
段階の名前 `MF` は監査役の案で、K はまだ決めていない。

K の決定(2026-11-21。空ぶかしのページで聴いて決めた)

- 消音器は、絞りでも別の欄でもなく、**実車の箱を「太い管」として `pipes` に書く**。式も欄も足さない。
- 箱は 1 車種ずつ決める。この 3 台は、下の形で「とりあえず確定」。最後は、ゲームの中で走らせて K が決める。
- 箱の長さは実車に寄せ(資料が無ければ推定)、太さを耳で決める。
- 長さも太さも同じ管が同じ所から分かれて、どちらも外へ開く時は、断面積を合わせた 1 本に書く(太さを √2 倍)。
- 一次管、タービンの喉、管の太さは、資料があれば資料の値にする。

始める時:**Stage ES が main に入った後**の main から。Node 24。
この 3 台の `pipes` は 12 本、7 本、12 本で、今の上限(16 本)にも収まる。音は ES のカーネルで決めた物なので、ES より前に入れない。

---

## 1. 変える物

3 つの音の定義(`content/engine-sounds/`)の `exhaust.primaries`、`exhaust.pipes`、`metadata.note` だけ。

- `format`、`version`、`cycleRevolutions`、`firingPhases`、`exhaust.valve` は変えない。
- ほかの車の音の定義は 1 バイトも変えない。`PORSCHE_959_1987` も変えない(まだ決まっていない)。
- 形式、解き手、カーネルは変えない。

### 1.1 `TESTAROSSA.json`

```json
"primaries": [
  { "length": 0.5, "diameter": 0.0355, "to": 0 },
  { "length": 0.5, "diameter": 0.0355, "to": 1 },
  { "length": 0.5, "diameter": 0.0355, "to": 2 },
  { "length": 0.5, "diameter": 0.0355, "to": 3 },
  { "length": 0.5, "diameter": 0.0355, "to": 0 },
  { "length": 0.5, "diameter": 0.0355, "to": 1 },
  { "length": 0.5, "diameter": 0.0355, "to": 2 },
  { "length": 0.5, "diameter": 0.0355, "to": 3 },
  { "length": 0.5, "diameter": 0.0355, "to": 0 },
  { "length": 0.5, "diameter": 0.0355, "to": 1 },
  { "length": 0.5, "diameter": 0.0355, "to": 2 },
  { "length": 0.5, "diameter": 0.0355, "to": 3 }
],
"pipes": [
  { "length": 0.5, "diameter": 0.047, "from": 0, "to": 4 },
  { "length": 0.22, "diameter": 0.047, "from": 2, "to": 4 },
  { "length": 0.5, "diameter": 0.047, "from": 1, "to": 5 },
  { "length": 0.22, "diameter": 0.047, "from": 3, "to": 5 },
  { "length": 0.55, "diameter": 0.185, "from": 4, "to": 6 },
  { "length": 0.55, "diameter": 0.185, "from": 5, "to": 7 },
  { "length": 0.3, "diameter": 0.057, "from": 6, "to": 8 },
  { "length": 0.3, "diameter": 0.057, "from": 7, "to": 9 },
  { "length": 0.5, "diameter": 0.19, "from": 8, "to": 10 },
  { "length": 0.5, "diameter": 0.19, "from": 9, "to": 11 },
  { "length": 0.15, "diameter": 0.074, "from": 10, "to": null },
  { "length": 0.15, "diameter": 0.074, "from": 11, "to": null }
]
```

- 今との違い:一次管を 12 本とも 0.50 m の等長に。バンクごとの 1.15 m の管を、中央の箱(0.55 m × 185 mm)、つなぎ(0.30 m × 57 mm)、
  サイドの箱(0.50 m × 190 mm)に。テールは片側 1 本(52 mm の 2 本分 = 74 mm)。
- **今の注記の「横置きの消音器 1 個を両バンクが通る」は、北米・触媒つきの形だった。** 1984 年の欧州仕様は、消音器が 4 個
  (中央の上と下、右と左のサイド)で、片側に 2 個直列。左右のバンクは最後まで合わない。
- `metadata.note`(弁の文は、今の注記の「Valve: …」の文をそのまま残す):

```text
1984 European, without catalyst. Four 3-into-1 manifolds (cylinders 1-3, 4-6, 7-9, 10-12) with equal primaries (equal length from an owners' forum; 0.50 m and 35.5 mm are estimates). Each bank's two manifold pipes (47 mm, from the 51 mm sealing rings; their lengths are estimates) enter its central silencer; a 57 mm pipe (the 61 mm sealing ring; 0.30 m an estimate) joins it to its side silencer; the banks do not meet. The parts catalogue lists an upper and a lower central silencer and a right and a left side silencer; no dimension of a silencer was found. Silencers are written as wide pipes: their lengths are estimates and their widths were set by ear (K, 2026-11-21). A side's two tailpipes (52 mm, an estimate) are written as one of their combined area.
```

### 1.2 `RX_7_TURBO_II_1987.json`

```json
"primaries": [
  { "length": 0.13, "diameter": 0.048, "to": 0 },
  { "length": 0.31, "diameter": 0.048, "to": 0 }
],
"pipes": [
  { "length": 0.08, "diameter": 0.044, "from": 0, "to": 1 },
  { "length": 0.9, "diameter": 0.054, "from": 1, "to": 2 },
  { "length": 0.35, "diameter": 0.13, "from": 2, "to": 3 },
  { "length": 0.75, "diameter": 0.054, "from": 3, "to": 4 },
  { "length": 0.55, "diameter": 0.068, "from": 4, "to": 5 },
  { "length": 0.45, "diameter": 0.27, "from": 5, "to": 6 },
  { "length": 0.2, "diameter": 0.068, "from": 6, "to": null }
]
```

- 今との違い:一次管を 40 → 48 mm、等長 0.22 m → 0.13 m と 0.31 m に。タービンの喉を 30 → 44 mm に。
  メインパイプ(2.0 m × 54 mm)の途中に、触媒に当たる箱(0.35 m × 130 mm)。
  Y から先の左右 2 本(消音器つき)は、断面積を合わせた 1 本に(管 68 mm、箱 0.45 m × 270 mm、テール 68 mm)。
- `metadata.note`:今の注記の「The 13B's two rotors fire twice …」の文と「The port is open 75 BBDC …」の文は、そのまま残す。
  ほかの文を、次に置き換える:

```text
1987 United States. Each rotor's port and its runner in the cast manifold to the turbine (48 mm, the engine's exhaust outlet, from an owners' forum; 0.13 and 0.31 m are estimates from the layout: the turbine's inlet stands nearer one rotor). The turbine's throat: the twin-scroll housing's two passages, 6.00 and 9.48 cm2 (Yamaguchi, quoted on forums), written as one of their combined area, 44 mm, both open; 0.08 m is an estimate. One 54 mm pipe (the 2.25 in converters, an owners' forum) to the Y, with the main converter written as a wide pipe in it. The Y's two 48 mm pipes, their two silencers and two tails are alike, and are written as one of their combined area. The silencer and the converter are wide pipes: their lengths are estimates and their widths were set by ear (K, 2026-11-21). All lengths are estimates.
```

### 1.3 `PORSCHE_928_S4_1987.json`

`primaries` は今のまま。

```json
"pipes": [
  { "length": 0.6, "diameter": 0.052, "from": 0, "to": 4 },
  { "length": 0.35, "diameter": 0.12, "from": 4, "to": 5 },
  { "length": 0.35, "diameter": 0.052, "from": 5, "to": 6 },
  { "length": 0.5, "diameter": 0.15, "from": 6, "to": 7 },
  { "length": 0.9, "diameter": 0.052, "from": 7, "to": 2 },
  { "length": 0.6, "diameter": 0.052, "from": 1, "to": 8 },
  { "length": 0.35, "diameter": 0.12, "from": 8, "to": 9 },
  { "length": 0.35, "diameter": 0.052, "from": 9, "to": 10 },
  { "length": 0.5, "diameter": 0.15, "from": 10, "to": 11 },
  { "length": 0.9, "diameter": 0.052, "from": 11, "to": 2 },
  { "length": 0.6, "diameter": 0.24, "from": 2, "to": 3 },
  { "length": 0.25, "diameter": 0.078, "from": 3, "to": null }
]
```

- 今との違い:バンクごとの 2.70 m の管を、ダウンパイプ 0.60 m、触媒の箱(0.35 m × 120 mm)、0.35 m、
  中間の箱(0.50 m × 150 mm)、0.90 m に(合計は 2.70 m のまま)。後ろの消音器の胴を 66 mm → 0.60 m × 240 mm の箱に。
  テール 2 本を、断面積を合わせた 1 本に(内径 55 mm の 2 本分 = 78 mm)。
- `metadata.note`:今の注記のうち、最後の文「Silencer and catalyst bodies are straight pipes of their inlet diameter.」と、
  「its body is one pipe of the two 47 mm inlets' combined area; two tailpipes, 59 mm outside, 1.5 mm wall」の所を、次に置き換える。ほかの文は残す。

```text
Each bank's pipe carries its catalyst (two from 1987) and its centre silencer (a straight-through resonator; the 1987 ones are the larger) as wide pipes; the transverse rear silencer, where the banks first meet, is a wide pipe; its two tailpipes (55 mm inside, owners' measurement) are written as one of their combined area. The silencers' and catalysts' lengths are estimates and their widths were set by ear (K, 2026-11-21).
```

## 2. 決まりの文書

`docs/calibration.md` の「Exhaust topologies」:

- 「消音器と触媒の胴は、入口の径のまっすぐな管」という決まりを、次に置き換える:
  **消音器と触媒の胴は、1 車種ずつ、長さと太さを持つ太い管として書く。まだ書いていない車は、今までどおり入口の径の管。**
- 足す決まり:**長さも太さも同じ管が同じ継ぎ目から分かれ、同じ並びで外へ開く時は、断面積を合わせた 1 本に書く。**
- 3 台の行を、1. の値に書き直す。
- 928 S4 の注記と台帳(`docs/chase-turbo-vehicles.md`)に排気の値を書いている所があれば、合わせる。

`docs/NEXT.md`:Stage MF の節を足す(3. の中身)。

## 3. 決まっていない事(`docs/NEXT.md` に書く)

- 3 台とも「とりあえず確定」。K は空ぶかしのページで聴いた。ゲームの中で走らせて、もう一度決める。
- 箱の長さと太さは、どの車も資料が無い。長さは推定、太さは耳。実車の寸法が分かったら、長さを合わせて太さを決め直す。
- 928 S4 の中間の消音器は、実車では吸音型(まっすぐ抜ける型)。吸音は、今のモデルに無い。
- RX-7 のタービンの喉は、2 つの通路が両方開いた状態で書いた(低回転では、実車は片方を閉じる)。
- 残りの車(959 を含む)は、まだ箱を書いていない。

## 4. 確かめと報告

- 3 台の音の定義が、今の読み手(`compileEngineSound`)を通る事。
- 音の大きさ(`content/engine-loudness/`)を、今の手順で測り直す。前と後を報告する。
- ENGINE SOUND QUALITY の 3 段階(自車とライバルの速さ)で、3 台とも壊れない事。
- 1 行目は、K が変更を見られる所。
- この 3 台を使うシリーズのコースの測り直しは要らない(音だけの変更)。
