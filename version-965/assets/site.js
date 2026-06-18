(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var root = panel.parentElement || document;
    var input = panel.querySelector('[data-search-input]');
    var year = panel.querySelector('[data-filter-year]');
    var type = panel.querySelector('[data-filter-type]');
    var region = panel.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card, .hot-item'));

    function applyFilters() {
      var q = normalize(input && input.value);
      var y = normalize(year && year.value);
      var t = normalize(type && type.value);
      var r = normalize(region && region.value);

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.keywords,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year
        ].join(' '));
        var ok = true;

        if (q && haystack.indexOf(q) === -1) {
          ok = false;
        }

        if (y && normalize(card.dataset.year) !== y) {
          ok = false;
        }

        if (t && normalize(card.dataset.type).indexOf(t) === -1) {
          ok = false;
        }

        if (r && normalize(card.dataset.region).indexOf(r) === -1) {
          ok = false;
        }

        card.classList.toggle('is-hidden-card', !ok);
      });
    }

    [input, year, type, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  });

  function initPlayer(videoId, overlayId, src) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var hls = null;

    if (!video || !overlay || !src) {
      return;
    }

    function bindSource() {
      if (video.dataset.ready === '1') {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }

      video.dataset.ready = '1';
    }

    function startPlayback() {
      bindSource();
      overlay.classList.add('is-hidden');
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    }

    overlay.addEventListener('click', startPlayback);
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        overlay.classList.remove('is-hidden');
      }
    });
    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.MovieSite = {
    player: initPlayer
  };
})();
