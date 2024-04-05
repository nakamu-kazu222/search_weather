const readline = require('readline');
const { searchWeatherData } = require('./weatherData');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('検索したい都道府県はどこですか？: ', (prefecture) => {
  searchWeatherData(prefecture, rl);
});
