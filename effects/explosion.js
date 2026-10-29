// ============================================================
//  Fire explosion effect
//  Plays the explosion video over the whole screen,
//  a set time after the door is clicked.
//
//  To turn this effect off: delete this file (and explosion.mp4)
//  from the effects folder on GitHub.
// ============================================================
(function () {
  // ---- Settings you can change ------------------------------
  const DELAY_MS = 3000;                     // wait after the door click (1000 = 1 second)
  const VIDEO    = "effects/explosion.mp4";  // the explosion video file
  // ------------------------------------------------------------

  // Skip it for visitors who turned on "reduce motion" on their device.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const door = document.getElementById("door");
  if (!door) return;

  // Make the video layer. The fire is on a black background, and
  // "screen" blending makes the black invisible, so only the fire shows.
  const video = document.createElement("video");
  video.muted = true;          // muted videos are allowed to play by themselves
  video.playsInline = true;    // play in the page on iPhones, not fullscreen
  video.setAttribute("playsinline", "");
  video.preload = "auto";
  video.setAttribute("aria-hidden", "true");
  video.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;object-fit:cover;" +
    "pointer-events:none;z-index:8;mix-blend-mode:screen;opacity:0";
  document.body.append(video);

  // Start downloading the video only after the page has loaded,
  // so it never slows down opening the site.
  function startLoading() { if (!video.src) video.src = VIDEO; }
  if (document.readyState === "complete") startLoading();
  else window.addEventListener("load", startLoading);

  let started = false;
  function go() {
    if (started) return;
    started = true;
    startLoading(); // in case the door was clicked before the page finished loading
    setTimeout(() => {
      video.currentTime = 0;
      video.style.opacity = "1";
      const p = video.play();
      if (p) p.catch(() => video.remove()); // if the browser refuses to play, just skip it
    }, DELAY_MS);
  }
  door.addEventListener("click", go);
  // Effects load a moment after the page, so the door may already be open.
  if (door.classList.contains("open")) go();

  // Clean up when it's done.
  video.addEventListener("ended", () => video.remove());
})();
