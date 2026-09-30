// Play featured previews only while visible, respecting motion and data preferences.
(() => {
  const videos = document.querySelectorAll("video[data-preview]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches || navigator.connection?.saveData || !("IntersectionObserver" in window)) return;
  const started = new WeakSet();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (isIntersecting && !started.has(video)) {
          started.add(video);
          video.play().catch(() => {});
        } else if (!isIntersecting) video.pause();
      });
    },
    { threshold: 0.4 }
  );
  videos.forEach((video) => observer.observe(video));
  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    }
  });
})();
