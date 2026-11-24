【Stage MF-4:LOTUS TURBO ESPRIT 1984(UK)の排気を実車の形で書き、ギヤとトルクの線を直す】

監査役が書いた(2026-11-22)。K が実装者にそのまま渡す。
同じ日に書いた US 仕様の版(`…-us-instruction-…`)は、実装者に渡っていない。捨てた。この文だけが MF-4。

K の決定(2026-11-22 朝。空ぶかしのページで聴いて決めた)

- `TURBO_ESPRIT_1984` は、**1984 年の UK 仕様のまま**にする。一度 US 仕様に変えると決めたが、戻した(K:「UK 仕様に戻すわ。その方が一般的」)。
- 音は、ページで **X1** と呼んだ形(2.)。MF-3 の決まり(実車の長さ、太さは実車の内径 × 1.14、膨張室は耳、ターボ車の膨張室は 1 個でよい)どおり。
  K の言葉:「タービンがあるので、膨張室は 1 つでいい」「実車の膨張室の位置は、あまり関係ない」。
- 車両の諸元を調べ直して、違っていた所を直す(3.)。ギヤの 1〜3 速と、トルクの線。
- トルクの線は 5 点のまま。2 点目を「過給の立ち上がりの終わり」に置く(K が US の線で「推奨で」とした置き方を、UK の線に当てた)。

監査役の選び(K の規則ではない。章に書き、報告で K に出す)

- 段階の名前 `MF-4`。
- 実車の管の長さと太さは、**部品図と写真からの見積もり**(一次管は ± 30 %、ほかは ± 20 % くらい)。出どころは 2.1。
- タービンの喉の径 30 mm(2.1。出どころが弱い)。タービンの後ろの管の内径に、US 仕様の車を測った値を使った事(2.1)。
- トルクの線の 2 点目を 2,500 rpm・190 Nm に置いた事と、最大トルクを資料どおりの 271.16359 Nm に直した事(3.2)。

始める時:**MF-3(a・b・c)が main に入った後**の main から。この段階は MF-3 の `wool` と、タービンの小部屋 0.12 m を使う。

---

## 0. 今していること(main `93734d6`、監査役が読んだ)

- `content/engine-sounds/TURBO_ESPRIT_1984.json` は仮の形:弁 32 mm・開き 0.4、一次管 4 × 0.40 m × 40 mm が 1 つに集まり、1.173 m × 50 mm → 0.65 m × 50 mm。
  タービンも膨張室も無い。`metadata.note` は「Provisional」。
- `content/vehicles/TURBO_ESPRIT_1984.json`:ギヤ 3.17 / 1.83 / 1.26 / 0.97 / 0.76、最終 4.375。
  トルクの線は 86.4 / 950、126.9 / 2,000、270 / 4,500、239.262592 / 6,250、196.195325 / 7,000(Nm / rpm)。
- `physicsAnchor` は `{ "modelYear": "1984", "market": "UK" }`(変えない)。
- `TURBO_ESPRIT_1984` が出てくる所(監査役が数えた 12 ファイル。ほかにあれば、それも):
  `content/engine-loudness/default.json`、`content/vehicle-listings/TURBO_ESPRIT_1984.json`、`docs/chase-turbo-vehicles.md`、
  `docs/chase-turbo-vehicles/`(`adopted-parameters.csv`、`measurements.json`、`numeric-ledger.csv`、`review.json`、`validation.md`)、
  `tests/audio/exhaust-render.values.json`、`tests/scenarios/chase-turbo.test.mjs`、`tools/build/chase-turbo-validation.ts`、`tools/graphics/chase-turbo-shapes.ts`。
- `docs/calibration.md` の「Exhaust topologies」の表に、エスプリの行は無い。

## 1. PR

1 つでよい。音(2.)と車両(3.)を一緒に入れる(音量の測り直しが、両方に効くため)。

## 2. 音の定義(`content/engine-sounds/TURBO_ESPRIT_1984.json`)

### 2.1 実車(どれも見積もり。測った値のように書かない)

- **弁**:排気弁は頭の径 30.87 mm(1.215 インチ)× 2 本(純正番号 B910E1383F の部品の資料)。
  定義の径は、2 本を 1 本にまとめた 43.7 mm(30.87 × √2。16 バルブの車の今までの書き方)。
  カムは 910 の「107」カムで、作用角 252°(Tim Engel の表)。開きは 252 ÷ 720 = 0.35。
- **集合管**:鋳物。4 本の一次管が、**1 番と 4 番、2 番と 3 番**で合わさり(4 into 2)、2 本の通り道のままタービンの入口で 1 つになる。
  組み方の出どころ:交換品のステンレスの集合管の説明(純正にならって 1-4、2-3)、Motor Sport 1981 年 9 月(2 本に分かれた集合管がそのままターボへ)。
  長さは、Lotus の部品図(80〜87 年の集合管とターボの図)からの見積もり:一次管 約 0.44、0.36、0.26、0.16 m(1 番が長く、4 番が短い)、その先 約 0.34 m × 2 本。
  斜めから描いた図なので、± 30 %。内径は 一次管 約 38 mm、その先 約 42 mm(見積もり)。
- **タービン**:Garrett T3。タービンの A/R は 0.63(持ち主の掲示板の書き込み 1 つだけ。弱い出どころ)。
  喉の径は、DELTA の値(0.48 A/R で 26 mm)から、面積を A/R の比で伸ばして 30 mm。
- **タービンの後ろ**:蛇腹つきの管 1 本(約 0.84 m)→ 後ろの横置きの消音器 1 個(円筒、約 0.80 m × 150 mm。片端から入り、反対の端から出る)→ 2 本のテール(約 0.30 m)。
  長さは、Giugiaro のターボ用の交換品(ステンレス)の一式の写真からの見積もり。純正の写真ではない。
  **管の内径は 2 インチ(約 51 mm)**:1985 年の連邦仕様(US)のキャブ車の持ち主が、タービンのフランジと消音器の入口で測った値。
  UK 仕様の管を測った値は見つかっていない。同じ時期の同じ車なので、この値を使う(写真からの見積もりは約 54 mm で、近い)。
  テールの内径は約 45 mm × 2 本(見積もり)。
- UK 仕様に触媒は無い。ウェイストゲートの管は書かない(MF-3 の決まり)。

### 2.2 書き方

- 一次管 4 本は、点火の順(1-3-4-2)に並べる:0.44 m(1 番)、0.26 m(3 番)、0.16 m(4 番)、0.36 m(2 番)。径 43 mm(38 × 1.14)。
  1 番と 4 番が継ぎ目 0、3 番と 2 番が継ぎ目 1。
- その先 0.34 m × 48 mm(42 × 1.14)の 2 本が、継ぎ目 2 で合わさる。
- タービン:喉 0.08 m × 30 mm → 小部屋 0.12 m × 150 mm(全車共通の形)。
- 0.84 m × 58 mm(51 × 1.14)→ 膨張室 0.80 m × 150 mm(ウール 20 mm。14.1 L、排気量の 6.5 倍)→ テール 0.30 m × 73 mm(45 mm × √2 × 1.14。2 本を 1 本にまとめた形)。
- 膨張室は、実車の消音器の胴の位置と大きさ。K が聴いて、これで決めた。

```json
"cycleRevolutions": 2,
"firingPhases": [0, 0.25, 0.5, 0.75],
"exhaust": {
  "valve": {"diameter": 0.0437, "open": 0.35},
  "primaries": [
    {"length": 0.44, "diameter": 0.043, "to": 0},
    {"length": 0.26, "diameter": 0.043, "to": 1},
    {"length": 0.16, "diameter": 0.043, "to": 0},
    {"length": 0.36, "diameter": 0.043, "to": 1}
  ],
  "pipes": [
    {"length": 0.34, "diameter": 0.048, "from": 0, "to": 2},
    {"length": 0.34, "diameter": 0.048, "from": 1, "to": 2},
    {"length": 0.08, "diameter": 0.03, "from": 2, "to": 3},
    {"length": 0.12, "diameter": 0.15, "from": 3, "to": 4},
    {"length": 0.84, "diameter": 0.058, "from": 4, "to": 5},
    {"length": 0.8, "diameter": 0.15, "from": 5, "to": 6, "wool": 0.02},
    {"length": 0.3, "diameter": 0.073, "from": 6, "to": null}
  ]
}
```

- `metadata.note` を書き直す。「Provisional」の文を消し、2.1 の出どころを書く。**部品図・写真からの見積もりは、見積もりと書く。**
  「膨張室の大きさと位置、管の太さの 1.14 倍、ウール 20 mm は、K が耳で決めた(2026-11-22)」と書く。
- `docs/calibration.md` の「Exhaust topologies」の表に、エスプリの行を足す(MF-3 で直した表の形で)。
- 整数比の検査で当たるのは、一次管 0.16 m と喉 0.08 m、一次管 0.36 m と小部屋 0.12 m の 2 つ。
  どちらも「実車の長さと共通のタービン」なので、MF-3 の決まりどおり、そのまま残す。

### 2.3 照らし合わせの数(目安。合格の線ではない)

- ウールの棚(`woolShelf`、0.80 m × 0.15 m、`wool` 0.02):A = 7.164、fp = 497 Hz。
  24 kHz の `[b0, b1, a1]` = 0.063090, 0.059245, −0.877666。48 kHz = 0.032507, 0.030526, −0.936968。
- 監査役の写しのカーネルで、6,300 rpm(レッドラインの 90 %)に固定して全開、始めの 1 秒を捨てた後の 4 秒。
  カーネルの出力の実効値 / 頂点 ÷ 実効値(dB):24 kHz で −97.2 / 8.7、48 kHz で −95.7 / 9.2。3.2 のトルクの線で測った。
- 写しは ES-2 より前の物。1 dB くらいの差は気にしない。3 dB 以上違う時は、定義の読み違いを疑い、まず棚の係数を合わせる。

## 3. 車両(`content/vehicles/TURBO_ESPRIT_1984.json`)

### 3.1 ギヤ

| 項目 | 今 | 直す値 | 出どころ |
| --- | --- | --- | --- |
| `gearRatios` | 3.17, 1.83, 1.26, 0.97, 0.76 | **2.923, 1.941, 1.321, 0.97, 0.757** | Autocar の Turbo HC の試乗の表(同じ Citroën の箱:2.92 / 1.94 / 1.32 / 0.97 / 0.76、最終 4.38)。細かい桁は、同じ箱の 1983 年の諸元 |
| `finalDriveRatio` | 4.375 | 4.375(変えない) | 同上 |

- 今の 1〜3 速は見積もりで、実際の比と違っていた。4・5 速は合っている。
- Autocar の 1984 年 12 月の試乗(UK のターボ)は、5 速で 1,000 rpm あたり 22.7 mph と書いている。HC の表の 5 速(22.7 mph)と同じなので、箱と最終減速は同じ物。

### 3.2 トルクの線(5 点)

```json
"torqueCurve": [
  { "rpm": 950, "torqueNewtonMeters": 86.4 },
  { "rpm": 2500, "torqueNewtonMeters": 190 },
  { "rpm": 4500, "torqueNewtonMeters": 271.16359 },
  { "rpm": 6250, "torqueNewtonMeters": 239.262592 },
  { "rpm": 7000, "torqueNewtonMeters": 196.195325 }
]
```

- **資料どおりの点**:
  - 最大トルク 200 lb-ft / 4,500 rpm(× 1.355817948 = 271.16359 Nm)。最高出力 210 bhp / 6,250 rpm(今の値 239.262592 Nm のまま)。
    どちらも Autocar の 1984 年 12 月の試乗(UK のターボ)の諸元。今の 270 Nm は丸めた見積もりだったので、資料の値にする。
  - 2,500 rpm の 190 Nm:Motor Sport 1981 年 9 月が「2,500 rpm で 140 lb-ft より上」と書いている(140 lb-ft = 189.8 Nm)。
- **見積もりの点**:950 rpm の 86.4 Nm、7,000 rpm の 196.195325 Nm(今のまま)。
- 2 点目を今の 2,000 rpm から 2,500 rpm に移すわけ:この車は 2,000 から 2,500 rpm で過給が立ち上がる(2,000 rpm で約 100 lb-ft、2,500 rpm で 140 lb-ft より上)。
  2 点目を立ち上がりの途中に置くと、そこから頂点まで直線になって中回転がやせる。立ち上がりの終わりに置けば、効いた後の線が資料の点を通る。
  代わりに 2,000 rpm は約 157 Nm になり、資料の値(約 136 Nm)より高い。ゲームは高回転が続くので、中〜上を合わせた。
- 点の数は 5 のまま(車ごとの例外を作らない)。

### 3.3 変えない物

- `mass` 1295(車重 1,220 kg + 運転者 75 kg。諸元集の UK の車重 2,690 lb と合う)、全長 4.19 m、幅、高さ、トレッド、軸距、慣性、ブレーキ、タイヤの半径、`quadraticDrag`、
  `compressionRatio` 7.5、`redlineRpm` 7000、`idleRpm` 950、`displacementCc` 2174。調べ直して、今の値と食い違う資料は無かった。
- `content/vehicle-listings/TURBO_ESPRIT_1984.json` と絵は変えない。

### 3.4 文書と台帳

- `docs/chase-turbo-vehicles.md`:「まだギヤ比の表が無い車」の文から、エスプリを外す(出どころは雑誌の試乗の表、と書く)。
  「Evidence actually consulted」に、5. の出どころを足す。
- `docs/chase-turbo-vehicles/` の台帳と測った表(`numeric-ledger.csv`、`adopted-parameters.csv`、`measurements.json`、`review.json`、`validation.md`)を、道具で作り直すか、今のやり方で直す。
  台帳の分類:ギヤ、最大トルク、最高出力の点、2,500 rpm の点は「二次資料で確かめた値」、950 と 7,000 rpm の点は今までどおり「見積もり」。

## 4. 測り直し

- `content/engine-loudness/default.json` の `TURBO_ESPRIT_1984` を測り直す。ほかの車両の項目は変わらないはず。変わったら止まる。
- `tests/audio/exhaust-render.values.json` の `TURBO_ESPRIT_1984` の値を作り直す。ほかの音の値は変わらないはず。変わったら止まる。
- `tests/scenarios/chase-turbo.test.mjs` と `tools/build/chase-turbo-validation.ts` が、エスプリの数(速さ、時間、出力)を決め打ちしている所は、新しい値で書き直す。
  0–100 km/h や最高速を資料の数に合わせる事はしない(K の決め)。テストの意味が変わる所があれば、止まって K に聞く。

## 5. 出どころ

- Autocar 1984 年 12 月の試乗(UK のターボ。210 bhp / 6,250、200 lb-ft / 4,500、圧縮比 7.5、過給 8 psi、5 速 22.7 mph / 1,000 rpm):
  https://www.lotusespritturbo.com/Lotus_Turbo_Esprit_Road_Test_1984.htm
- Autocar の Turbo HC の試乗の表(ギヤ比、最終減速、タイヤ):https://www.lotusespritturbo.com/Lotus_Turbo_Esprit_HC_Road_Test.htm
- ギヤ比の細かい桁(同じ箱の 1983 年の諸元):https://www.motormatchup.com/catalog/Lotus/Esprit-Turbo/1983/2DR-Coupe
- Motor Sport 1981 年 9 月(2,500 rpm で 140 lb-ft より上、2 本に分かれた集合管):https://www.motorsportmagazine.com/archive/article/september-1981/48/lotus-esprit-turbo/
- 2,000 rpm で 100 lb-ft、集合管は 4 into 2:https://www.projectm71.com/TurboEsprit.html
- 車重と寸法(UK):https://www.ultimatespecs.com/car-specs/Lotus/132269/Lotus-Esprit-Turbo-22i.html
- 排気弁:https://lotusmarques.com/parts/datasheets/841-lotus-esprit-turbo-exhaust-valves 。カム:https://users.ox.ac.uk/~ohare/engine.htm
- 集合管の組み方(1-4、2-3):http://www.lotusespritworld.com/EGuides/EModifications/StainlessManifold.html
- 集合管とターボの部品図:https://lotusmarques.com/images/lm/Esprit-exhaust-manifold-and-turbo-80-87/esprit-turbo-man-80-87-wm.jpg
- 排気の管の内径(1985 年の連邦仕様のキャブ車を測った値):https://www.lotustalk.com/threads/exhaust-diameter.378097
- タービンの A/R:https://www.lotustalk.com/threads/turbo-mods-upgrades.108579/
- 排気の一式の写真(交換品):https://www41.easy-myshop.jp/emsrsc/nilaikanai/itemimg/2131/item.2131.1.jpg

## 6. K の確かめ

- K は、空ぶかしのページ(監査役の道具)で X1 を聴いて決めた。実装の後、ゲームでエスプリを聴いて確かめる。MID(24 kHz)で作り、HIGH(48 kHz)で確かめる。

## 7. 報告に書く事

- 2.3 の数との照らし合わせ。
- 分かっていない所(直さない):一次管の長さ(± 30 %)。タービンの A/R。タービンの後ろの管の内径が US 仕様の車の実測である事。
  排気の写真が純正でなく交換品である事。消音器の中の通り道。トルクの線の見積もりの 2 点と、2,000 rpm が資料より高い事。

## 8. しない事、止まる所

- エスプリのほかの車の定義に触らない。カーネルの式に触らない。
- 弁の値、管の長さと径、ウールの厚みを、ここに書いた値から動かさない(動かしたい時は K に聞く)。
- トルクの線の点の数を増やさない。
- 止まる所:MF-3 が main に入っていない時。ほかの車の音量や音の値が変わった時。
  テストの意味が変わる時(4.)。管の本数や継ぎ目の形を、形式と解き手が受け付けない時。
