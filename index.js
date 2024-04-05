#!/usr/bin/env node

import readline from "readline";
import { searchWeatherData } from "./weatherData.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("検索したい都道府県はどこですか？: ", (prefecture) => {
  searchWeatherData(prefecture, rl);
});
