(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var button = document.querySelector("[data-mobile-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function initHeroSlider() {
    var slider = document.querySelector("[data-slider]");
    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-slide-dot]"));
    if (slides.length <= 1) {
      return;
    }

    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, currentIndex) {
        slide.classList.toggle("is-active", currentIndex === activeIndex);
      });
      dots.forEach(function (dot, currentIndex) {
        dot.classList.toggle("is-active", currentIndex === activeIndex);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5600);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  function normalize(text) {
    return (text || "").toString().toLowerCase().trim();
  }

  function initMovieFilters() {
    var list = document.querySelector("[data-filter-list]");
    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]"));
    var queryInput = document.querySelector("[data-filter-query]");
    var regionSelect = document.querySelector("[data-filter-region]");
    var genreSelect = document.querySelector("[data-filter-genre]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var countNode = document.querySelector("[data-filter-count]");
    var emptyNode = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);

    if (queryInput && params.get("q")) {
      queryInput.value = params.get("q");
    }
    if (genreSelect && params.get("genre")) {
      genreSelect.value = params.get("genre");
    }
    if (regionSelect && params.get("region")) {
      regionSelect.value = params.get("region");
    }
    if (yearSelect && params.get("year")) {
      yearSelect.value = params.get("year");
    }

    function update() {
      var query = normalize(queryInput && queryInput.value);
      var region = normalize(regionSelect && regionSelect.value);
      var genre = normalize(genreSelect && genreSelect.value);
      var year = normalize(yearSelect && yearSelect.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var cardRegion = normalize(card.getAttribute("data-region"));
        var cardGenre = normalize(card.getAttribute("data-genre"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (region && cardRegion.indexOf(region) === -1) {
          matched = false;
        }
        if (genre && cardGenre.indexOf(genre) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }

        card.classList.toggle("hidden-by-filter", !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (countNode) {
        countNode.textContent = "共显示 " + visible + " 部";
      }
      if (emptyNode) {
        emptyNode.classList.toggle("is-visible", visible === 0);
      }
    }

    [queryInput, regionSelect, genreSelect, yearSelect].forEach(function (control) {
      if (!control) {
        return;
      }
      control.addEventListener("input", update);
      control.addEventListener("change", update);
    });

    update();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("video[data-hls-src]"));
    if (!players.length) {
      return;
    }

    players.forEach(function (video) {
      var source = video.getAttribute("data-hls-src");
      var status = video.closest("section, main") && video.closest("section, main").querySelector("[data-player-status]");
      if (!source) {
        if (status) {
          status.textContent = "当前影片没有配置播放源。";
        }
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        if (status) {
          status.textContent = "已绑定原生 HLS 播放源，点击播放即可观看。";
        }
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (status) {
            status.textContent = "HLS 播放源已加载，点击播放即可观看。";
          }
        });
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (status && data && data.fatal) {
            status.textContent = "播放源加载失败，请刷新页面或更换浏览器后重试。";
          }
        });
        return;
      }

      if (status) {
        status.textContent = "当前浏览器暂不支持 HLS 播放，请使用最新版 Chrome、Edge 或 Safari。";
      }
    });
  }

  ready(function () {
    initMobileMenu();
    initHeroSlider();
    initMovieFilters();
    initPlayers();
  });
})();
