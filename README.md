# Search-Weather-Japan

## 概要

日本の過去の天気をターミナル上で表示するnpmです

## インストール方法

`$ npm install iconv-lite`
`$ npm install search-weather-japan`

## 使い方

- 過去の天気データ(CSV)を取得し、npmを実行してください

  - CSVの準備

    - CSVの取得方法

      - [気象庁の過去の気象データ](https://www.data.jma.go.jp/risk/obsdl/index.php) にアクセス(出典：気象庁ホームページ(https://www.jma.go.jp/jma/kishou/info/coment.html))

      - 地点を選ぶ

        - 調べたい地点を選ぶ

      - 項目を選ぶ

        - 以下の項目にチェックする
          - 雲量/天気
            - 天気概要（昼：06時〜18時）
            - 天気概要（夜：18時〜翌日06時）

      - 期間を選ぶ

        - 1年以上であれば問題ないです

      - 表示オプションを選ぶ

        - 以下の項目にチェックする
          - その他
            - 利用上注意が必要なデータの扱い
              - 値を表示(格納)しない。
            - 観測環境などの変化の前後で、値が不均質となったデータの扱い
              - 観測環境などの変化前の値を表示(格納)しない。
            - ダウンロードCSVファイルのデータ仕様
              - 日付リテラルで格納
            - その他
              - 都道府県名を格納（CSVファイルダウンロード実行時）

      - 右ボタンのCSVファイルをダウンロード

    - CSVの配置する場所
      - /現在のディレクトリ/csv/csvファイル
        - npmを実行するディレクトリのcsvディレクトリ内に配置してください
          - もし、csvディレクトリがない場合は作成してください

  - npm実行
    - `% npx search-weather-japan`
      - 質問が始まり、最後まで答えると過去の天気が表示されます
