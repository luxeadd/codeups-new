export function slider() {
  jQuery(function ($) {
    $(".js-mvSlider")
      .slick({
        arrows: false, //左右の矢印表示（初期値：true）
        autoplay: true, //自動再生（初期値：false）
        autoplaySpeed: 6000, //自動スライド間隔
        speed: 2000, //スライドやフェードの速度（初期値：300）単位はミリ秒
        fade: true, //スライドではなくフェードにするか（初期値：false）
        slidesToShow: 1, //表示するスライドの枚数（初期値：1）
        swipe: false, // 手動操作による切り替えはさせない
        pauseOnFocus: false, //スライダーをフォーカスした時にスライドを停止させるか
        pauseOnHover: false, //スライダーにマウスホバーした時にスライドを停止させる
        // responsive: [
        //   {
        //     breakpoint: 768,
        //     settings: {
        //       autoplaySpeed: 3000, //自動スライド間隔示
        //     },
        //   },
        // ],
      })
      .on("afterChange", function (event, slick, currentSlide) {
        switch (currentSlide) {
          case 0:
            // 1枚目2週目以降の秒数
            $(this).slick("slickSetOption", "autoplaySpeed", 3000);
            break;
          default:
            // その他の秒数
            $(this).slick("slickSetOption", "autoplaySpeed", 3000);
            break;
        }
      });
    

    $(".js-campaignSlider").slick({
      autoplay: true, //自動再生（初期値：false）
      autoplaySpeed: 2000, //自動スライド間隔
      speed: 1000, //スライドやフェードの速度（初期値：300）単位はミリ秒
      variableWidth: true, //コンテンツの幅の維持して画面幅が広がれば要素数を増やす（CSSでコンテンツにwidthの設定が必要）
      pauseOnFocus: false, //スライダーをフォーカスした時にスライドを停止させるか
      pauseOnHover: false, //スライダーにマウスホバーした時にスライドを停止させるか
      prevArrow: '<div class="c-slide-arrow c-prev-arrow"></div>',
      nextArrow: '<div class="c-slide-arrow c-next-arrow"></div>',
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false, //左右の矢印表示（初期値：true）
          },
        },
      ],
    });
  });
}
