import fs from "fs";
import iconv from "iconv-lite";
import path from "path";

const csvDirectoryPath = "csv/";

function readCSVFile(fileName) {
  const csvData = fs.readFileSync(path.join(csvDirectoryPath, fileName));
  const utf8Data = iconv.decode(csvData, "Shift_JIS");
  return utf8Data.split(/\r?\n/).map((line) => line.split(","));
}

export function getAvailablePrefectures(prefectures) {
  if (!fs.existsSync(csvDirectoryPath)) {
    console.log("CSVディレクトリが存在しません。CSVディレクトリを配置してください。");
    process.exit(1);
  }

  const csvFiles = fs.readdirSync(csvDirectoryPath);
  if (csvFiles.length === 0) {
    console.log("CSVファイルが見つかりません。CSVファイルを配置してください。");
    process.exit(1);
  }

  const availablePrefectures = new Set();

  csvFiles.forEach((file) => {
    const csvArray = readCSVFile(file);
    for (let i = 0; i < 4; i++) {
      if (csvArray[i]) {
        csvArray[i].forEach((element) => {
          prefectures.forEach((prefecture) => {
            if (element.includes(prefecture.replace("県", "").replace("府", "").replace("都", ""))) {
              availablePrefectures.add(prefecture);
            }
          });
        });
      }
    }
  });

  return Array.from(availablePrefectures);
}

export function searchWeatherData(prefecture, rl) {
  const csvFiles = fs.readdirSync(csvDirectoryPath);

  const csvFilePath = csvFiles.find((file) => {
    const csvArray = readCSVFile(file);
    for (let i = 0; i < 4; i++) {
      if (csvArray[i] && csvArray[i].some((element) => element.includes(prefecture.replace("県", "").replace("府", "").replace("都", "")))) {
        return true;
      }
    }
    return false;
  });

  if (!csvFilePath) {
    console.log("指定された都道府県のデータが見つかりませんでした。");
    rl.close();
    return;
  }

  const csvArray = readCSVFile(csvFilePath);

  rl.question("検索する日付を入力してください（例: 1/1）\n入力しない場合は今日の日付になります: ", (searchDate) => {
    if (!searchDate) {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      searchDate = `${month}/${day}`;
    }

    if (!searchDate.match(/^\d{1,2}\/\d{1,2}$/)) {
      console.log("日付の形式が正しくありません。再度入力してください。");
      searchWeatherData(prefecture, rl);
      return;
    }

    const matchingRows = csvArray.filter((row) => {
      const dateParts = row[0].split("/");
      return (
        dateParts[1] === searchDate.split("/")[0] &&
        dateParts[2] === searchDate.split("/")[1]
      );
    });

    const weatherCounts = {
      晴: 0,
      雨: 0,
      曇: 0,
      雪: 0,
    };

    for (const row of matchingRows) {
      for (let i = 1; i < row.length; i++) {
        if (row[i].includes("晴")) {
          weatherCounts["晴"]++;
        }
        if (row[i].includes("雨")) {
          weatherCounts["雨"]++;
        }
        if (row[i].includes("曇")) {
          weatherCounts["曇"]++;
        }
        if (row[i].includes("雪")) {
          weatherCounts["雪"]++;
        }
      }
    }

    let mostCommonWeather = "";
    let highestCount = 0;

    for (const [weather, count] of Object.entries(weatherCounts)) {
      if (count > highestCount) {
        mostCommonWeather = weather;
        highestCount = count;
      }
    }

    console.log("最も多い天候:", mostCommonWeather);

    const totalCount = Object.values(weatherCounts).reduce((a, b) => a + b, 0);
    if (
      mostCommonWeather === "雨" &&
      weatherCounts["雨"] / totalCount > 1 / 3
    ) {
      if (weatherCounts["雨"] > 10) {
        console.log("雨の確率が高いです");
      } else {
        console.log("傘を持ってください");
      }
    }

    if (weatherCounts["雪"] >= 1) {
      console.log("雪が降った年があります");
    }

    rl.close();
  });
}
