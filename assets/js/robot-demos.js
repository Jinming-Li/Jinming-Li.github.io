// Posters remain visible before playback; only visible previews load video data.
(() => {
  const videos = document.querySelectorAll(".robot-demo video");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const automatic = !reduceMotion.matches && !navigator.connection?.saveData;
  const userPaused = new WeakSet();
  const visible = new WeakSet();
  videos.forEach((video) => {
    video.addEventListener("error", () => {
      video.closest(".robot-demo").querySelector(".demo-error").hidden = false;
    });
    video.addEventListener("pause", () => {
      if (visible.has(video)) userPaused.add(video);
    });
  });
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (isIntersecting) {
          visible.add(video);
          if (video.dataset.preview && automatic && !reduceMotion.matches && !userPaused.has(video)) {
            video.play().catch(() => {});
          }
        } else {
          visible.delete(video);
          video.pause();
        }
      });
    },
    { threshold: 0.4 }
  );
  videos.forEach((video) => observer.observe(video));
  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) videos.forEach((video) => video.pause());
  });
})();
