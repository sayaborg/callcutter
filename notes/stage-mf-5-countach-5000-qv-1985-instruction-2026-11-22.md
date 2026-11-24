【Stage MF-5:COUNTACH 5000 QV を 1985 年型に改名し、排気を実車の形で書き、ギヤを直す】

監査役が書いた(2026-11-22)。K が実装者にそのまま渡す。

K の決定(2026-11-22 朝。空ぶかしのページで聴いて決めた)

- 年式を **1985** にする(欧州仕様、キャブレター、黄色、リアウィングつき、5MT。今は 1988)。ID と絵の組の名前も 1985 に変える。
- 音は、ページで **C6** と呼んだ形(3.)。K の言葉:「テスタロッサに寄せなくていい。実車に忠実に寄せて欲しい」。
  管の長さは実物の写真で測り直した値。膨張室は耳で決めた(C5 の前後の箱を一回りずつ小さく)。
- ギヤを、カタログの値に直す(4.)。
- 軸距は 2.45 m のまま(4.2)。

監査役の選び(K の規則ではない。章に書き、報告で K に出す)

- 段階の名前 `MF-5` と、PR の分け方(1.)。
- 実車の管の長さは、**写真と部品図からの見積もり**(± 20 % くらい)。管の内径は資料が無く、置いた値(3.1)。
- 弁の径と開きの出どころ(3.1。カムの再研磨の業者の値)。
- 左右のバンクを消音器の中でつながずに書いた事(3.1。箱の中の通り道は分からない)。

始める時:**MF-3(a・b・c)が main に入った後**の main から(`wool` を使う)。MF-4(エスプリ)とは、`docs/chase-turbo-vehicles.md` と台帳で同じ所に触る。後から入る方が、付け直して確かめ直す。

---

## 0. 今していること(main `84ee908f`、監査役が読んだ)

- ID は `COUNTACH_5000_QV_1988`、絵の組は `countach-5000-qv-1988`。一覧の `period` は `"1988"`、`physicsAnchor` は `{ "modelYear": "1988", "market": "Europe" }`。
- `content/engine-sounds/COUNTACH_5000_QV_1988.json` は仮の形:弁 32 mm・開き 0.4、一次管 12 × 0.35 m × 40 mm が左右のバンクで 1 つずつに集まり、1.159 m × 55 mm → 0.65 m × 55 mm。膨張室は無い。`metadata.note` は「Provisional」。
- `content/vehicles/COUNTACH_5000_QV_1988.json`:ギヤ 2.31 / 1.52 / 1.12 / 0.88 / 0.71、最終 4.091。
- 名前が出てくる所(監査役が数えた。ほかにあれば、それも):
  - ファイルの名前:`content/vehicles/`、`content/vehicle-listings/`、`content/engine-sounds/` の `COUNTACH_5000_QV_1988.json`、
    `content/sprites/countach-5000-qv-1988.json`、`docs/chase-turbo-vehicles/countach-5000-qv-1988-lod0.png`〜`lod5.png`。
  - 中身:`content/engine-loudness/default.json`、`content/vehicle-listings/COUNTACH_5000_QV_1988.json`、`docs/chase-turbo-vehicles.md`、
    `docs/chase-turbo-vehicles/`(`adopted-parameters.csv`、`measurements.json`、`numeric-ledger.csv`、`review.json`、`validation.md`)、
    `tests/audio/exhaust-render.values.json`、`tests/scenarios/chase-turbo.test.mjs`、`tools/build/chase-turbo-validation.ts`、`tools/graphics/chase-turbo-shapes.ts`。

## 1. PR の分け方

`AGENTS.md` のとおり、改名と中身の直しを分ける(959 の時と同じ)。

- **MF-5a:改名だけ。**(2.)数も絵も 1 つも変えない。main に入れてよい。
- **MF-5b:年の言葉、音の定義、ギヤ、文書、測り直し。**(3.〜5.)main に入れてよい。

続けて進めてよい。

## 2. 改名(MF-5a)

- `COUNTACH_5000_QV_1988` → `COUNTACH_5000_QV_1985`、`countach-5000-qv-1988` → `countach-5000-qv-1985`。
- ファイルの名前(0. の一覧)と、名指ししている所すべて。
- 一覧の `period`、`modelYear`、文書の「1988 MY European …」などの年の言葉は、MF-5b で直す。ここでは触らない。
- 古い名前がリポジトリに 1 つも残らない事(履歴は除く)。
- 止まる所:この車両を名指しするシリーズ、コース、保存したデータの形が見つかり、改名で動きが変わる時。

## 3. 音の定義(MF-5b。`content/engine-sounds/COUNTACH_5000_QV_1985.json`)

### 3.1 実車(どれも見積もり。測った値のように書かない)

- **弁**:排気弁 32 mm × 2 本(吸気は 36 mm × 2 本)。排気のリフト 7.92 mm(0.312 インチ)、作用角 259°。
  リフトと作用角は、カムの再研磨の業者(Web Cam)が Countach の 48 バルブ用に「元の仕様に戻す」として載せている値。
  - 径:形式の決まりの式(`本数 × min(π·d·リフト, π·d²/4)`)で、面積の等しい円の径。リフトが径の 1/4(8.0 mm)にわずかに届かないので、45.3 mm でなく **45.0 mm**。
  - 開き:259 ÷ 720 = **0.36**。
  - 持ち主の掲示板には「下死点の 75° 前に開き、上死点の 45° 後に閉じる」(300°)という値もある。すき間を含まない、ごく小さいリフトでの値で、QV は排気のすき間が 0.50 mm と大きい。使わない。
- **集合**:バンクごとに、3 気筒ずつの 3-into-1 が 2 つ(集合管は全部で 4 個)。eurospares の 1985 年の 5000 QV の部品図(028 EXHAUST PIPES)。
- **一次管の長さ**:QV のシリンダーヘッドに集合管を当てた、真上からに近い写真から測った(排気の口の間隔 95 mm を物差しにした)。
  写真の物は純正ではなく、純正の形にならった交換品(ステンレス)。
  - 消音器から遠い方の 3 気筒:約 0.40、0.34、0.36 m。近い方の 3 気筒:約 0.46、0.36、0.32 m。曲げを大きく取って、6 本を寄せてある。
- **集合の先の管**:2 つの集合の位置が約 0.28 m ずれていて、遠い組が約 0.78 m、近い組が約 0.50 m で消音器に着く(写真と部品図)。
- **消音器**:後ろに横置きの四角い箱 1 個(約 0.77 m × 0.20 m × 0.15 m、約 23 L)。各バンクの 2 本が、箱の前の面の、それぞれの端の側に入る。
  テールは 4 本(片側 2 本ずつ)、約 0.20 m。箱の中の通り道は分からない。
- **管の内径**:資料が無い。一次管 38 mm、集合の先の管 50 mm、テール 60 mm と置いた。
- **点火の順**:1-7-4-10-2-8-6-12-3-9-5-11(1〜6 が片方のバンク、7〜12 がもう片方)。3 気筒の組は、どれも 240° おきの等間隔になる。

### 3.2 書き方

- 一次管 12 本は、点火の順に並べる。径 43 mm(38 × 1.14)。継ぎ目 0 と 2 が、消音器から遠い組(気筒 1〜3 と 7〜9)。継ぎ目 1 と 3 が、近い組(4〜6 と 10〜12)。
  点火の順に、継ぎ目は 0, 2, 1, 3 の繰り返し。
- 集合の先の管:遠い組 0.78 m、近い組 0.50 m。径 57 mm(50 × 1.14)。
- **左右のバンクは、出口まで別々に書く**(TESTAROSSA と同じ)。各バンクの管が箱のそれぞれの端に入るので、箱を半分ずつに分けた形。
- 片側ごとに:膨張室 0.44 m × 180 mm(ウール 20 mm。11.2 L)→ 0.08 m × 81 mm(57 × √2)→ 膨張室 0.38 m × 171 mm(8.7 L)→ テール 0.20 m × 97 mm(60 mm × √2 × 1.14。2 本を 1 本にまとめた形)。
  膨張室は合計 39.8 L(排気量の 7.7 倍)。膨張室の大きさと数は、K が耳で決めた。実車は箱 1 個。
- 膨張室を 2 個並べた分、集合から出口までは実車(約 1.2 m と 0.9 m)より長い(1.88 m と 1.60 m)。膨張室は耳で決める所なので、決まりの内。

```json
"cycleRevolutions": 2,
"firingPhases": [0, 0.08333333333333333, 0.16666666666666666, 0.25, 0.3333333333333333, 0.4166666666666667, 0.5, 0.5833333333333334, 0.6666666666666666, 0.75, 0.8333333333333334, 0.9166666666666666],
"exhaust": {
  "valve": {"diameter": 0.045, "open": 0.36},
  "primaries": [
    {"length": 0.4, "diameter": 0.043, "to": 0},
    {"length": 0.4, "diameter": 0.043, "to": 2},
    {"length": 0.46, "diameter": 0.043, "to": 1},
    {"length": 0.46, "diameter": 0.043, "to": 3},
    {"length": 0.34, "diameter": 0.043, "to": 0},
    {"length": 0.34, "diameter": 0.043, "to": 2},
    {"length": 0.32, "diameter": 0.043, "to": 1},
    {"length": 0.32, "diameter": 0.043, "to": 3},
    {"length": 0.36, "diameter": 0.043, "to": 0},
    {"length": 0.36, "diameter": 0.043, "to": 2},
    {"length": 0.36, "diameter": 0.043, "to": 1},
    {"length": 0.36, "diameter": 0.043, "to": 3}
  ],
  "pipes": [
    {"length": 0.78, "diameter": 0.057, "from": 0, "to": 4},
    {"length": 0.5, "diameter": 0.057, "from": 1, "to": 4},
    {"length": 0.44, "diameter": 0.18, "from": 4, "to": 5, "wool": 0.02},
    {"length": 0.08, "diameter": 0.081, "from": 5, "to": 6},
    {"length": 0.38, "diameter": 0.171, "from": 6, "to": 7},
    {"length": 0.2, "diameter": 0.097, "from": 7, "to": null},
    {"length": 0.78, "diameter": 0.057, "from": 2, "to": 8},
    {"length": 0.5, "diameter": 0.057, "from": 3, "to": 8},
    {"length": 0.44, "diameter": 0.18, "from": 8, "to": 9, "wool": 0.02},
    {"length": 0.08, "diameter": 0.081, "from": 9, "to": 10},
    {"length": 0.38, "diameter": 0.171, "from": 10, "to": 11},
    {"length": 0.2, "diameter": 0.097, "from": 11, "to": null}
  ]
}
```

- `firingPhases` は今のまま(12 等分)。
- `metadata.note` を書き直す。「Provisional」の文を消し、3.1 の出どころを書く。**写真・部品図からの見積もりと、置いた値(管の内径)は、そう書く。**
  「膨張室の大きさと数、管の太さの 1.14 倍、ウール 20 mm は、K が耳で決めた(2026-11-22)」と書く。
- `docs/calibration.md` の「Exhaust topologies」の表に、Countach の行を足す(MF-3 で直した表の形で)。
- 整数比の検査で当たるのは、一次管 0.32 m と膨張室の間の 0.08 m だけ(実車の長さと決まりの 0.08 m。そのまま残す)。
  前の膨張室は、一次管の 0.46 m と 1:1 で当たるのを避けて 0.44 m にしてある。

### 3.3 照らし合わせの数(目安。合格の線ではない)

- ウールの棚(`woolShelf`、0.44 m × 0.18 m、`wool` 0.02):A = 3.096、fp = 755 Hz。
  24 kHz の `[b0, b1, a1]` = 0.093077, 0.087405, −0.819518。48 kHz = 0.071553, 0.022732, −0.905715。
- 監査役の写しのカーネルで、6,750 rpm(レッドラインの 90 %)に固定して全開、始めの 1 秒を捨てた後の 4 秒。
  カーネルの出力の実効値 / 頂点 ÷ 実効値(dB):24 kHz で −66.3 / 11.8、48 kHz で −65.2 / 11.9。
- 写しは ES-2 より前の物。1 dB くらいの差は気にしない。3 dB 以上違う時は、定義の読み違いを疑い、まず棚の係数を合わせる。

## 4. 車両(MF-5b)

### 4.1 直す値

| 項目 | 今 | 直す値 | 出どころ |
| --- | --- | --- | --- |
| 一覧の `period` | `"1988"` | `"1985"` | K の決め |
| `physicsAnchor.modelYear` | `"1988"` | `"1985"` | 同じ(`market` は `"Europe"` のまま) |
| `gearRatios` | 2.31, 1.52, 1.12, 0.88, 0.71 | **2.232, 1.625, 1.088, 0.858, 0.707** | K のメモ(当時のカタログ)。Lamborghini の諸元をまとめた 2 つの資料も同じ値 |
| `finalDriveRatio` | 4.091 | 4.091(変えない。45/11) | 同じ |

- 今のギヤは見積もりで、実際の比と違っていた。

### 4.2 変えない物(調べ直した。報告に書く)

- 出力とトルクの 2 点(500 Nm / 5,200 rpm、455 CV / 7,000 rpm の 456.527221 Nm)、`mass` 1565(1,490 kg + 運転者)、全長 4.14、幅 2.0、高さ 1.07、
  トレッド 1.536 / 1.606、前後の重さ(後ろ 59 %)、`compressionRatio` 9.5、タイヤの半径、ブレーキ、`quadraticDrag`:資料と合っている、または動かす資料が無い。
- **軸距 2.45 m**:カタログを含む複数の資料が 2,500 mm と書く。ただし、同じ資料の前後の張り出し(933 mm と 757 mm)と全長 4,140 mm から引くと 2,450 mm になる。
  どちらとも決めきれないので、今の値のまま動かさない。文書に「2,500 mm と書く資料がある」と残す。
- **`redlineRpm` 7500**:回転計の赤の資料は無い。点火の箱の上限が 7,800 rpm という掲示板の書き込みと、カタログの「5 速・7,300 rpm で最高速」があるだけ。今の値のまま。
- 絵と色は変えない。

### 4.3 文書と台帳

- `docs/chase-turbo-vehicles.md`:「Fixed identities」の表の行を「1985 European carburetted 5000 Quattrovalvole」に。
  「まだギヤ比の表が無い車」の文から、Countach を外す。年についての文(「production-year maxima remain estimates」のあたり)を、1985 が K の決めである事に合わせて直す。
  K の決めは、原作についての事実の主張としてではなく、K の決めとして書く。
- `docs/chase-turbo-vehicles/` の台帳と測った表を、道具で作り直すか、今のやり方で直す。
- 「Evidence actually consulted」に、6. の出どころを足す。

## 5. 測り直し(MF-5b)

- `content/engine-loudness/default.json` の Countach の項目を測り直す。ほかの車両の項目は変わらないはず。変わったら止まる。
- `tests/audio/exhaust-render.values.json` の Countach の値を作り直す。ほかの音の値は変わらないはず。変わったら止まる。
- `tests/scenarios/chase-turbo.test.mjs` と `tools/build/chase-turbo-validation.ts` が、Countach の数を決め打ちしている所は、新しい値で書き直す。
  0–100 km/h や最高速を資料の数に合わせる事はしない(K の決め)。テストの意味が変わる所があれば、止まって K に聞く。

## 6. 出どころ

- 排気の部品図(1985 年の 5000 QV、028):https://www.eurospares.co.uk/lamborghini/countach/countach-5000-qv-1985/part-diagrams/028/exhaust-pipes
- 集合管の写真(交換品):https://www.stainless-exhaust.com/wp-content/gallery/exhausts/lamborghini-countach-manifolds.jpg
- 弁の径(吸気 36 mm、排気 32 mm):https://supercarnostalgia.com/blog/lamborghini-countach-quattrovalvole
- カムのリフトと作用角:https://www.webcamshafts.com/pages_vehicles/automobile/lamborghini/2663.html
- カムの時期とすき間(掲示板):https://www.lamborghinichat.com/forum/threads/countach-technical-thread-questions.402160/page-13
- ギヤ比:https://lamborghinicars.tripod.com/countachlp500qv.html 、https://www.supercars.net/blog/1985%E2%86%921988-lamborghini-countach-lp5000-qv/
- 寸法、張り出し、前後の重さ:https://www.lambocars.com/countach-lp500-quattrovalvole-specs-performance/
- K のメモ(2026-11-22。1985 年型、欧州キャブレター仕様の実装用の仕様。当時のカタログの値)。

## 7. K の確かめ

- K は、空ぶかしのページ(監査役の道具)で C6 を聴いて決めた。実装の後、ゲームで Countach を聴いて確かめる。MID(24 kHz)で作り、HIGH(48 kHz)で確かめる。

## 8. 報告に書く事

- 3.3 の数との照らし合わせ。
- 分かっていない所(直さない):消音器の箱の中の通り道(左右を別々に書いた事)。管の内径(置いた値)。テールの長さ(部品図から。写真では確かめていない)。
  一次管と集合の先の管の長さが交換品の写真からである事。弁のリフトと作用角が業者の値である事。軸距。レッドライン。

## 9. しない事、止まる所

- Countach のほかの車の定義に触らない。カーネルの式に触らない。
- 弁の値、管の長さと径、ウールの厚みを、ここに書いた値から動かさない(動かしたい時は K に聞く)。
- 止まる所:MF-3 が main に入っていない時。ほかの車の音量や音の値が変わった時。2. の止まる所。
  テストの意味が変わる時(5.)。管の本数や継ぎ目の形を、形式と解き手が受け付けない時。
