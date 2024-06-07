#!/usr/bin/env node

import readline from "readline";
import { getAvailablePrefectures, searchWeatherData } from "./weatherData.js";

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptForPrefecture() {
  const availablePrefectures = getAvailablePrefectures(prefectures);

  if (availablePrefectures.length === 0) {
    console.log("都道府県が記載されているCSVファイルが見つかりませんでした。");
    rl.close();
    return;
  }

  console.log("以下の都道府県から選択してください:");
  availablePrefectures.forEach((prefecture, index) => {
    console.log(`${index + 1}: ${prefecture}`);
  });

  rl.question("検索したい都道府県の番号を入力してください: ", (index) => {
    const prefecture = availablePrefectures[parseInt(index) - 1];
    if (prefecture) {
      searchWeatherData(prefecture, rl);
    } else {
      console.log("無効な選択です。もう一度入力してください。");
      promptForPrefecture();
    }
  });
}

promptForPrefecture();
