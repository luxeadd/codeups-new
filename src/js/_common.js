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
    // この中であればWordpressでも「$」が使用可能になる
  });
}
