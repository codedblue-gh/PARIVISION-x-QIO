import gsap from 'gsap';
import { initItemsAnim, itemsTl } from './homepage';
import {
  getCurSection,
  ACTIVE_CLASS,
  ANIMATING_CLASS,
  INIT_SCROLL_CLASS,
  initHomepageScroll,
  observer,
  resetActiveSection,
  sections,
  leaders,
} from './homepage-scroll';

export const duration = 1.5;

const preloaderVideo = videojs.getPlayer(
  document.querySelector('.preloader [data-videojs]')
);
const video1 = document.getElementById('homepage-video-1');
// const video1r = document.getElementById('homepage-video-1-r');
// const video2 = document.getElementById('homepage-video-2');
const player1 = video1
  ? videojs.getPlayer(video1.querySelector('video'))
  : null;

// const player1r = video1r
//   ? videojs.getPlayer(video1r.querySelector('video'))
//   : null;
// const player2 = videojs.getPlayer(video2.querySelector('video'));
const table = document.querySelector('.homepage-table');
const sectionMain = document.querySelector('[data-section="main"]');
const sectionAbout = document.querySelector('[data-section="about"]');
const sectionTeam = document.querySelector('[data-section="team"]');
const sectionLeaders = document.querySelector('[data-section="leaders"]');
const sectionTeams = document.querySelector('[data-section="teams"]');
const sectionNews = document.querySelector('[data-section="news"]');
const sectionContacts = document.querySelector('[data-section="contacts"]');
const sectionLinks = document.querySelector('[data-section="links"]');

const clearedProps = {
  opacity: 1,
  translateY: 0,
  filter: 'blur(0rem)',
};
const blurTopProps = {
  opacity: 0,
  filter: 'blur(1rem)',
  translateY: '-10%',
};
const opacityTopProps = {
  opacity: 0,
  translateY: '-100%',
};

const onDefaults = {
  defaults: {
    duration: 1,
    ease: 'circ.inOut',
  },
  paused: true,
  onComplete: () => {
    document.documentElement.classList.remove(ANIMATING_CLASS);
    observer.enable();
  },
};
const offDefaults = {
  defaults: onDefaults.defaults,
  paused: true,
  onStart: () => {
    document.documentElement.classList.add(ANIMATING_CLASS);
    observer.disable();
  },
};

export const tlPreloader = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.3,
    ease: 'circ.inOut',
  },
});
export const tlPreloaderLeave = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.3,
    ease: 'circ.inOut',
  },
});
const hideLoader = () => {
  document.querySelectorAll('.preloader__progress') &&
    document.querySelectorAll('.preloader__progress').forEach(el => {
      el.textContent = 100;
    });
  tlPreloaderLeave.play();
};
tlPreloader
  .to(
    'html',
    {
      '--opacity': 1,
    },
    0
  )
  .to(
    '.preloader',
    {
      opacity: 1,
    },
    0
  )
  .to(
    '.preloader',
    {
      '--y': 0,
      '--opacity': 1,
      '--blur': '0rem',
      onStart: () => {
        gsap.from('.preloader__progress', {
          textContent: 0,
          duration: 1,
          snap: { textContent: 1 },
          onComplete: () => {
            if (document.querySelector('._page-loaded')) {
              hideLoader();
            } else {
              window.addEventListener('load', hideLoader);
            }
          },
        });
      },
      onComplete: () => {
        preloaderVideo && preloaderVideo.play();
      },
    },
    0.5
  );
tlPreloaderLeave.to('.preloader__video, #loader', {
  opacity: 0,
  onStart: () => {
    gsap.to('.homepage-table, .header', { opacity: 1, duration: 0.3 });
    gsap.to('.homepage-table, .header', {
      filter: 'blur(0rem)',
      duration: 0.3,
      delay: 0.1,
    });
    gsap.to('.header__heading', { opacity: 1, duration: 0.3 });

    document.querySelector('[data-section]').classList.add(ACTIVE_CLASS);
    resetActiveSection(document.querySelector('[data-section]'));

    setTimeout(() => {
      tlMain.play();
    }, 300);
  },
  onComplete: () => {
    preloaderVideo && preloaderVideo.pause();

    document.getElementById('loader').style.display = 'none';
  },
});

export const tlMain = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.3,
    ease: 'circ.inOut',
  },
  id: `${sections.indexOf(sectionMain)}-on`,
});
export const tlMainLeave = gsap.timeline({
  ...offDefaults,
  id: `${sections.indexOf(sectionMain)}-off`,
});
tlMain
  .to('.hero__container', {
    ...clearedProps,
    onStart: () => {
      gsap.timeline().to(video1, { opacity: 0, duration: 0.3 });
      gsap.to('.header__lang', { autoAlpha: 1, duration: 0.3 });
    },
    onComplete: () => {
      if (!document.querySelector(`.${INIT_SCROLL_CLASS}`)) {
        itemsTl.play();
        itemsTl.then(() => {
          initHomepageScroll();

          setTimeout(() => {
            itemsTl.reverse();
            itemsTl.then(initItemsAnim);
          }, 2000);
        });
      }
    },
  })
  .to('html', { '--opacity': 1, duration: 0.3 }, 0)
  .to('body', { '--opacity': 1, duration: 0.3 }, 0);
tlMainLeave.to('.hero__container', {
  ...blurTopProps,
  onComplete: () => {
    gsap.to('.header__lang', { autoAlpha: 0 });
  },
});

export const tlAbout = gsap.timeline({
  ...onDefaults,
  id: `${sections.indexOf(sectionAbout)}-on`,
});
export const tlAboutLeave = gsap.timeline({
  ...offDefaults,
  id: `${sections.indexOf(sectionAbout)}-off`,
});
tlAbout
  .to('.about__heading-txt:first-child, .about__heading-txt:nth-child(2)', {
    duration: 1,
    opacity: 1,
    translateY: 0,
    onStart: () => {
      gsap.to('html', { '--autoAlpha': 1, delay: 0.5 });
      gsap.timeline().to(
        video1,
        {
          opacity: 1,
        },
        0.7
      );
    },
  })
  .to(
    '.about__heading-txt:first-child, .about__heading-txt:nth-child(2)',
    {
      filter: 'blur(0rem)',
      duration: 1,
    },
    0.5
  )
  .to(
    '.about__text-wrap',
    clearedProps,

    0
  )
  .to(
    '.about__heading-txt:nth-child(3), .about__heading-txt:nth-child(4)',
    {
      duration: 1,
      opacity: 1,
      translateY: 0,
      stagger: 0.1,
    },
    0.5
  )
  .to(
    '.about__heading-txt:nth-child(3), .about__heading-txt:nth-child(4)',
    {
      filter: 'blur(0rem)',
      duration: 1,
      stagger: 0.2,
    },
    1
  )

  .to(
    'body',
    {
      '--opacity': 0,
    },
    0.7
  );
tlAboutLeave.to('.about__heading, .about__text-wrap', {
  ...blurTopProps,
  onStart: () => {
    gsap.to('html', { '--autoAlpha': 0 });

    if (player1 && getCurSection() && getCurSection() === 'team') {
      player1.play();
    }
  },
});

export const tlTeam = gsap.timeline({
  ...onDefaults,
  id: `${sections.indexOf(sectionTeam)}-on`,
});
export const tlTeamLeave = gsap.timeline({
  ...offDefaults,
  id: `${sections.indexOf(sectionTeam)}-off`,
});
tlTeam
  .to('.team__heading span', {
    opacity: 1,
    translateY: 0,
    duration: 1,
    stagger: 0.1,
    onStart: () => {
      // player2 && player2.currentTime(0);

      gsap.timeline().to(video1, { opacity: 1 }, 0);

      table && table.removeAttribute('data-table-section');
    },
  })
  .to(
    '.team__heading span',
    { filter: 'blur(0rem)', stagger: 0.1, duration: 1 },
    0.3
  )
  .to('.team__txt', clearedProps, 0);
tlTeamLeave.to('.team__heading span', blurTopProps).to(
  '.team__txt',
  {
    ...opacityTopProps,
    onStart: () => {
      if (getCurSection() && getCurSection() === 'about') {
        gsap.to('#homepage-video-1', {
          opacity: 0,
          onComplete: () => {
            if (player1) {
              player1.currentTime(0);
              player1.pause();
            }
          },
        });
        gsap.to('#homepage-video-1', { opacity: 1, delay: 1 });
      }
    },
    onComplete: () => {
      if (getCurSection() && getCurSection() === 'about') {
        gsap.to('html', { '--autoAlpha': 1 });
      }
    },
  },
  0
);

export const tlLeaders = gsap.timeline({
  ...onDefaults,
  id: `${sections.indexOf(sectionLeaders)}-on`,
});
export const tlLeadersLeave = gsap.timeline({
  ...offDefaults,
  id: `${sections.indexOf(sectionLeaders)}-off`,
});
tlLeaders
  .to('.leaders__container, .leaders__group_center', {
    ...clearedProps,
    onStart: () => {
      const cnd =
        window.innerWidth <= 784 &&
        !leaders[leaders.length - 1].classList.contains('_is-visible');

      document.documentElement.classList.add('leaders-screen');

      gsap.timeline().to(video1, { opacity: 0 }, 0);

      if (cnd) {
        document
          .querySelector('.leaders__group_center')
          .classList.add('_is-visible');
      }

      table && (table.dataset.tableSection = 'leaders');

      setTimeout(() => {
        if (cnd || !document.querySelector('.leaders__group._is-visible')) {
          document
            .querySelector('.leaders__group-heading_main')
            .classList.add('_is-active');
        }
      }, 1000);
    },
  })
  .to('html, .leaders', { '--opacity': 1 }, 0);
tlLeadersLeave
  .to('.leaders__container', {
    opacity: 0,
    onStart: () => {
      // gsap.timeline().to('#homepage-video-2', { opacity: 0, duration: 1.5 });

      if (observer.deltaY > 0) {
        // gsap.set('#homepage-video-1-r, #homepage-video-1', { opacity: 0 });
      } else {
        // gsap.timeline().to('#homepage-video-1', { opacity: 1, delay: 1 });
      }
    },
  })
  .to('.leaders', { '--opacity': 0 }, 0);

export const tlTeams = gsap.timeline({
  ...onDefaults,
  id: `${sections.indexOf(sectionTeams)}-on`,
});
export const tlTeamsLeave = gsap.timeline({
  ...offDefaults,
  id: `${sections.indexOf(sectionTeams)}-off`,
});
tlTeams
  .to('.teams', { '--opacity': 1 })
  .to(
    '.item-teams',
    {
      '--opacity': 1,
      visibility: 'visible',
      stagger: 0.3,
      onStart: () => {
        table && (table.dataset.tableSection = 'teams');
      },
    },
    0
  )
  .to(
    '.item-teams',
    {
      '--blur': '0rem',
      duration: 1,
      stagger: 0.3,
    },
    0
  )
  .to(
    '.item-teams__logo',
    {
      scaleY: 1,
      stagger: 0.3,
    },
    0
  );
tlTeamsLeave
  .to('.teams', {
    '--opacity': 0,
  })
  .to(
    '.item-teams',
    {
      '--skew1': '-10deg',
      '--skew2': '10deg',
      stagger: 0.3,
      ...blurTopProps,
    },
    0
  )
  .to('.item-teams__logo', { scaleY: 0.7, stagger: 0.3 }, 0);

export const tlNews = gsap.timeline({
  ...onDefaults,
  id: `${sections.indexOf(sectionNews)}-on`,
});
export const tlNewsLeave = gsap.timeline({
  ...offDefaults,
  id: `${sections.indexOf(sectionNews)}-off`,
});
tlNews
  .to('.news', {
    '--y': 0,
    '--opacity': 1,
    duration: 1,
    onStart: () => {
      table && (table.dataset.tableSection = 'news');
    },
  })
  .to(
    '.news',
    {
      '--blur': '0rem',
    },
    0
  )
  .to('.news__slider', { opacity: 1, visibility: 'visible', translateY: 0 }, 0);
tlNewsLeave.to('.news__container', {
  ...blurTopProps,
});

export const tlContacts = gsap.timeline({
  ...onDefaults,
  id: `${sections.indexOf(sectionContacts)}-on`,
});
export const tlContactsLeave = gsap.timeline({
  ...offDefaults,
  id: `${sections.indexOf(sectionContacts)}-off`,
});
tlContacts.to('.contacts__container', {
  ...clearedProps,
  onStart: () => {
    table && (table.dataset.tableSection = 'contacts');
  },
});
tlContactsLeave.to('.contacts__container', {
  ...blurTopProps,
});

export const tlLinks = gsap.timeline({
  ...onDefaults,
  id: `${sections.indexOf(sectionLinks)}-on`,
});
export const tlLinksLeave = gsap.timeline({
  ...offDefaults,
  id: `${sections.indexOf(sectionLinks)}-off`,
});
tlLinks.to('.links__container', {
  ...clearedProps,
  onStart: () => {
    table && table.classList.add('_is-hidden');
  },
});
tlLinksLeave.to('.links__container', {
  ...blurTopProps,
  onComplete: () => {
    table && table.classList.remove('_is-hidden');
  },
});

export const timelines = [
  tlMain,
  tlMainLeave,
  tlAbout,
  tlAboutLeave,
  tlTeam,
  tlTeamLeave,
  tlLeaders,
  tlLeadersLeave,
  tlTeams,
  tlTeamsLeave,
  tlNews,
  tlNewsLeave,
  tlContacts,
  tlContactsLeave,
  tlLinks,
  tlLinksLeave,
];
