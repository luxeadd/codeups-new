// 必要なプラグインのインポート
const {
  src, // 入力
  dest, // 出力
  lastRun, // 前回の実行時のみ処理
  watch, // ファイルの監視
  series, // 直列処理
  parallel, // 並列処理
} = require("gulp");

// 共通機能
const debug = require("gulp-debug"); // デバッグ情報を表示
const plumber = require("gulp-plumber"); // エラーが発生しても強制終了させない
const notify = require("gulp-notify"); // エラー発生時の通知を表示
const del = require("del"); // ファイルの削除
const rename = require("gulp-rename");

// Sass
const sass = require("gulp-sass")(require("sass")); // Sass のコンパイル
const sassGlob = require("gulp-sass-glob-use-forward"); // Sass をまとめる
const mmq = require("gulp-merge-media-queries"); // メディアクエリをまとめる
const postcss = require("gulp-postcss"); // PostCSS
const autoprefixer = require("autoprefixer"); // ベンダープレフィックスの自動付与
const cssdeclsort = require("css-declaration-sorter"); // CSS 宣言をソート
const postcssPresetEnv = require("postcss-preset-env"); // CSS4未満のベンダープレフィックスを付与

// html
const replace = require("gulp-replace"); // 文字列や正規表現による置換
const htmlBeautify = require("gulp-html-beautify"); // HTML の整形

// 画像
const imagemin = require("gulp-imagemin"); // 画像の圧縮
const imageminMozjpeg = require("imagemin-mozjpeg"); // JPEG 画像の圧縮用
const imageminPngquant = require("imagemin-pngquant"); // PNG 画像の圧縮用
const webp = require("gulp-webp"); // WebP へ変換

// JavaScript
const webpack = require("webpack"); // webpack をインポート
const webpackStream = require("webpack-stream"); // gulp で webpack を使う
const webpackProd = require("./webpack.prod.js"); // webpack 本番モード用の設定ファイルを読み込み
const webpackDev = require("./webpack.dev.js"); // webpack 開発モード用の設定ファイルを読み込み
const vinylNamed = require("vinyl-named"); // エントリーポイントに名前
const filter = require("gulp-filter"); // ストリーム内のファイルをフィルタリング
const path = require("path"); // ファイルパス操作

// ブラウザシンク
const browserSync = require("browser-sync");

// 読み込み先のディレクトリ
const srcPath = {
  css: "./sass/**/*.scss",
  js: "./js/**/*",
  img: "./images/**/*",
  ejs: "./ejs/**/*.ejs",
};
// 出力先のディレクトリ
const distPath = {
  all: "../dist",
  html: "../dist/",
  css: "../dist/assets/css/",
  js: "../dist/assets/js/",
  img: "../dist/assets/images/",
};

// ブラウザ対応リスト
const browsers = [
  "last 2 versions",
  "> 5%",
  "ie > 11",
  "ios >= 8",
  "and_chr >= 5",
  "Android >= 5",
];

// Sass タスク
const cssSass = (isProduction) => {
  return src(srcPath.css, { sourcemaps: isProduction }) // ソースファイルを指定
    .pipe(
      plumber({ errorHandler: notify.onError("Error:<%= error.message %>") })
    ) // エラーがある場合、通知を出す
    .pipe(sassGlob()) // Sass をまとめる
    .pipe(
      sass.sync({
        // Sass のコンパイル
        includePaths: ["node_modules", "src/sass"], // @import のパスを指定
        outputStyle: "expanded", // コンパイル後のスタイル指定
      })
    )
    .pipe(
      postcss(
        // PostCSS
        [
          autoprefixer({ cascade: false, grid: true }), // ベンダープレフィックスの自動付与
          cssdeclsort({ order: "alphabetical" }), // CSS 宣言をソート
          postcssPresetEnv({ browsers: browsers, stage: 3 }), // CSS4未満のベンダープレフィックスを付与
        ],
        {
          map: { inline: false }, // ソースマップを出力
        }
      )
    )
    .pipe(mmq()) // メディアクエリをまとめる
    .pipe(dest(distPath.css, { sourcemaps: isProduction ? "." : false })) // コンパイル後の出力先を指定
    .pipe(notify({ message: "Sassをコンパイルしました", onLast: true })); // 通知を出す
};

const cssSassProd = () => cssSass(false); // 本番用の Sass タスク
const cssSassDev = () => cssSass(true); // 開発用の Sass タスク

// html タスク
// const html = () => {
//   return src(srcPath.html) // ソースファイルを指定し、_で始まるファイルを除外
//     .pipe(plumber({ errorHandler: notify.onError("Error:<%= error.message %>") })) // エラーがある場合、通知を出す
//     .pipe(replace(/^[ \t]*\n/gim, "")) // 空の行を削除
//     .pipe(
//       htmlBeautify({
//         indent_size: 2, // インデントのサイズ
//         indent_char: " ", // インデントに使う文字
//         max_preserve_newlines: 0, // 連続する改行の最大数
//         preserve_newlines: true, // 改行を維持する
//         indent_inner_html: false, // インデント内のHTMLを有効にするかどうか
//         extra_liners: [], // 追加の改行を挿入するタグ
//       })
//     )
//     .pipe(dest(distPath.html)); // コンパイル後の出力先を指定
// };

// 画像圧縮タスク
const imagesSettings = [
  // jpg画像の圧縮率を指定
  imageminMozjpeg({ quality: 70, progressive: true }),
  // png画像の圧縮率を指定
  imageminPngquant({ quality: [0.5, 0.7], speed: 1 }),
  // svg画像の圧縮 (id属性やコメントを削除しない)
  imagemin.svgo({ plugins: [{ cleanupIDs: false }] }),
  // gif画像の圧縮
  imagemin.gifsicle({ optimizationLevel: 3, interlaced: false }),
];

const imgImagemin = () => {
  return src(srcPath.img, {
    since: lastRun(imgImagemin), // 前回実行時から変更されたファイルのみを対象にする
  })
    .pipe(
      plumber({ errorHandler: notify.onError("Error:<%= error.message %>") })
    )
    .pipe(
      // 画像圧縮
      imagemin(imagesSettings, {
        verbose: true, // 圧縮情報を表示するかどうか
      })
    )
    .pipe(
      dest(distPath.img) // 圧縮後の出力先を指定
    )
    .pipe(webp()) // WebP 形式に変換
    .pipe(
      dest(distPath.img) // WebP 変換後の出力先を指定
    );
};

// JavaScript タスク
const jsBundle = (isProduction) => {
  const webpackConfig = isProduction ? webpackProd : webpackDev; // 本番モードか開発モードかによって、webpack の設定を変更
  return src(srcPath.js) // ソースファイルを指定
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"), // エラーがある場合、通知を出す
      })
    )
    .pipe(
      filter(function (file) {
        return !/\/_/.test(file.path) && !/^_/.test(file.relative); // ファイル名が「_」で始まるものをコンパイルから除外
      })
    )
    .pipe(
      vinylNamed((file) => {
        // エントリーポイントに名前を付ける
        const p = path.parse(file.relative); // ファイルの相対パスを取得
        return (p.dir ? p.dir + path.sep : "") + p.name; // ファイル名を取得
      })
    )
    .pipe(webpackStream(webpackConfig, webpack)) // webpack を実行
    .pipe(dest(distPath.js)) // コンパイル後の出力先を指定
    .pipe(debug({ title: "JavaScript:" })); // デバッグ情報を表示
};

const jsBundleProd = () => jsBundle(true); // 本番用の JavaScript タスク
const jsBundleDev = () => jsBundle(false); // 開発用の JavaScript タスク

//  EJS
const ejs = require("gulp-ejs");
const htmlbeautify = require("gulp-html-beautify");

const srcEjsDir = "./ejs";

const ejsCompile = (done) => {
  src([srcEjsDir + "/**/*.ejs", "!" + srcEjsDir + "/**/_*.ejs"])
    .pipe(
      plumber({
        errorHandler: notify.onError(function (error) {
          return {
            message: "Error: <%= error.message %>",
            sound: false,
          };
        }),
      })
    )
    .pipe(ejs({}))
    .pipe(rename({ extname: ".html" }))
    .pipe(replace(/^[ \t]*\n/gim, ""))
    .pipe(
      htmlbeautify({
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 0,
        preserve_newlines: false,
        extra_liners: [],
      })
    )
    .pipe(dest(distPath.html));
  done();
};

// ブラウザシンクの初期化タスク
const browserSyncInit = () => {
  const browserSyncOptions = {
    notify: false, // 通知を無効にする
    ghostMode: false, // クリック、スクロール、フォーム入力の同期を無効にする
    server: "../dist/", // 静的ファイルの場合、distディレクトリをサーバーにする
  };
  browserSync.init(browserSyncOptions);
};

// ブラウザリロードタスク
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

// ファイル削除タスク
const clean = () => {
  // distディレクトリとWordPressのテーマディレクトリの中身を削除
  return del([distPath.all], { force: true });
};

// ファイル監視タスク
const watchFiles = () => {
  watch(srcPath.css, series(cssSassDev, browserSyncReload));
  watch(srcPath.js, series(jsBundleDev, browserSyncReload));
  watch(srcPath.img, series(imgImagemin, browserSyncReload));
  watch(srcPath.ejs, series(ejsCompile, browserSyncReload));
};

// 開発時に実行するタスク（npx gulp）
exports.default = series(
  series(cssSassDev, jsBundleDev, imgImagemin, ejsCompile), // タスクを順番に実行
  parallel(watchFiles, browserSyncInit) // ファイル監視とブラウザシンクを並行して実行
);

// 本番用にビルドするタスク（npx gulp build）
exports.build = series(
  clean,
  series(cssSassProd, jsBundleProd, imgImagemin, ejsCompile)
); // タスクを順番に実行
