# HTML_Template

## 環境

* Node.js 16系、18系

## 起動方法

### srcフォルダに移動
```
cd src
```

### nodeのバージョンを確認
  * 該当のバージョンであることを確認する
```
node -v
```

### node modulesをインストール
```
npm i
```

### Gulpを起動（開発時）
```
npx gulp
```
  * ローカルサーバーが起動。http://localhost:3000 にアクセス

### 本番アップ時
```
npx gulp build
```

## ファイル構成
* src：開発用フォルダ
  * html：HTMLファイル
  * images：画像ファイル
  * js：JavaScriptファイル
  * sass：Sassファイル（FLOCSS）
    * funcdation：ベース、リセット系
    * global：
    * javascript：JavaScriptで使用するCSS
    * layout：レイアウト系
    * object：編集するファイル
      * component：再利用可能な最小単位のパーツ
      * project：componentを集めたもの
      * utility：調整用
* dist：ビルドファイル、npm iしたあとに作成される
  * css：CSSファイル
  * images：画像ファイル
  * js：JavaScriptファイル
  * HTMLファイルはdistフォルダ直下に格納される

## Sassについて
* src/sass/global/_breakpoint.scss の8行目
```
$rule: map-get($rules, "pc"); // PCファースト：pc、SPファースト：sp
```
の部分を「pc」に変更するとPCファースト、「sp」に変更するとSPファーストに切替可能です。
* ベースファイルのSassは PCファーストをベースに作成されているので注意してください。






