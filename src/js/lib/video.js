

const videos = document.querySelectorAll('[data-videojs]');
videos.forEach(video => {
  let player = videojs(
    video,
    {
      autoplay: false,
      loop: video.closest('.preloader'),
      muted: true,
      playsinline: true,
      normalizeAutoplay: true,
      noUITitleAttributes: true,
      disablePictureInPicture: true,
      controlBar: false,
      controls: false,
      bigPlayButton: false,
      titleBar: false,
      textTrackDisplay: false,
      paused: true,
    },
    function () {}
  );
});
