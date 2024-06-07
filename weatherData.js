import fs from "fs";
import iconv from "iconv-lite";
import path from "path";

const csvDirectoryPath = "csv/";

export function getAvailablePrefectures(prefectures) {
  const csvFiles = fs.readdirSync(csvDirectoryPath);
  const availablePrefectures = new Set();

  csvFiles.forEach((file) => {
    const csvData = fs.readFileSync(path.join(csvDirectoryPath, file));
    const utf8Data = iconv.decode(csvData, "Shift_JIS");
    const csvArray = utf8Data.split(/\r?\n/).map((line) => line.split(","));
    for (let i = 0; i < 4; i++) {
      csvArray[i].forEach((element) => {
        prefectures.forEach((prefecture) => {
          if (element.includes(prefecture.replace("県", "").replace("府", "").replace("都", ""))) {
            availablePrefectures.add(prefecture);
          }
        });
      });
    }
  });

  return Array.from(availablePrefectures);
}

export function searchWeatherData(prefecture, rl) {
  const csvFiles = fs.readdirSync(csvDirectoryPath);

  const csvFilePath = csvFiles.find((file) => {
    const csvData = fs.readFileSync(path.join(csvDirectoryPath, file));
    const utf8Data = iconv.decode(csvData, "Shift_JIS");
    const csvArray = utf8Data.split(/\r?\n/).map((line) => line.split(","));
    for (let i = 0; i < 4; i++) {
      if (csvArray[i].some((element) => element.includes(prefecture.replace("県", "").replace("府", "").replace("都", "")))) {
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

  const csvData = fs.readFileSync(path.join(csvDirectoryPath, csvFilePath));
  const utf8Data = iconv.decode(csvData, "Shift_JIS");
  const csvArray = utf8Data.split(/\r?\n/).map((line) => line.split(","));

  rl.question("検索する日付を入力してください（例: 1/1）: ", (searchDate) => {
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
