export function common() {
  
  //スクロールしたらページトップ出現
  let jsPageTop = document.querySelector(".js-page-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY >= 100) {
      jsPageTop.classList.add("is-active");
    }
    if (window.scrollY < 100) {
      jsPageTop.classList.remove("is-active");
    }
  });
  
  // const header = document.getElementById("js-header");
  // const headerScroll = () => {
  //   window.addEventListener("scroll", () => {
  //     if (window.scrollY > 1 && window.innerWidth > 768) {
  //       header.classList.add("is-scroll");
  //     } else {
  //       header.classList.remove("is-scroll");
  //     }
  //   });
  // };

  // headerScroll();

  jQuery(function ($) {
    //要素の取得とスピードの設定
    var box = $(".u-colorbox"),
      speed = 700;

    //.u-colorboxの付いた全ての要素に対して下記の処理を行う
    box.each(function () {
      $(this).append('<div class="color"></div>');
      var color = $(this).find($(".color")),
        image = $(this).find("img");
      var counter = 0;

      image.css("opacity", "0");
      color.css("width", "0%");
      //inviewを使って背景色が画面に現れたら処理をする
      color.on("inview", function () {
        if (counter == 0) {
          $(this)
            .delay(200)
            .animate({ width: "100%" }, speed, function () {
              image.css("opacity", "1");
              $(this).css({ left: "0", right: "auto" });
              $(this).animate({ width: "0%" }, speed);
            });
          counter = 1;
        }
      });
    });
  });
}
