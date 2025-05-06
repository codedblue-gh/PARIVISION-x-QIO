import { itemsTl } from '../anim/homepage';
import { initVideos, initWatchTimer, isTouchDevice } from './utils';
import { lenis } from '../lib/lenis';
import { checkScreenSize, initHomepageBullets } from './homepage';
import { tlPreloader } from '../anim/timelines';

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
  if (
    document.querySelector('.header__sort-list') &&
    document.querySelector('.lower-info')
  ) {
    const sort = document.querySelector('.header__sort-list');
    const lower = document.querySelector('.lower-info');
    const banner = document.querySelector('.schedule__banner');
    if (
      window.innerWidth <= 1024 &&
      window.matchMedia('(min-width: 49.01em)').matches
    ) {
      lower.append(sort);
      if (banner) {
        document.querySelector('body').append(banner);
      }
    } else {
      document.querySelector('header').append(sort);
      if (banner) {
        document.querySelector('.schedule').append(banner);
      }
    }
  }
};

const showList = (listSelector, item, gap, check = false, callback = false) => {
  const list = document.querySelector(listSelector);
  const sortList = document.querySelector('.header__sort-list');
  const listTl = gsap.timeline({ paused: true }).to(
    gsap.utils
      .toArray(item)
      .filter(v => !v.closest('.homepage-table__sublist')),
    {
      '--mb': `${gap}rem`,
      '--opacity': 1,
      '--scale': 1,
      duration: 0.5,
      stagger: 0.2,
    }
  );
  const remove = () => {
    listTl.reverse();
    if (sortList) {
      document.documentElement.classList.remove('_show-sort');
    }
  };
  if (callback) {
    document.addEventListener('click', function (e) {
      if (
        e.target.closest('._show-sort') &&
        !e.target.closest('.header__sort-list') &&
        !e.target.closest('.header__sort-btn')
      ) {
        if (sortList && md.matches) {
          remove();
          return;
        }

        remove();
        list.classList.remove('_is-active');
      }
    });
  }
  list.addEventListener('click', function () {
    if (sortList && md.matches) {
      remove();
      return;
    }
    if (isTouch || !check) {
      list.classList.toggle('_is-active');
      sortList && document.documentElement.classList.toggle('_show-sort');

      if (callback) {
        callback();
      }

      if (!list.classList.contains('_is-active')) {
        remove();
      } else {
        listTl.play();
        if (sortList) {
          document.documentElement.classList.add('_show-sort');
        }
      }
    }
  });
  if (document.querySelector('.header__sort-btn')) {
    document
      .querySelector('.header__sort-btn')
      .addEventListener('click', function () {
        document.documentElement.classList.add('_show-sort');

        listTl.play();
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
    showList('.sort', '.tags-list__item', 2, true);

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

  if (document.querySelector('.list-item-homepage-table__input')) {
    const inputGroups = gsap.utils.toArray('.list-item-homepage-table__input');

    for (let i = 0; i < inputGroups.length; i++) {
      const inputGroup = inputGroups[i];

      inputGroup.addEventListener('change', function ({ target }) {
        // if (inputGroup.checked) {
        const group = gsap.utils.toArray(`input[name=${target.name}]`);
        for (let i = 0; i < group.length; i++) {
          gsap.to(group[i].parentElement, { '--alpha': +!group[i].checked });
        }
        if (!group.filter(a => a.checked).length) {
          for (let i = 0; i < group.length; i++) {
            gsap.to(group[i].parentElement, { '--alpha': 0 });
          }
        }
        // }
      });
    }
  }

  if (
    document.querySelector('.header__sort-list .homepage-table__list-item_all')
  ) {
    showList(
      '.header__sort-list .homepage-table__list-item_all',
      '.homepage-table__list-item',
      md.matches ? 2 : 1,
      '',
      () => {
        // document.documentElement.classList.toggle('_show-sort');
      }
    );
  }

  window.addEventListener('resize', checkScreenSize);
});
