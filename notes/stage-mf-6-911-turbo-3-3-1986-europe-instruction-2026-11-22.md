【Stage MF-6:911 TURBO 3.3 を 1986 年型・欧州仕様の 1 台にまとめ、排気を実車の形で書く】

監査役が書いた(2026-11-22)。K が実装者にそのまま渡す。

K の決定(2026-11-22。空ぶかしのページで聴いて決めた)

- 911 TURBO 3.3 は **1 台だけ**にする。今の 1989 年型(`911_TURBO_3_3`)を消し、**1986 年型(`911_TURBO_3_3_1986`)で置き換える**。TSUKUBA CLUBMAN の 911 CUP も 1986 年型で走る(5 速が 4 速になる)。
- 1986 年型は **欧州仕様**にする(今は US)。930/66、300 PS、4 速、触媒なし。
  年式の選び方は K の決まり(台数の多いメジャーな仕様、またはデビューの年)。1986 年型は欧州ほか向けのクーペでも一番台数の多い年なので、年式は 1986 のまま。
- 音は、ページで **E5** と呼んだ形(3.)。集合の形、左右の管の長さは、K の指摘で純正の部品図から測り直した。箱の大きさと位置は耳で決めた。
- 絵は、**今の 1989 年型の絵(4 面の写真から作った絵。SILVER / BLACK / GUARDS RED / GP WHITE)を残し**、1986 年型の絵にする。今の 1986 年型の絵(手続きで作った形。GAME BASE / RED / BLUE / WHITE)は消す。

監査役の選び(K の規則ではない。章に書き、報告で K に出す)

- 段階の名前 `MF-6` と、PR の分け方(1.)。
- 実車の管の長さは、**純正の部品図(斜めの図)からの見積もり**(± 25 % くらい)。管の内径は、今の 1989 年型の定義の値と置いた値(3.1)。
- トルクの線の 5 点のうち 3 点は見積もり(4.1)。
- 一覧の `selectionOrder`、`steeringPicture`、`engine` の扱い(5.2)。
- 絵を作り直す時に、元の 4 面の写真は変えない事(5.1)。

始める時:**MF-3(a・b・c)が main に入った後**の main から(`wool` を使う。監査役が読んだのは `fe882d9a`)。MF-4(エスプリ)・MF-5(Countach)とは、`docs/chase-turbo-vehicles.md`、台帳、`docs/calibration.md` の表で同じ所に触る。後から入る方が、付け直して確かめ直す。

---

## 0. 今していること(main `fe882d9a`、監査役が読んだ)

911 TURBO 3.3 が 2 台ある。

| | `911_TURBO_3_3`(消す) | `911_TURBO_3_3_1986`(残す) |
| --- | --- | --- |
| 一覧 | 1989、`European/ROW`、`G50/50 5-speed`、`selectionOrder` 2 | 1986、`US`、`4MT`、`selectionOrder` 35 |
| 絵の組 | `911-turbo-3-3`(4 面の写真から作った絵。`silver` / `black` / `red` / `white`) | `911-turbo-3-3-1986`(`tools/graphics/chase-turbo-shapes.ts` の手続きの形。`stock` / `red` / `blue` / `white`) |
| ギヤ | 3.154 / 1.789 / 1.269 / 0.967 / 0.756、最終 4.111 | 2.25 / 1.304 / 0.893 / 0.625、最終 4.222 |
| 音 | 3 本が 1 つに集まる形(一次管 0.52〜0.76 m)。膨張室なし | 仮の形(「Provisional」)。膨張室なし |
| 使う所 | TSUKUBA CLUBMAN の 911 CUP(16 台ぶん)、TSUKUBA の走行ラインと基準の時間、テストの走行シナリオ | OUT RUN と TURBO OUTRUN の交通 |

`911_TURBO_3_3`(と `911-turbo-3-3`)の名前が出てくる所(監査役が数えた。ほかにあれば、それも):

- ファイルの名前:`content/vehicles/911_TURBO_3_3.json`、`content/vehicle-listings/911_TURBO_3_3.json`、`content/engine-sounds/911_TURBO_3_3.json`、
  `content/sprites/911-turbo-3-3.json`、`content/vehicle-picture-sources/911-turbo-3-3.json` と `911-turbo-3-3-top.png`・`-front.png`・`-side.png`・`-rear.png`。
- 中身:`content/series/tsukuba-clubman.series.json`、`content/racing-lines/tsukuba.json`、`content/reference-times/tsukuba.json`、`content/engine-loudness/default.json`、
  `tests/scenarios/run-rules.series.json`、`tests/audio/exhaust-render.values.json`、
  `docs/NEXT.md`、`docs/calibration.md`、`docs/content-and-gameplay.md`、`docs/development.md`、`docs/image-assets.md`。

`911_TURBO_3_3_1986`(と `911-turbo-3-3-1986`)の名前が出てくる所:

- `content/vehicles/`、`content/vehicle-listings/`、`content/engine-sounds/` の `911_TURBO_3_3_1986.json`、`content/sprites/911-turbo-3-3-1986.json`、
  `content/series/arcade-tribute-outrun.series.json`、`content/series/arcade-tribute-turbo-outrun.series.json`、`content/engine-loudness/default.json`、
  `tests/audio/exhaust-render.values.json`、`tools/build/chase-turbo-validation.ts`、`tools/graphics/chase-turbo-shapes.ts`、
  `docs/chase-turbo-vehicles.md`、`docs/chase-turbo-vehicles/`(`review.json`、`validation.md`、`measurements.json`、台帳、`911-turbo-3-3-1986*.png`)。

## 1. PR の分け方

- **MF-6a:1986 年型を欧州仕様にする。**(3.・4.)音の定義、トルクの線、一覧の仕向地、文書、測り直し。絵には触らない。main に入れてよい。
- **MF-6b:絵を付け替える。**(5.)写真の絵を 1986 年型の絵にし、手続きの形を消す。一覧の見た目の項目。main に入れてよい。
- **MF-6c:1989 年型を消し、使っている所を 1986 年型に置き換える。**(6.)TSUKUBA CLUBMAN、走行ライン、基準の時間、テスト、文書。main に入れてよい。

この順で続けて進めてよい(MF-6c の 911 CUP は、MF-6b の 4 色を使う)。

## 2. 名前

- 残る ID は `911_TURBO_3_3_1986`、絵の組は `911-turbo-3-3-1986`。改名は無い。
- MF-6c の後、`911_TURBO_3_3` と `911-turbo-3-3` が、`_1986` / `-1986` の付かない形でリポジトリに 1 つも残らない事(履歴と、過去の段階の記録として書かれた文は除く。3. の表の行のように今の事を書いている所は直す)。

## 3. 音の定義(MF-6a。`content/engine-sounds/911_TURBO_3_3_1986.json`)

### 3.1 実車(どれも見積もり。測った値のように書かない)

- **エンジン**:930/66。空冷の水平対向 6 気筒 3,299 cc、1 気筒に排気弁 1 本、KKK K27 が 1 個。欧州仕様は触媒なし。
- **弁**:排気弁 41.5 mm(交換品の一覧から)、リフト 10 mm(見積もり)、作用角 約 280°(1 mm での 50° BBDC / 18° ATDC からの見積もり)。今の 1989 年型の定義と同じ出どころ。
  - 径:形式の決まりの式(`本数 × min(π·d·リフト, π·d²/4)`)で、面積の等しい円の径。リフトが径の 1/4(10.4 mm)に届かないので **40.7 mm**。
  - 開き:280 ÷ 720 = **0.3889**。
- **集合(ヒートエクスチェンジャー)**:純正の部品図(202-10、202-05)では、バンクごとに平たい胴が 1 つあり、3 つの排気の口から短い枝が立って、その胴に順に入る。
  3 本が別々に走って 1 か所で合わさる形(3-into-1)ではない。**959 と同じ書き方**(短い枝 0.10 m が、0.12 m おきに 1 本の管へ順に入る。気筒の間隔は 959 と同じ 118 mm)。
  胴の中は見ていない。枝の内径は 38 mm(今の 1989 年型の定義の値)、胴の内径は 50 mm(置いた値)。
- **左右をつなぐ管とタービンへの管**(202-05、202-15):右のバンクから左へ管が渡り、左で合わさって、J 字の管でタービン(左寄り)に入る。
  胴の端からタービンまで、**左 約 0.60 m、右 約 1.18 m**。左右の差(約 0.58 m)は、エンジンの幅ぶんで、ここが音の低い成分を決めている。内径 50 mm(置いた値)。
  右から左へ渡る管が、エンジンのどちら側を通るかは図だけでは決めきれず、持ち主の掲示板の書き込み(後ろ側で渡る)に従った。
- **タービン**:KKK K27。喉の径 36 mm(今の 1989 年型の定義の値)。ウェイストゲートと、その小さい消音器・出口は書かない(ほかのターボ車と同じ)。
- **タービンの後ろ**(202-15 の欧州の形):触媒が無く、タービンの出口から短い管(約 0.20 m、内径 60 mm と置く)で、後ろの横置きの消音器(胴 約 0.74 m × 200 mm、23 L)に入る。
  テールは 2 本(約 0.30 m、内径 55 mm と置く)。タービンの後ろから出口まで、合わせて 約 1.24 m。
- **気筒の番号**:左のバンクが 1・2・3、右が 4・5・6(1 番と 4 番が前)。点火順 1-6-2-4-3-5。前後は監査役の記憶で、逆でも、枝が胴に入る順が入れ替わるだけ。

### 3.2 定義(K が E5 として聴いて決めた形)

決まり(MF-3)のとおり:管の長さは実車の値を 2 cm きざみで、管の径は実車の内径の 1.14 倍、タービンは喉 0.08 m と小部屋 0.12 m × 150 mm、
ターボ車の膨張室は 1 個でウール 0.02 m、同じ形の 2 本は面積を合わせた 1 本(テール 2 本 → 55 × 1.14 × √2 = 89 mm)。

膨張室の大きさと位置は耳で決めた。**タービンの後ろから出口までの長さ(1.24 m)と、箱の容積(23.2 L。排気量の 7.0 倍)は実車のまま**にして、箱を短く太く(0.74 m × 200 mm → 0.42 m × 265 mm)、
短くした分だけ箱の手前の管を長く(0.20 → 0.52 m)してある。テールは実車の 0.30 m のまま。

```json
"exhaust": {
  "valve": {"diameter": 0.0407, "open": 0.3889},
  "primaries": [
    {"length": 0.1, "diameter": 0.043, "to": 0},
    {"length": 0.1, "diameter": 0.043, "to": 5},
    {"length": 0.1, "diameter": 0.043, "to": 2},
    {"length": 0.1, "diameter": 0.043, "to": 1},
    {"length": 0.1, "diameter": 0.043, "to": 4},
    {"length": 0.1, "diameter": 0.043, "to": 3}
  ],
  "pipes": [
    {"length": 0.12, "diameter": 0.057, "from": 0, "to": 2},
    {"length": 0.12, "diameter": 0.057, "from": 2, "to": 4},
    {"length": 0.12, "diameter": 0.057, "from": 4, "to": 6},
    {"length": 0.12, "diameter": 0.057, "from": 1, "to": 3},
    {"length": 0.12, "diameter": 0.057, "from": 3, "to": 5},
    {"length": 0.12, "diameter": 0.057, "from": 5, "to": 7},
    {"length": 0.6, "diameter": 0.057, "from": 6, "to": 8},
    {"length": 1.18, "diameter": 0.057, "from": 7, "to": 8},
    {"length": 0.08, "diameter": 0.036, "from": 8, "to": 9},
    {"length": 0.12, "diameter": 0.15, "from": 9, "to": 10},
    {"length": 0.52, "diameter": 0.068, "from": 10, "to": 11},
    {"length": 0.42, "diameter": 0.265, "from": 11, "to": 12, "wool": 0.02},
    {"length": 0.3, "diameter": 0.089, "from": 12, "to": null}
  ]
}
```

- 一次管は点火順(1-6-2-4-3-5)に並べてある。左のバンクは継ぎ目 0 → 2 → 4 → 6、右は 1 → 3 → 5 → 7 と進み、6 と 7 から左右の管が継ぎ目 8(タービンの入口)で合わさる。
- `firingPhases` は今のまま(6 等分)。`cycleRevolutions` も今のまま。
- `metadata.note` を書き直す。「Provisional」の文を消し、3.1 の出どころを書く。**部品図からの見積もりと、置いた値(管の内径)は、そう書く。**
  「膨張室の大きさと位置、管の太さの 1.14 倍、ウール 20 mm は、K が耳で決めた(2026-11-22)。タービンの後ろから出口までの長さと箱の容積は実車の見積もりのまま」と書く。
- `docs/calibration.md` の「Exhaust topologies」の表に、`911_TURBO_3_3_1986` の行を足す(MF-3 で直した表の形で。959 の行にならう)。
- 整数比の検査で当たるのは、実車の長さどうし(0.10 m の枝・0.12 m の胴・0.60 m の管・0.30 m のテール)と、決まりのタービンの小部屋 0.12 m だけ。そのまま残す。

### 3.3 照らし合わせの数(目安。合格の線ではない)

- ウールの棚(`woolShelf`、0.42 m × 0.265 m、`wool` 0.02):A = 1.839、fp = 969 Hz。
  24 kHz の `[b0, b1, a1]` = 0.223434, 0.002683, −0.773883。48 kHz = 0.201380, −0.082001, −0.880621。
- 監査役の写しのカーネルで、6,120 rpm(レッドラインの 90 %)に固定して全開、始めの 1 秒を捨てた後の 4 秒。
  カーネルの出力の実効値 / 頂点 ÷ 実効値(dB):24 kHz で −93.7 / 10.4、48 kHz で −92.3 / 10.7。
- 同じ条件の次数(24 kHz):3 次(153 Hz、片バンクの高さ)が一番強く、6 次(306 Hz、点火の高さ)はそれより 22 dB くらい低い。
- 写しは ES-2 より前の物。1 dB くらいの差は気にしない。3 dB 以上違う時は、定義の読み違いを疑い、まず棚の係数を合わせる。

## 4. 車両(MF-6a。`content/vehicles/911_TURBO_3_3_1986.json` と一覧)

### 4.1 直す値

| 項目 | 今 | 直す値 | 出どころ |
| --- | --- | --- | --- |
| `physicsAnchor.market` | `"US"` | `"Europe"` | K の決め(`modelYear` は `"1986"` のまま) |
| `torqueCurve` 950 rpm | 120.64 | **137.6** | 見積もり(今の線と同じ割合。120.64 × 430 ÷ 377) |
| `torqueCurve` 2 点目 | 2,000 rpm・177.19 | **3,000 rpm・342** | 見積もり。過給の立ち上がりの終わりに置く(下に書く) |
| `torqueCurve` 4,000 rpm | 377 | **430** | 930/66 の最大トルク 430 Nm / 4,000 rpm |
| `torqueCurve` 5,500 rpm | 365.1085 | **383.099766** | 300 PS = 220.649625 kW / 5,500 rpm からの計算 |
| `torqueCurve` 6,800 rpm | 271.507957 | **284.886916** | 見積もり(今の線と同じ割合。383.099766 × 271.507957 ÷ 365.1085) |

```json
"torqueCurve": [
  {"rpm": 950, "torqueNewtonMeters": 137.6},
  {"rpm": 3000, "torqueNewtonMeters": 342},
  {"rpm": 4000, "torqueNewtonMeters": 430},
  {"rpm": 5500, "torqueNewtonMeters": 383.099766},
  {"rpm": 6800, "torqueNewtonMeters": 284.886916}
]
```

- 2 点目について:930 の 3.3 のトルクの線図や回転数ごとの表は見つからなかった。あるのは持ち主の書き込みの過給圧だけ
  (2,200〜2,400 rpm より下はほぼ過給なし、3,000 rpm で 0.5 bar まで、3,600〜4,000 rpm で 0.8 bar)。
  そこから監査役が推した値(US の 282 hp 仕様で 3,000 rpm・約 300 Nm)を、最大トルクの比(430 ÷ 377)で欧州仕様に当てた。**資料の値ではない。文書にも見積もりと書く。**

### 4.2 変えない物(調べ直した。報告に書く)

- `mass` 1410(1,335 kg + 運転者)、`yawInertia`、`pitchInertia`、ブレーキ:基準の車重 1,335 kg は欧州仕様の値。そのまま。(北米仕様は 1,350 kg。こちらは使わない。)
- `gearRatios` 2.25 / 1.304 / 0.893 / 0.625、`finalDriveRatio` 4.222(9:38):4 速の箱 930/36 の比。1986 年型の欧州仕様も同じ箱。
- `compressionRatio` 7、`displacementCc` 3299、全長 4.291、幅 1.775、高さ 1.31、軸距 2.272、トレッド 1.432 / 1.501、タイヤの半径:資料と合っている。
  後ろの 9J のホイールと 245/45VR16 は 1986 年型から。全長は、US と欧州で分かれた値が見つかっていない。
- `redlineRpm` 6800、`idleRpm` 950:回転計の赤の資料は無い。今の値のまま。
- 一覧の `period` `"1986"`、`selectedSpecification` `["4MT"]`、`identifier`。

### 4.3 文書と台帳

- `docs/chase-turbo-vehicles.md`:「Fixed identities」の表の行を「1986 MY European 911 Turbo 3.3 Coupe」「3299 cc air-cooled turbo flat six (930/66, 300 PS); 4MT」に。
  年式と仕向地は、原作についての事実の主張としてではなく、K の決めとして書く(原作の車を 1986 年型・欧州仕様と決められる描写は無い)。
  「まだギヤ比の表が無い車」の文があれば、930 を外す(箱の型式ごとの比が確かめられた)。
- `docs/chase-turbo-vehicles/` の台帳と測った表を、道具で作り直すか、今のやり方で直す。
- 「Evidence actually consulted」に、8. の出どころを足す。
- `docs/calibration.md`:トレッドと圧縮比の表に `911_TURBO_3_3_1986` の行が無ければ足す(MF-6c で 1989 年型の行を消すので)。

### 4.4 測り直し(MF-6a)

- `content/engine-loudness/default.json` の `911_TURBO_3_3_1986` の項目を測り直す。ほかの車両の項目は変わらないはず。変わったら止まる。
- `tests/audio/exhaust-render.values.json` の `911_TURBO_3_3_1986` の値を作り直す。ほかの音の値は変わらないはず。変わったら止まる。
- `tools/build/chase-turbo-validation.ts` とテストが、この車の数を決め打ちしている所は、新しい値で書き直す。
  0–100 km/h や最高速を資料の数に合わせる事はしない(K の決め)。テストの意味が変わる所があれば、止まって K に聞く。

## 5. 絵(MF-6b)

### 5.1 写真の絵を 1986 年型の絵にする

- `content/vehicle-picture-sources/911-turbo-3-3.json` と 4 枚の写真(`-top`・`-front`・`-side`・`-rear`)を、`911-turbo-3-3-1986` の名前に変える。レシピの `vehicle` を `911_TURBO_3_3_1986` に。
- `content/sprites/911-turbo-3-3-1986.json` を、写真からの絵で置き換える(今の手続きの形の中身は捨てる)。`content/sprites/911-turbo-3-3.json` は消す。
  絵の作り方は今のまま(`docs/image-assets.md` の Vehicle picture generator、`npm run pictures -- 911-turbo-3-3-1986`)。
- 絵を作る道具が車両の定義(全長、軸距、タイヤの半径など)を読むなら、1986 年型の定義で作り直す。絵が変わったら、どこがどれだけ変わったかを報告に書く。
  定義を読まないなら、絵は 1 画素も変わらないはず。
- **元の 4 面の写真とレシピの数は変えない。** 写真の車と 1986 年型の欧州仕様との細かい違い(ホイール、バンパーの当て物、灯火)は直さない。
  K の確かめで気になる所が出たら、別の段階にする。
- 4 色(`silver`・`black`・`red`・`white`)と、ブレーキランプの決めは、今の `911-turbo-3-3` の物をそのまま。

### 5.2 一覧の見た目(`content/vehicle-listings/911_TURBO_3_3_1986.json`)

- `visuals` を、今の 1989 年型の一覧の物にする(`spriteSet` だけ `911-turbo-3-3-1986`):
  `"palette": "silver"`、`"steeringPicture": "prototipo"`、`"colorNames": { "silver": "SILVER", "black": "BLACK", "red": "GUARDS RED", "white": "GP WHITE" }`。
- `engine` を `"F6T"` に(今は `"F6"`。ターボの車はほかも `T` を付けている)。
- `selectionOrder` は、MF-6c で 1989 年型を消す時に、その 2 を引き継ぐ(今は 35。35 は空く。ほかの車両の順は詰めない)。

### 5.3 手続きの形を消す

- `tools/graphics/chase-turbo-shapes.ts` から 911 を外す(959 の時と同じ:台帳の手続きの形は、もうこの車を描かない)。
- `docs/chase-turbo-vehicles/` の `911-turbo-3-3-1986*.png`(手続きの形の絵と LOD と色の見本)、`review.json` の `sprite`、`validation.md` の絵の行を、959 の時と同じ扱いにする。
- 色の名前 `stock`・`blue` で、この車を名指ししている所があれば:`stock` は `silver` に直す。`blue` があれば止まって K に聞く。
  (監査役が読んだ限り、OUT RUN と TURBO OUTRUN の交通は色を名指ししていない。)
- OUT RUN と TURBO OUTRUN の交通の 911 は、写真の絵になる。見た目が変わる事を報告に書く。

## 6. 1989 年型を消して置き換える(MF-6c)

### 6.1 消す物

- `content/vehicles/911_TURBO_3_3.json`、`content/vehicle-listings/911_TURBO_3_3.json`、`content/engine-sounds/911_TURBO_3_3.json`。
- `content/engine-loudness/default.json` と `tests/audio/exhaust-render.values.json` の `911_TURBO_3_3` の項目。
- `docs/calibration.md` の `911_TURBO_3_3` の行(トレッド、圧縮比、排気の形の 3 つの表)。

### 6.2 置き換える物

- `content/series/tsukuba-clubman.series.json` の 911 CUP:`vehicles` と 16 の `entries` の `vehicle` を `911_TURBO_3_3_1986` に。色(`silver`・`black`・`red`・`white`)、枠、周回数、`timeMargin` は変えない。
- `content/racing-lines/tsukuba.json` と `content/reference-times/tsukuba.json`:`911_TURBO_3_3` の項目を、`911_TURBO_3_3_1986` で**今の手順で作り直す**(4 速、ギヤも重さの配分もタイヤも違う車なので、数は変わる)。
  ほかの車両の項目は変わらないはず。変わったら止まる。
- `tests/scenarios/run-rules.series.json` と、TSUKUBA の走行シナリオで 911 TURBO 3.3 を自車にしているテスト(`docs/development.md` の表にある物):車両を `911_TURBO_3_3_1986` に。
  決め打ちの数(周回の時間、順位が入れ替わる時刻など)は、新しい車で測り直して書き直す。**テストが確かめている事(GOAL に着く、順位、止まる・止まらない)は変えない。**
  新しい車でその事が成り立たなくなるテストがあれば、止まって K に聞く。
- 文書(`docs/NEXT.md`、`docs/content-and-gameplay.md`、`docs/development.md`、`docs/image-assets.md`):今の事を書いている所の ID、絵の組の名前、例の JSON、命令の例、
  「1989」「5 速」「G50」を直す。`docs/NEXT.md` に、この段階の記録を今の書き方で足す。
- TSUKUBA CLUBMAN の説明文(「A late-'80s club meeting …」)は変えない。

### 6.3 確かめ

- 911 CUP が 16 台で始まり、終わる事。自車が 4 速で走れる事(HUD のギヤの表示、AT と MT)。
- AI の 911 が、作り直した走行ラインと基準の時間で、今までと同じように 1 周できる事(コースアウトや止まったままが無い事)。
- 保存したデータ(記録、選んだ車両)が `911_TURBO_3_3` を名指ししている時の扱いは、今までに車両を消した時(NSR500 の 1987 年型、MF-3c)と同じにする。

## 7. K の確かめ

- K は、空ぶかしのページ(監査役の道具)で E5 を聴いて決めた。実装の後、ゲームで 911 TURBO を聴いて確かめる。MID(24 kHz)で作り、HIGH(48 kHz)で確かめる。
- 911 CUP を 1 回走る(4 速のつながり、AI の速さ、絵)。OUT RUN で交通の 911 の絵を見る。

## 8. 出どころ

- Porsche 純正の部品図(930.66/68 のエンジン用、1987〜89 年の図。1986 年型と同じ型式):
  ヒートエクスチェンジャー https://www.design911.com/uploads/images/diagrams/diagrams/911_1989_2_02_202-10.jpg
  タービンへの管、ウェイストゲート、触媒(US)、消音器 https://www.design911.com/uploads/images/diagrams/diagrams/911_1989_2_02_202-15.jpg
  ヒートエクスチェンジャーと左右をつなぐ管 https://www.design911.com/uploads/images/diagrams/diagrams/911_1989_2_02_202-05.jpg
- 欧州仕様の諸元(300 PS / 5,500 rpm、430 Nm / 4,000 rpm、車重 1,335 kg、全長 4,291 mm、軸距 2,272 mm、930.66):
  https://www.auto-data.net/en/porsche-911-coupe-type-930-3.3-turbo-300hp-manual-5-speed-6654
  https://www.ultimatespecs.com/de/car-specs/Porsche/239048/Porsche-911-Coupe-(911-series)-33-Turbo-4-speed.html
- 1986 年型の欧州向けの実車が M930/66 のエンジンと 930/36 の箱である事(売り物の車の記録):https://www.classicdriver.com/de/car/porsche/911-turbo/1986/1085571
- 年式ごと・仕向地ごとの台数(車台番号の範囲からの集計。メーカーの統計ではない):https://www.turbosition.com/en/porsche-930/chassis-numbers
  欧州ほか向けのクーペ:1978 年 735、1979 年 820、1980 年 840、1981 年 698、1982 年 938、1983 年 1,015、1984 年 804、1985 年 1,063、**1986 年 1,158**、1987 年 720、1988 年 677、1989 年 857。
  (1986 年型の US 向けは 1,424、カナダ向けは 88。同じ表に、明らかにおかしい行がほかにある。1 台単位で確かな数ではない。)
- 弁の径、リフト、作用角、一次管の内径、K27 の喉:今の `content/engine-sounds/911_TURBO_3_3.json` の `metadata.note` と `docs/calibration.md` の値(消す前に 1986 年型の `note` へ写す)。
- 過給の立ち上がり(回転数ごとの過給圧)、左右をつなぐ管の通り道、US と欧州の見た目の違い:持ち主の掲示板の書き込み(監査役が 2026-11-22 に調べた。1986 年型だけを名指しした資料ではない)。
- K のメモ(2026-11-22。原作の車の同定と、1986 年型の仕様の選定)。

## 9. 報告に書く事

- 3.3 の数との照らし合わせ。
- 絵が変わったかどうか(5.1)、OUT RUN・TURBO OUTRUN の交通の見た目(5.3)。
- TSUKUBA の 911 の基準の時間が、1989 年型からどれだけ変わったか(6.2)。書き直したテストの数と、その前後。
- 分かっていない所(直さない):
  - 左右の管の長さ(部品図からで ± 25 %。左右の差だけは、エンジンの幅で決まるので確か)。右から左へ渡る管の通り道。
  - タービンの後ろの管の実車の長さ(約 0.20 m は粗い見積もり。0.15〜0.25 m)と、消音器の中の通り道。
  - ヒートエクスチェンジャーの胴の中で、枝がどう入るか(外からの図でしか見ていない)。管の内径(置いた値)。気筒の番号の前後。
  - トルクの線の 3 点(950、3,000、6,800 rpm)。最大トルクを 412 Nm と書く資料がある事(1978〜82 年型の 930/60 の値と見た)。
  - レッドライン。台数の集計の確かさ。写真の絵が 1986 年型の欧州仕様と細かい所で同じかどうか。

## 10. しない事、止まる所

- 911 TURBO のほかの車の定義に触らない。カーネルの式に触らない。
- 弁の値、管の長さと径、ウールの厚み、トルクの線を、ここに書いた値から動かさない(動かしたい時は K に聞く)。
- 元の 4 面の写真を描き直さない。色を足さない。
- 止まる所:MF-3 が main に入っていない時。ほかの車の音量、音の値、走行ライン、基準の時間が変わった時。
  テストの意味が変わる時(4.4、6.2)。色の `blue` を名指ししている所があった時(5.3)。
  管の本数や継ぎ目の形を、形式と解き手が受け付けない時。保存したデータの扱いが、今までのやり方で決まらない時(6.3)。
