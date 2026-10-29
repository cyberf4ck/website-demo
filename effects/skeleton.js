// ============================================================
//  Dancing skeleton effect
//  Plays the skeleton video once on the right side of the screen,
//  a set time after the door is clicked.
//
//  To turn this effect off: delete this file (and skeleton.mp4)
//  from the effects folder.
// ============================================================
(function () {
  // ---- Settings you can change ------------------------------
  const DELAY_MS = 6000;                    // wait after the door click (1000 = 1 second)
  const VIDEO    = "effects/skeleton.mp4";  // the skeleton video file
  const HEIGHT   = "min(60vh, 420px)";      // how tall the skeleton is on screen
  const EDGE     = "1rem";                  // gap between the skeleton and the right edge
  // ------------------------------------------------------------

  // Skip it for visitors who turned on "reduce motion" on their device.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const door = document.getElementById("door");
  if (!door) return;

  // The skeleton is on a black background, and "screen" blending
  // makes the black invisible, so only the skeleton shows.
  const video = document.createElement("video");
  video.muted = true;          // muted videos are allowed to play by themselves
  video.playsInline = true;    // play in the page on iPhones, not fullscreen
  video.setAttribute("playsinline", "");
  video.preload = "auto";
  video.setAttribute("aria-hidden", "true");
  video.style.cssText =
    "position:fixed;right:" + EDGE + ";top:50%;transform:translateY(-50%);" +
    "height:" + HEIGHT + ";width:auto;pointer-events:none;z-index:8;" +
    "mix-blend-mode:screen;opacity:0;transition:opacity .4s ease";
  document.body.append(video);

  // Start downloading only after the page has loaded, so it never slows the site down.
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

  // Fade out and clean up when the dance is over.
  video.addEventListener("ended", () => {
    video.style.opacity = "0";
    setTimeout(() => video.remove(), 500);
  });
})();
