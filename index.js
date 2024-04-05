const fs = require('fs');
const iconv = require('iconv-lite');
const readline = require('readline');
const path = require('path');

// CSVファイルのディレクトリパス
const csvDirectoryPath = 'csv/';

// CSVファイルのパス一覧を取得
const csvFiles = fs.readdirSync(csvDirectoryPath);

// コンソールからの入力を受け付ける
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// コンソールからの入力を処理
rl.question('検索したい都道府県はどこですか？: ', (prefecture) => {
  // 都道府県に合致するCSVファイルを探す
  const csvFilePath = csvFiles.find(file => {
    const csvData = fs.readFileSync(path.join(csvDirectoryPath, file));
    const utf8Data = iconv.decode(csvData, 'Shift_JIS');
    const csvArray = utf8Data.split(/\r?\n/).map(line => line.split(','));
    // 先頭4行までを見て、部分一致するものがあればそのCSVファイルを選択する
    for (let i = 0; i < 4; i++) {
      if (csvArray[i].some(element => element.includes(prefecture))) {
        return true;
      }
    }
    return false;
  });

  if (!csvFilePath) {
    console.log('指定された都道府県のデータが見つかりませんでした。');
    rl.close();
    return;
  }

  // CSVファイルを読み込む
  const csvData = fs.readFileSync(path.join(csvDirectoryPath, csvFilePath));
  const utf8Data = iconv.decode(csvData, 'Shift_JIS');
  const csvArray = utf8Data.split(/\r?\n/).map(line => line.split(','));

  // 検索する日付を入力してもらう
  rl.question('検索する日付を入力してください（例: 1/1）: ', (searchDate) => {
    // 入力された日付と一致する行のみを取得
    const matchingRows = csvArray.filter(row => {
      const dateParts = row[0].split('/');
      return dateParts[1] === searchDate.split('/')[0] && dateParts[2] === searchDate.split('/')[1];
    });

    // 「晴、雨、曇、雪」の出現回数を数える
    const weatherCounts = {
      '晴': 0,
      '雨': 0,
      '曇': 0,
      '雪': 0
    };

    for (const row of matchingRows) {
      for (let i = 1; i < row.length; i++) {
        if (row[i].includes('晴')) {
          weatherCounts['晴']++;
        }
        if (row[i].includes('雨')) {
          weatherCounts['雨']++;
        }
        if (row[i].includes('曇')) {
          weatherCounts['曇']++;
        }
        if (row[i].includes('雪')) {
          weatherCounts['雪']++;
        }
      }
    }

    // 最も出現回数の多い天候を見つける
    let mostCommonWeather = '';
    let highestCount = 0;

    for (const [weather, count] of Object.entries(weatherCounts)) {
      if (count > highestCount) {
        mostCommonWeather = weather;
        highestCount = count;
      }
    }

    // 最も多い天候を表示
    console.log('最も多い天候:', mostCommonWeather);

    // 雨の出現回数が10回を超えるかどうかをチェック
    if (mostCommonWeather === '雨') {
      if (weatherCounts['雨'] > 10) {
        console.log('雨の確率が高いです');
      } else {
        console.log('傘を持ってください');
      }
    }

    // 雪の出現回数が3回以上の場合は、雪が降った年が多いと表示
    if (weatherCounts['雪'] >= 3) {
      console.log('雪が降った年が多いです');
    }

    // readline インターフェースを閉じる
    rl.close();
  });
});
