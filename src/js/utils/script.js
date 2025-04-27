import { itemsTl } from '../anim/homepage';
import {
  initVideos,
  initWatchTimer,
  isTouchDevice,
  removeClasses,
} from './utils';
import { lenis } from '../lib/lenis';
import { checkScreenSize, initHomepageBullets } from './homepage';
import { duration, tlPreloader } from '../anim/timelines';

export const mm = gsap.matchMedia();
export const md = window.matchMedia('(max-width: 49em)');
export const isTouch = isTouchDevice();
export const resizeNsScreen = () => {
  if (
    document.querySelector('.links__container') &&
    document.querySelector('.news')
  ) {
    gsap.set('.news', {
      '--height': `${
        window.screen.availHeight -
        document.querySelector('.links__container').offsetHeight -
        106
      }px`,
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('[data-current-year]').length) {
    document.querySelectorAll('[data-current-year]').forEach(item => {
      item.innerHTML = new Date().getFullYear();
    });
  }

  const onClickHandler = e => {
    if (e.target.closest('.header__menu-btn')) {
      document.documentElement.classList.add('_show-menu');
    }
    if (
      e.target.closest('._show-menu') &&
      (e.target.closest('.menu__close-btn') || !e.target.closest('.menu')) &&
      !e.target.closest('.header__menu-btn')
    ) {
      document.documentElement.classList.remove('_show-menu');
    }

    if (
      document.querySelector('.homepage-table__list._is-active') &&
      !e.target.closest('.homepage-table__list')
    ) {
      document
        .querySelector('.homepage-table__list')
        .classList.remove('_is-active');
      itemsTl.reverse();
    }
  };

  document.addEventListener('click', onClickHandler);
});

window.addEventListener('load', function () {
  document.documentElement.classList.add('_page-loaded');

  ScrollTrigger.refresh();

  tlPreloader.play();
  checkScreenSize();

  if (document.querySelector('.hero')) {
    document.documentElement.classList.add('homepage');

    lenis.destroy();

    initHomepageBullets();
  } else if (
    document.querySelector('[data-section]') &&
    !document.querySelector('[data-section].fw')
  ) {
    document.documentElement.dataset.page =
      document.querySelector('[data-section]').dataset.section;
    if (document.querySelector('.gallery') && !md.matches) {
      lenis.stop();
    }
  } else if (
    document.querySelector('.teams') ||
    document.querySelector('.gallery')
  ) {
    document.documentElement.classList.add('ad-width');
  }

  if (document.querySelector('.contacts__input')) {
    document
      .querySelector('.contacts__form')
      .addEventListener('submit', function (e) {
        document.querySelectorAll('.contacts__input').forEach(input => {
          if (input.value.length === 0) {
            e.preventDefault();
          }
        });
      });
  }

  if (document.querySelector('.item-teams') && !isTouch) {
    const arr = gsap.utils.toArray('.item-teams');

    arr.forEach((item, idx) => {
      item.addEventListener('mouseover', function () {
        arr.forEach((el, i) => {
          if (i !== idx) {
            gsap.to(el, { '--alpha': 1, duration: 0.5 });
          } else {
            gsap.to(el, { '--alpha': 0, duration: 0.5 });
          }
        });
      });
    });
    arr.forEach((item, idx) => {
      item.addEventListener('mouseleave', function (e) {
        if (!e.relatedTarget.closest('.item-teams')) {
          gsap.to(arr, { '--alpha': 0, duration: 0.5 });
        }
      });
    });
  }

  if (document.querySelector('.sort')) {
    const list = document.querySelector('.sort');
    const listTl = gsap.timeline({ paused: true }).to('.tags-list__item', {
      '--mb': '2rem',
      '--opacity': 1,
      '--scale': 1,
      duration: 0.5,
      stagger: 0.2,
    });

    list.addEventListener('click', function () {
      if (isTouch) {
        list.classList.toggle('_is-active');

        if (!list.classList.contains('_is-active')) {
          listTl.reverse();
        } else {
          listTl.play();
        }
      }
    });

    list.addEventListener('mouseover', function () {
      if (!isTouch) listTl.play();
    });
    list.addEventListener('mouseout', function () {
      if (!isTouch) listTl.reverse();
    });
  }

  resizeNsScreen();
  initWatchTimer();
  initVideos();

  window.addEventListener('resize', checkScreenSize);
});
