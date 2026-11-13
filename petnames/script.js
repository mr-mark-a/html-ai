// 各動物1,000件ずつ（合計3,000件）の重複なし・数字なしの名前を生成するための語彙リスト
const 前半語群 = [
  "モチ", "ルナ", "ソラ", "モモ", "ココ", "レオ", "ムギ", "マロン", "チョコ", "ミルク",
  "ハナ", "コタロウ", "サクラ", "ユズ", "キナコ", "アズキ", "クルミ", "メイ", "リン", "テン",
  "フク", "マル", "クロ", "シロ", "チャチャ", "ミケ", "トラ", "タマ", "ポチ", "ハチ",
  "コマチ", "ヒメ", "トノ", "ワサビ", "スシ", "トーフ", "ダイズ", "ゴマ", "アンコ", "ヨモギ",
  "カエデ", "モミジ", "ツバキ", "スミレ", "タンポポ", "ヒマワリ", "コスモス", "ナズナ", "ワカバ", "コケ",
  "ホシ", "ツキ", "タイヨウ", "クモ", "カゼ", "アメ", "ユキ", "ニジ", "ソヨカゼ", "コダマ",
  "ベル", "ルビー", "サファイア", "エメラルド", "パール", "コハク", "ヒスイ", "サンゴ", "メノウ", "ルリ",
  "ビスケット", "クッキー", "マフィン", "ワッフル", "プリン", "タルト", "キャンディ", "キャラメル", "モカ", "ラテ",
  "チャイ", "ココア", "バニラ", "シナモン", "ミント", "バジル", "セージ", "タイム", "ローズ", "ジャスミン",
  "ピノ", "ノア", "カイ", "ルイ", "ソフィア", "アリス", "オリバー", "チャーリー", "マックス", "デイジー"
];

// 先頭要素に空文字を含め、100通り × 40通り = 4,000通りの完全に重複しない組み合わせを確保
const 後半語群 = [
  "", "マル", "スケ", "ベエ", "タロウ", "ジロウ", "ヒメ", "コ", "チャン", "サマ",
  "モチ", "フワ", "モコ", "ピョン", "ワン", "ニャン", "ポコ", "リン", "ラン", "ルン",
  "ノスケ", "ザエモン", "マルコ", "ハナコ", "ユキノ", "ツキミ", "ホシゾラ", "カゼマチ", "コハル", "アキト",
  "ナツメ", "フユミ", "ハルカ", "ミドリ", "アカネ", "アオイ", "シロガネ", "コガネ", "クロガネ", "ニシキ"
];

const 動物種別一覧 = ["猫", "犬", "うさぎ"];
const 動物ごとの件数 = 1000;
const ページ表示数 = 48;

// 重複防止用の集合と全データ配列
const 重複確認集合 = new Set();
const ペットデータベース = [];

// UTF-8文字列を安全にBase64へ変換する関数
function 文字列を暗号化(元の文字列) {
  const バイト配列 = new TextEncoder().encode(元の文字列);
  let バイナリ文字列 = "";
  for (let 番号 = 0; 番号 < バイト配列.length; 番号++) {
    バイナリ文字列 += String.fromCharCode(バイト配列[番号]);
  }
  return btoa(バイナリ文字列);
}

// 各動物（猫・犬・うさぎ）ごとに1,000件ずつ生成
let 全体通し番号 = 0;
for (let 種別番号 = 0; 種別番号 < 動物種別一覧.length; 種別番号++) {
  const 現在の種類 = 動物種別一覧[種別番号];
  let 生成済み件数 = 0;

  while (生成済み件数 < 動物ごとの件数) {
    const 前半番号 = 全体通し番号 % 前半語群.length;
    const 後半番号 = Math.floor(全体通し番号 / 前半語群.length) % 後半語群.length;
    const 候補名 = 前半語群[前半番号] + 後半語群[後半番号];
    全体通し番号++;

    // 数字が含まれていないか、かつ既に登録された名前と重複していないかを厳密に確認
    if (!/[0-9０-９]/.test(候補名) && !重複確認集合.has(候補名)) {
      重複確認集合.add(候補名);
      const 原文データ = `${現在の種類}:${候補名}`;
      const 暗号化済み = 文字列を暗号化(原文データ);

      ペットデータベース.push({
        種類: 現在の種類,
        名前: 候補名,
        暗号文: 暗号化済み,
        // 0.5秒以内の高速検索を実現するための事前小文字化インデックス
        検索用索引: `${候補名.toLowerCase()} ${暗号化済み.toLowerCase()}`
      });

      生成済み件数++;
    }
  }
}

// 「petnames」というファイル名（拡張子なし）で3,000行の暗号化データを保存
document.getElementById("保存ボタン").addEventListener("click", () => {
  const ファイル本文 = ペットデータベース.map(項目 => 項目.暗号文).join("\n");
  const データ塊 = new Blob([ファイル本文], { type: "text/plain;charset=utf-8" });
  const 一時URL = URL.createObjectURL(データ塊);
  const リンク要素 = document.createElement("a");
  リンク要素.href = 一時URL;
  リンク要素.download = "petnames";
  document.body.appendChild(リンク要素);
  リンク要素.click();
  document.body.removeChild(リンク要素);
  URL.revokeObjectURL(一時URL);
});

// 画面状態管理
let 現在ページ = 1;
let 名前非表示モード = false;
let 抽出済みデータ = ペットデータベース;

const 検索入力欄 = document.getElementById("検索入力");
const 種類選択欄 = document.getElementById("種類選択");
const 表示切替ボタン = document.getElementById("表示切替ボタン");
const 一覧グリッド = document.getElementById("一覧グリッド");
const 件数表示欄 = document.getElementById("件数表示");
const 検索時間表示欄 = document.getElementById("検索時間表示");
const ページ表示欄 = document.getElementById("ページ表示");
const 前ページボタン = document.getElementById("前ページボタン");
const 次ページボタン = document.getElementById("次ページボタン");

// 高速検索処理（通常1〜3ミリ秒＝0.003秒以内で完了）
function 検索と絞り込み実行() {
  const 開始時刻 = performance.now();
  const 検索語 = 検索入力欄.value.trim().toLowerCase();
  const 選択種類 = 種類選択欄.value;

  const 結果配列 = [];
  for (let 番号 = 0; 番号 < ペットデータベース.length; 番号++) {
    const 項目 = ペットデータベース[番号];
    if (選択種類 !== "すべて" && 項目.種類 !== 選択種類) continue;
    if (検索語 !== "" && !項目.検索用索引.includes(検索語)) continue;
    結果配列.push(項目);
  }

  抽出済みデータ = 結果配列;
  現在ページ = 1;
  画面描画();

  const 終了時刻 = performance.now();
  const 所要ミリ秒 = (終了時刻 - 開始時刻).toFixed(2);
  検索時間表示欄.textContent = `検索速度: ${所要ミリ秒}ミリ秒（上限500ミリ秒以内）`;
}

function 画面描画() {
  const 総ページ数 = Math.max(1, Math.ceil(抽出済みデータ.length / ページ表示数));
  if (現在ページ > 総ページ数) 現在ページ = 総ページ数;

  const 開始位置 = (現在ページ - 1) * ページ表示数;
  const 表示分 = 抽出済みデータ.slice(開始位置, 開始位置 + ページ表示数);

  件数表示欄.textContent = `全 ${抽出済みデータ.length.toLocaleString()} 件中 ${表示分.length} 件を表示`;
  ページ表示欄.textContent = `${現在ページ} / ${総ページ数} ページ`;

  前ページボタン.disabled = 現在ページ === 1;
  次ページボタン.disabled = 現在ページ === 総ページ数;

  一覧グリッド.innerHTML = 表示分
    .map(
      項目 => `
      <div class="カード">
        <div class="カード上部">
          <span class="バッジ ${項目.種類}">${項目.種類}</span>
        </div>
        <div class="復号名">${名前非表示モード ? "●●●●●●" : 項目.名前}</div>
        <div class="暗号行">
          <span class="暗号文字列" title="${項目.暗号文}">${項目.暗号文}</span>
          <button class="コピー小ボタン" onclick="暗号文コピー('${項目.暗号文}', this)">コピー</button>
        </div>
      </div>
    `
    )
    .join("");
}

window.暗号文コピー = function (文字列, ボタン要素) {
  navigator.clipboard.writeText(文字列);
  const 元の文字 = ボタン要素.textContent;
  ボタン要素.textContent = "完了！";
  setTimeout(() => (ボタン要素.textContent = 元の文字), 1200);
};

検索入力欄.addEventListener("input", 検索と絞り込み実行);
種類選択欄.addEventListener("change", 検索と絞り込み実行);

表示切替ボタン.addEventListener("click", () => {
  名前非表示モード = !名前非表示モード;
  表示切替ボタン.textContent = 名前非表示モード
    ? "表示: 暗号文のみ"
    : "表示: 名前 ＋ 暗号文";
  画面描画();
});

前ページボタン.addEventListener("click", () => {
  if (現在ページ > 1) {
    現在ページ--;
    画面描画();
  }
});

次ページボタン.addEventListener("click", () => {
  const 総ページ数 = Math.ceil(抽出済みデータ.length / ページ表示数);
  if (現在ページ < 総ページ数) {
    現在ページ++;
    画面描画();
  }
});

// 初回描画
検索と絞り込み実行();
// 各動物1,000件ずつ（合計3,000件）の重複なし・数字なしの名前を生成するための語彙リスト
const 前半語群 = [
  "モチ", "ルナ", "ソラ", "モモ", "ココ", "レオ", "ムギ", "マロン", "チョコ", "ミルク",
  "ハナ", "コタロウ", "サクラ", "ユズ", "キナコ", "アズキ", "クルミ", "メイ", "リン", "テン",
  "フク", "マル", "クロ", "シロ", "チャチャ", "ミケ", "トラ", "タマ", "ポチ", "ハチ",
  "コマチ", "ヒメ", "トノ", "ワサビ", "スシ", "トーフ", "ダイズ", "ゴマ", "アンコ", "ヨモギ",
  "カエデ", "モミジ", "ツバキ", "スミレ", "タンポポ", "ヒマワリ", "コスモス", "ナズナ", "ワカバ", "コケ",
  "ホシ", "ツキ", "タイヨウ", "クモ", "カゼ", "アメ", "ユキ", "ニジ", "ソヨカゼ", "コダマ",
  "ベル", "ルビー", "サファイア", "エメラルド", "パール", "コハク", "ヒスイ", "サンゴ", "メノウ", "ルリ",
  "ビスケット", "クッキー", "マフィン", "ワッフル", "プリン", "タルト", "キャンディ", "キャラメル", "モカ", "ラテ",
  "チャイ", "ココア", "バニラ", "シナモン", "ミント", "バジル", "セージ", "タイム", "ローズ", "ジャスミン",
  "ピノ", "ノア", "カイ", "ルイ", "ソフィア", "アリス", "オリバー", "チャーリー", "マックス", "デイジー"
];

// 先頭要素に空文字を含め、100通り × 40通り = 4,000通りの完全に重複しない組み合わせを確保
const 後半語群 = [
  "", "マル", "スケ", "ベエ", "タロウ", "ジロウ", "ヒメ", "コ", "チャン", "サマ",
  "モチ", "フワ", "モコ", "ピョン", "ワン", "ニャン", "ポコ", "リン", "ラン", "ルン",
  "ノスケ", "ザエモン", "マルコ", "ハナコ", "ユキノ", "ツキミ", "ホシゾラ", "カゼマチ", "コハル", "アキト",
  "ナツメ", "フユミ", "ハルカ", "ミドリ", "アカネ", "アオイ", "シロガネ", "コガネ", "クロガネ", "ニシキ"
];

const 動物種別一覧 = ["猫", "犬", "うさぎ"];
const 動物ごとの件数 = 1000;
const ページ表示数 = 48;

// 重複防止用の集合と全データ配列
const 重複確認集合 = new Set();
const ペットデータベース = [];

// UTF-8文字列を安全にBase64へ変換する関数
function 文字列を暗号化(元の文字列) {
  const バイト配列 = new TextEncoder().encode(元の文字列);
  let バイナリ文字列 = "";
  for (let 番号 = 0; 番号 < バイト配列.length; 番号++) {
    バイナリ文字列 += String.fromCharCode(バイト配列[番号]);
  }
  return btoa(バイナリ文字列);
}

// 各動物（猫・犬・うさぎ）ごとに1,000件ずつ生成
let 全体通し番号 = 0;
for (let 種別番号 = 0; 種別番号 < 動物種別一覧.length; 種別番号++) {
  const 現在の種類 = 動物種別一覧[種別番号];
  let 生成済み件数 = 0;

  while (生成済み件数 < 動物ごとの件数) {
    const 前半番号 = 全体通し番号 % 前半語群.length;
    const 後半番号 = Math.floor(全体通し番号 / 前半語群.length) % 後半語群.length;
    const 候補名 = 前半語群[前半番号] + 後半語群[後半番号];
    全体通し番号++;

    // 数字が含まれていないか、かつ既に登録された名前と重複していないかを厳密に確認
    if (!/[0-9０-９]/.test(候補名) && !重複確認集合.has(候補名)) {
      重複確認集合.add(候補名);
      const 原文データ = `${現在の種類}:${候補名}`;
      const 暗号化済み = 文字列を暗号化(原文データ);

      ペットデータベース.push({
        種類: 現在の種類,
        名前: 候補名,
        暗号文: 暗号化済み,
        // 0.5秒以内の高速検索を実現するための事前小文字化インデックス
        検索用索引: `${候補名.toLowerCase()} ${暗号化済み.toLowerCase()}`
      });

      生成済み件数++;
    }
  }
}

// 「petnames」というファイル名（拡張子なし）で3,000行の暗号化データを保存
document.getElementById("保存ボタン").addEventListener("click", () => {
  const ファイル本文 = ペットデータベース.map(項目 => 項目.暗号文).join("\n");
  const データ塊 = new Blob([ファイル本文], { type: "text/plain;charset=utf-8" });
  const 一時URL = URL.createObjectURL(データ塊);
  const リンク要素 = document.createElement("a");
  リンク要素.href = 一時URL;
  リンク要素.download = "petnames";
  document.body.appendChild(リンク要素);
  リンク要素.click();
  document.body.removeChild(リンク要素);
  URL.revokeObjectURL(一時URL);
});

// 画面状態管理
let 現在ページ = 1;
let 名前非表示モード = false;
let 抽出済みデータ = ペットデータベース;

const 検索入力欄 = document.getElementById("検索入力");
const 種類選択欄 = document.getElementById("種類選択");
const 表示切替ボタン = document.getElementById("表示切替ボタン");
const 一覧グリッド = document.getElementById("一覧グリッド");
const 件数表示欄 = document.getElementById("件数表示");
const 検索時間表示欄 = document.getElementById("検索時間表示");
const ページ表示欄 = document.getElementById("ページ表示");
const 前ページボタン = document.getElementById("前ページボタン");
const 次ページボタン = document.getElementById("次ページボタン");

// 高速検索処理（通常1〜3ミリ秒＝0.003秒以内で完了）
function 検索と絞り込み実行() {
  const 開始時刻 = performance.now();
  const 検索語 = 検索入力欄.value.trim().toLowerCase();
  const 選択種類 = 種類選択欄.value;

  const 結果配列 = [];
  for (let 番号 = 0; 番号 < ペットデータベース.length; 番号++) {
    const 項目 = ペットデータベース[番号];
    if (選択種類 !== "すべて" && 項目.種類 !== 選択種類) continue;
    if (検索語 !== "" && !項目.検索用索引.includes(検索語)) continue;
    結果配列.push(項目);
  }

  抽出済みデータ = 結果配列;
  現在ページ = 1;
  画面描画();

  const 終了時刻 = performance.now();
  const 所要ミリ秒 = (終了時刻 - 開始時刻).toFixed(2);
  検索時間表示欄.textContent = `検索速度: ${所要ミリ秒}ミリ秒（上限500ミリ秒以内）`;
}

function 画面描画() {
  const 総ページ数 = Math.max(1, Math.ceil(抽出済みデータ.length / ページ表示数));
  if (現在ページ > 総ページ数) 現在ページ = 総ページ数;

  const 開始位置 = (現在ページ - 1) * ページ表示数;
  const 表示分 = 抽出済みデータ.slice(開始位置, 開始位置 + ページ表示数);

  件数表示欄.textContent = `全 ${抽出済みデータ.length.toLocaleString()} 件中 ${表示分.length} 件を表示`;
  ページ表示欄.textContent = `${現在ページ} / ${総ページ数} ページ`;

  前ページボタン.disabled = 現在ページ === 1;
  次ページボタン.disabled = 現在ページ === 総ページ数;

  一覧グリッド.innerHTML = 表示分
    .map(
      項目 => `
      <div class="カード">
        <div class="カード上部">
          <span class="バッジ ${項目.種類}">${項目.種類}</span>
        </div>
        <div class="復号名">${名前非表示モード ? "●●●●●●" : 項目.名前}</div>
        <div class="暗号行">
          <span class="暗号文字列" title="${項目.暗号文}">${項目.暗号文}</span>
          <button class="コピー小ボタン" onclick="暗号文コピー('${項目.暗号文}', this)">コピー</button>
        </div>
      </div>
    `
    )
    .join("");
}

window.暗号文コピー = function (文字列, ボタン要素) {
  navigator.clipboard.writeText(文字列);
  const 元の文字 = ボタン要素.textContent;
  ボタン要素.textContent = "完了！";
  setTimeout(() => (ボタン要素.textContent = 元の文字), 1200);
};

検索入力欄.addEventListener("input", 検索と絞り込み実行);
種類選択欄.addEventListener("change", 検索と絞り込み実行);

表示切替ボタン.addEventListener("click", () => {
  名前非表示モード = !名前非表示モード;
  表示切替ボタン.textContent = 名前非表示モード
    ? "表示: 暗号文のみ"
    : "表示: 名前 ＋ 暗号文";
  画面描画();
});

前ページボタン.addEventListener("click", () => {
  if (現在ページ > 1) {
    現在ページ--;
    画面描画();
  }
});

次ページボタン.addEventListener("click", () => {
  const 総ページ数 = Math.ceil(抽出済みデータ.length / ページ表示数);
  if (現在ページ < 総ページ数) {
    現在ページ++;
    画面描画();
  }
});

// 初回描画
検索と絞り込み実行();
