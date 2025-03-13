import gsap from 'gsap';
import { Observer } from 'gsap/all';
import { isTouchDevice, removeClasses } from '../utils/utils';
import { timelines } from './timelines';

gsap.registerPlugin(Observer);

const isTouch = isTouchDevice();

export const ANIMATING_CLASS = '_is-animating';
export const ACTIVE_CLASS = '_is-active';
export const INIT_SCROLL_CLASS = '_init-scroll';

let yPos = 0;

const heading = document.getElementById('section-heading');
const bullets = document.querySelectorAll('.homepage-table__bullet');
export const sections = gsap.utils.toArray('[data-section]');

const scroll = (self, i, deltaY) => {
  if (
    !document.querySelector(`.${ANIMATING_CLASS}`) &&
    document.querySelector(`.${INIT_SCROLL_CLASS}`)
  ) {
    self.disable();

    const prev = sections[i - 1];
    const next = sections[i + 1];
    const target = deltaY === 1 ? next : prev;

    resetActiveSection(target, deltaY);
  }
};

export const observer = Observer.create({
  target: '.homepage',
  type: 'wheel,touch',
  wheelSpeed: isTouch ? -1 : 1,
  onUp: self => {
    const activeIdx = sections.indexOf(
      document.querySelector(`[data-section].${ACTIVE_CLASS}`)
    );
    const next = isTouch ? sections[activeIdx + 1] : sections[activeIdx - 1];

    if (next) {
      scroll(self, activeIdx, isTouch ? 1 : -1);
    }
  },
  onDown: self => {
    const activeIdx = sections.indexOf(
      document.querySelector(`[data-section].${ACTIVE_CLASS}`)
    );
    const next = isTouch ? sections[activeIdx - 1] : sections[activeIdx + 1];

    if (next) {
      scroll(self, activeIdx, isTouch ? -1 : 1);
    }
  },
});
observer.disable();

export const resetActiveSection = (section, deltaY = -1) => {
  if (section) {
    const curIdx = sections.indexOf(section);
    const curBullet = bullets[curIdx];
    const prevIdx = deltaY === 1 ? curIdx - 1 : curIdx + 1;

    const transition = prevTl => {
      const tl = timelines.filter(tl => tl.vars.id === `${curIdx}-on`)[0];
      removeClasses(sections, ACTIVE_CLASS);
      sections[curIdx].classList.add(ACTIVE_CLASS);
      if (tl) {
        tl.restart(true);
      }
      prevTl.revert();
    };
    if (prevIdx >= 0 && document.querySelector(`.${INIT_SCROLL_CLASS}`)) {
      const curTl = timelines.filter(tl => tl.vars.id === `${prevIdx}-off`)[0];

      curTl.restart();
      curTl.then(() => {
        transition(curTl);
      });
    }

    document.documentElement.classList.add(ANIMATING_CLASS);

    yPos = deltaY === 1 ? yPos + 16 : yPos - 16;

    gsap.to('body', { '--y': `${yPos}rem`, duration: 2 });

    if (bullets.length && curBullet) {
      removeClasses(bullets, ACTIVE_CLASS);
      curBullet.classList.add(ACTIVE_CLASS);
    }

    if (heading) {
      heading.innerHTML = section.dataset.section;
    }
  }
};

export const initHomepageScroll = () => {
  document.documentElement.classList.add(INIT_SCROLL_CLASS);

  observer.enable();
};
