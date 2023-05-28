export function slider() {
  jQuery(function ($) {
    $(".js-mvSlider").slick({
      arrows: false, //左右の矢印表示（初期値：true）
      autoplay: true, //自動再生（初期値：false）
      autoplaySpeed: 5000, //自動スライド間隔
      speed: 2000, //スライドやフェードの速度（初期値：300）単位はミリ秒
      fade: true, //スライドではなくフェードにするか（初期値：false）
      slidesToShow: 1, //表示するスライドの枚数（初期値：1）
      swipe: false, // 手動操作による切り替えはさせない
      pauseOnFocus: false, //スライダーをフォーカスした時にスライドを停止させるか
      pauseOnHover: false, //スライダーにマウスホバーした時にスライドを停止させる
    });
  });
}
