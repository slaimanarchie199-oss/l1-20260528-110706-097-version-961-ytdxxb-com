import { H as Hls } from "./hls-vendor.js";

export function setupPlayer(source) {
  var video = document.querySelector(".player-video");
  var cover = document.querySelector(".player-cover");
  if (!video || !source) return;

  var ready = false;
  var hls = null;

  var attach = function () {
    if (ready) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
    ready = true;
  };

  var start = function () {
    attach();
    if (cover) cover.classList.add("is-hidden");
    var playRequest = video.play();
    if (playRequest && typeof playRequest.catch === "function") {
      playRequest.catch(function () {
        if (cover) cover.classList.remove("is-hidden");
      });
    }
  };

  if (cover) cover.addEventListener("click", start);
  video.addEventListener("click", function () {
    if (!ready || video.paused) start();
  });
  video.addEventListener("play", function () {
    if (cover) cover.classList.add("is-hidden");
  });
}
