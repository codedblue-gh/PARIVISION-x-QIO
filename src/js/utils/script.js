import { itemsTl } from '../anim/homepage';
import { initVideos, initWatchTimer, isTouchDevice } from './utils';
import { lenis } from '../lib/lenis';
import { checkScreenSize, initHomepageBullets } from './homepage';
import { tlPreloader } from '../anim/timelines';

export const mm = gsap.matchMedia();
export const md = window.matchMedia('(max-width: 49em)');
export const isTouch = isTouchDevice();

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
  } else if (document.querySelector('.teams')) {
    document.documentElement.classList.add('teams-page');
  }

  initWatchTimer();
  initVideos();

  window.addEventListener('resize', checkScreenSize);
});
