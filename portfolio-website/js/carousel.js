(() => {
  if (!window.Swiper) return;

  new Swiper(".project-swiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    grabCursor: true,
    keyboard: {
      enabled: true
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    breakpoints: {
      600: {
        slidesPerView: 2
      },
      900: {
        slidesPerView: 3
      }
    }
  });
})();
