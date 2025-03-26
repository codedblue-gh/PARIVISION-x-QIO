import { remToPx } from '../utils/utils';
import { mm } from '../utils/script';

window.addEventListener('load', function () {
  if (document.querySelector('.news__slider')) {
    mm.add('(min-width: 49em)', () => {
      const slider = new Swiper('.news__slider', {
        slidesPerView: 'auto',
        loop: true,
        spaceBetween: remToPx(7.1),
        navigation: {
          prevEl: '.news__controls .controls__btn_prev',
          nextEl: '.news__controls .controls__btn_next',
        },
        pagination: {
          el: '.news__controls .controls__fraction',
          type: 'custom',
          renderCustom(swiper, current, total) {
            return current + '//' + total;
          },
        },
        on: {
          sliderMove: () => {
            document.documentElement.classList.add('_slide-move');
          },
          touchEnd: () => {
            setTimeout(() => {
              document.documentElement.classList.remove('_slide-move');
            }, 1000);
          },
        },
      });

      return () => {
        slider.destroy();
      };
    });
  }
});
