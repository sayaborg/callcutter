【Stage MF-4:LOTUS TURBO ESPRIT 1984 を US 仕様に改め、排気を実車の形で書く】

監査役が書いた(2026-11-22)。K が実装者にそのまま渡す。

K の決定(2026-11-22 朝。空ぶかしのページで聴いて決めた)

- `TURBO_ESPRIT_1984` を、**1984 年の US 仕様(連邦仕様のキャブ車)**に改める。今は 1984 年の UK 仕様。車両の名前(ID)は変えない。
- 音は、ページで **X1** と呼んだ形(2.)。MF-3 の決まり(実車の長さ、太さは実車の内径 × 1.14、膨張室は耳、ターボ車の膨張室は 1 個でよい)どおり。
  K の言葉:「タービンがあるので、膨張室は 1 つでいい」「実車の膨張室の位置は、あまり関係ない」。
- 車両の諸元を、US 仕様の資料で直す(3.)。出力・トルク、ギヤ、車重、全長。
- トルクの線は 5 点のまま。2 点目を「過給の立ち上がりの終わり」(3,500 rpm)に置く(K:「推奨で」)。

監査役の選び(K の規則ではない。章に書き、報告で K に出す)

- 段階の名前 `MF-4`。
- 実車の管の長さと太さは、**部品図と写真からの見積もり**(一次管は ± 30 %、ほかは ± 20 % くらい)。出どころは 2.1。
- タービンの喉の径 30 mm(2.1。出どころが弱い)。
- トルクの線の 950・3,500・7,000 rpm の値(3.2。資料の無い見積もり)。
- 全高、トレッド、重心、前後の重さの割り振り、タイヤの半径、空気抵抗は、今のまま(US の値を確かめていない。3.3)。

始める時:**MF-3(a・b・c)が main に入った後**の main から。この段階は MF-3 の `wool` と、タービンの小部屋 0.12 m を使う。

---

## 0. 今していること(main `93734d6`、監査役が読んだ)

- `content/engine-sounds/TURBO_ESPRIT_1984.json` は仮の形:弁 32 mm・開き 0.4、一次管 4 × 0.40 m × 40 mm が 1 つに集まり、1.173 m × 50 mm → 0.65 m × 50 mm。
  タービンも膨張室も無い。`metadata.note` は「Provisional」。
- `content/vehicles/TURBO_ESPRIT_1984.json`:210 bhp / 6,250 rpm、270 Nm / 4,500 rpm、ギヤ 3.17 / 1.83 / 1.26 / 0.97 / 0.76、最終 4.375、`mass` 1295、全長 4.19 m。
- `content/vehicle-listings/TURBO_ESPRIT_1984.json` の `physicsAnchor` は `{ "modelYear": "1984", "market": "UK" }`。
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
  US 仕様でカムやタイミングが違うという資料は、見つかっていない。
- **集合管**:鋳物。4 本の一次管が、**1 番と 4 番、2 番と 3 番**で合わさり(4 into 2)、2 本の通り道のままタービンの入口で 1 つになる。
  組み方の出どころ:交換品のステンレスの集合管の説明(純正にならって 1-4、2-3)、Motor Sport 1981 年 9 月(2 本に分かれた集合管がそのままターボへ)。
  長さは、Lotus の部品図(80〜87 年の集合管とターボの図)からの見積もり:一次管 約 0.44、0.36、0.26、0.16 m(1 番が長く、4 番が短い)、その先 約 0.34 m × 2 本。
  斜めから描いた図なので、± 30 %。内径は 一次管 約 38 mm、その先 約 42 mm(見積もり)。
- **タービン**:Garrett T3。タービンの A/R は 0.63(持ち主の掲示板の書き込み 1 つだけ。弱い出どころ)。
  喉の径は、DELTA の値(0.48 A/R で 26 mm)から、面積を A/R の比で伸ばして 30 mm。
- **タービンの後ろ**:蛇腹つきの管 1 本(約 0.84 m)→ 後ろの横置きの消音器 1 個(円筒、約 0.80 m × 150 mm。片端から入り、反対の端から出る)→ 2 本のテール(約 0.30 m)。
  長さは、Giugiaro のターボ用の交換品(ステンレス)の一式の写真からの見積もり。純正の写真ではない。
  **管の内径は 2 インチ(約 51 mm)**:1985 年の連邦仕様のキャブ車の持ち主が、タービンのフランジと消音器の入口で測った値。
  テールの内径は約 45 mm × 2 本(見積もり)。
- **US 仕様の触媒とエア噴射**(Road & Track 1983 年の試乗)は、書かない。位置も胴の大きさも資料が無く、K の決め(ターボ車の膨張室は 1 個)で足りる。
  ウェイストゲートの管も書かない(MF-3 の決まり)。

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
  カーネルの出力の実効値 / 頂点 ÷ 実効値(dB):24 kHz で −97.2 / 8.7、48 kHz で −95.7 / 9.2。3. のトルクの線で測った。
- 写しは ES-2 より前の物。1 dB くらいの差は気にしない。3 dB 以上違う時は、定義の読み違いを疑い、まず棚の係数を合わせる。

## 3. 車両(`content/vehicles/TURBO_ESPRIT_1984.json`、`content/vehicle-listings/TURBO_ESPRIT_1984.json`)

### 3.1 直す値

| 項目 | 今 | 直す値 | 出どころ |
| --- | --- | --- | --- |
| `physicsAnchor.market` | `"UK"` | `"US"` | K の決め |
| `overallLength` | 4.19 | **4.29** | 二次の諸元集 2 つ(US 仕様 429.3 cm、同じ年の欧州仕様 419.1 cm)。バンパーの形そのものは確かめていない |
| `mass` | 1295 | **1304** | 車重 2,710 lb(1,229 kg。Road & Track 1983 年)+ 運転者 75 kg |
| `yawInertia` | 2268 | **2376** | 今の決まり `mass × (長さ² + 幅²) ÷ 12` |
| `pitchInertia` | 2029 | **2135** | 今の決まり `mass × (長さ² + 高さ²) ÷ 12` |
| `frontBrakeTorqueMax` | 2750 | **2775** | 今の決まり(`mass` × 11.5 × 0.65 × 前の半径、25 Nm に丸め) |
| `rearBrakeTorqueMax` | 1600 | **1625** | 同じ(× 0.35 × 後ろの半径) |
| `gearRatios` | 3.17, 1.83, 1.26, 0.97, 0.76 | **2.923, 1.941, 1.321, 0.97, 0.757** | 1983 年の US 仕様の諸元。Autocar の Turbo HC の試乗の表(2.92 / 1.94 / 1.32 / 0.97 / 0.76、最終 4.38)とも合う |
| `finalDriveRatio` | 4.375 | 4.375(変えない) | 同上 |
| `torqueCurve` | 下 | 下 | 3.2 |

- 慣性とブレーキは、今の決まりの式で実装者が計算し直して、上の値と合うか確かめる。合わなければ、式の方が正しい。
- `compressionRatio` 7.5、`redlineRpm` 7000、`idleRpm` 950、`displacementCc` 2174 は、US 仕様でも同じ(変えない)。

### 3.2 トルクの線(5 点)

```json
"torqueCurve": [
  { "rpm": 950, "torqueNewtonMeters": 84 },
  { "rpm": 3500, "torqueNewtonMeters": 237 },
  { "rpm": 5000, "torqueNewtonMeters": 263.028682 },
  { "rpm": 6000, "torqueNewtonMeters": 243.297774 },
  { "rpm": 7000, "torqueNewtonMeters": 199.504175 }
]
```

- **資料どおりの 2 点**:最大トルク 194 lb-ft / 5,000 rpm(× 1.355817948 = 263.028682 Nm)、最高出力 205 bhp(SAE net)/ 6,000 rpm(× 0.7457 = 152.8685 kW、その時 243.297774 Nm)。
  どちらも Road & Track 1983 年の試乗が書いたメーカーの公称。別の諸元集も同じ値。
- **見積もりの 3 点**:
  - 3,500 rpm の 237 Nm:US 仕様の線図は見つからなかった。UK 仕様の分かっている点(2,500 rpm で 140 lb-ft より上、4,000〜4,500 rpm で 200 lb-ft)を結んだ線の 3,500 rpm の値に、194 ÷ 200 を掛けた。
    2 点目を 2,000 rpm に置くと、5,000 rpm の頂点まで直線になって中回転がやせる(4,000 rpm で約 14 % 低い)ので、過給の立ち上がりの終わりに置いた。
  - 950 rpm の 84 Nm、7,000 rpm の 199.504175 Nm(最高出力の点の 0.82 倍):今の線と同じ割合。出力の頂点は 6,000 rpm のまま。
- 点の数は 5 のまま(車ごとの例外を作らない)。

### 3.3 変えない物(US の値を確かめていない。報告に書く)

- `overallWidth`、`overallHeight`、`frontTrack`、`rearTrack`、`frontAxle`、`rearAxle`(軸距 2.438 m は US も同じ)、`desiredCgHeight`、
  タイヤの半径と車輪の慣性(タイヤは US も 195/60VR15・235/60VR15)、`quadraticDrag`、サスペンションの値。
- 絵(スプライトの組 `turbo-esprit-1984`)と色は変えない。US のバンパーの形に描き直さない。
  全長を変えると絵の大きさや当たりの大きさが変わる作りなら、**止まって K に聞く。**

### 3.4 文書と台帳

- `docs/chase-turbo-vehicles.md`:「Fixed identities」の表のエスプリの行を「1984 US Turbo Esprit, Type 82(連邦仕様、キャブ、触媒つき)」に。
  車重の文の「Esprit 1220」を 1229 に(Road & Track の車重、と出どころも)。
  「まだギヤ比の表が無い車」の文から、エスプリを外す(出どころは二次資料 2 つ、と書く)。
- `docs/chase-turbo-vehicles/` の台帳と測った表(`numeric-ledger.csv`、`adopted-parameters.csv`、`measurements.json`、`review.json`、`validation.md`)を、道具で作り直すか、今のやり方で直す。
  台帳の分類:公称の 2 点とギヤと車重は「二次資料で確かめた値」、見積もりの点は今までどおり「見積もり」。
- `docs/chase-turbo-vehicles.md` の「Evidence actually consulted」に、5. の出どころを足す。

## 4. 測り直し

- `content/engine-loudness/default.json` の `TURBO_ESPRIT_1984` を測り直す。ほかの車両の項目は変わらないはず。変わったら止まる。
- `tests/audio/exhaust-render.values.json` の `TURBO_ESPRIT_1984` の値を作り直す。ほかの音の値は変わらないはず。変わったら止まる。
- `tests/scenarios/chase-turbo.test.mjs` と `tools/build/chase-turbo-validation.ts` が、エスプリの数(速さ、時間、出力)を決め打ちしている所は、新しい値で書き直す。
  0–100 km/h や最高速を資料の数に合わせる事はしない(K の決め)。テストの意味が変わる所があれば、止まって K に聞く。

## 5. 出どころ

- Road & Track 1983 年の試乗(US 仕様。205 bhp / 6,000、194 lb-ft / 5,000、車重 2,710 lb、Dellorto 45、3 段の触媒とエア噴射、レッドライン 7,000):
  https://www.lotusespritturbo.com/Lotus_Turbo_Esprit_Road_And_Track_Test.htm
- US 仕様の諸元(全長 429.3 cm、205 hp SAE net):https://www.ultimatespecs.com/car-specs/Lotus/132270/Lotus-Esprit-Turbo-22i-US-market.html 、
  https://www.automobile-catalog.com/car/1986/1487435/lotus_turbo_esprit.html
- 1983 年 US のギヤ比:https://www.motormatchup.com/catalog/Lotus/Esprit-Turbo/1983/2DR-Coupe 。
  Autocar の Turbo HC の試乗の表:https://www.lotusespritturbo.com/Lotus_Turbo_Esprit_HC_Road_Test.htm
- UK のトルクの点:Motor Sport 1981 年 9 月 https://www.motorsportmagazine.com/archive/article/september-1981/48/lotus-esprit-turbo/
- 排気弁:https://lotusmarques.com/parts/datasheets/841-lotus-esprit-turbo-exhaust-valves 。カム:https://users.ox.ac.uk/~ohare/engine.htm
- 集合管の組み方:http://www.lotusespritworld.com/EGuides/EModifications/StainlessManifold.html 、https://www.projectm71.com/TurboEsprit.html
- 集合管とターボの部品図:https://lotusmarques.com/images/lm/Esprit-exhaust-manifold-and-turbo-80-87/esprit-turbo-man-80-87-wm.jpg
- 排気の管の内径(1985 年の連邦仕様のキャブ車):https://www.lotustalk.com/threads/exhaust-diameter.378097
- タービンの A/R:https://www.lotustalk.com/threads/turbo-mods-upgrades.108579/
- 排気の一式の写真(交換品):https://www41.easy-myshop.jp/emsrsc/nilaikanai/itemimg/2131/item.2131.1.jpg

## 6. K の確かめ

- K は、空ぶかしのページ(監査役の道具)で X1 を聴いて決めた。実装の後、ゲームでエスプリを聴いて確かめる。MID(24 kHz)で作り、HIGH(48 kHz)で確かめる。

## 7. 報告に書く事

- 2.3 の数との照らし合わせ。3.1 の計算し直した値。
- 分かっていない所(直さない):一次管の長さ(± 30 %)。タービンの A/R。US 仕様のカムのタイミング。US の排気の取り回しと触媒(書いていない)。
  排気の写真が純正でなく交換品である事。全長の出どころが二次資料である事。トルクの線の見積もりの 3 点。3.3 の変えなかった物。

## 8. しない事、止まる所

- エスプリのほかの車の定義に触らない。カーネルの式に触らない。
- 弁の値、管の長さと径、ウールの厚みを、ここに書いた値から動かさない(動かしたい時は K に聞く)。
- トルクの線の点の数を増やさない。
- 止まる所:MF-3 が main に入っていない時。ほかの車の音量や音の値が変わった時。全長の変更が絵や当たりに響く時(3.3)。
  テストの意味が変わる時(4.)。管の本数や継ぎ目の形を、形式と解き手が受け付けない時。
