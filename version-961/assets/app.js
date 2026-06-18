(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var show = function (index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show((current + 1) % slides.length);
      }, 5000);
    }
  }

  var pageFilter = document.getElementById('pageFilter');
  if (pageFilter) {
    var filterList = document.querySelector('[data-filter-list]');
    var items = filterList ? Array.prototype.slice.call(filterList.children) : [];
    pageFilter.addEventListener('input', function () {
      var q = pageFilter.value.trim().toLowerCase();
      items.forEach(function (item) {
        var text = item.textContent.toLowerCase() + ' ' + Array.prototype.map.call(item.attributes, function (a) {
          return a.value;
        }).join(' ').toLowerCase();
        item.style.display = text.indexOf(q) >= 0 ? '' : 'none';
      });
    });
  }

  var globalSearch = document.getElementById('globalSearch');
  var searchResults = document.getElementById('searchResults');
  if (globalSearch && searchResults && Array.isArray(window.SITE_MOVIES || SITE_MOVIES)) {
    var movies = window.SITE_MOVIES || SITE_MOVIES;
    var render = function (list) {
      searchResults.innerHTML = list.slice(0, 24).map(function (item) {
        var tags = item.tags.slice(0, 3).map(function (tag) {
          return '<span>#' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<article class="movie-card search-card">' +
          '<a class="card-cover" href="' + item.url + '">' +
          '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
          '<span class="card-play">▶</span>' +
          '</a>' +
          '<div class="card-body">' +
          '<div class="card-meta"><a href="#search">' + escapeHtml(item.category) + '</a><span>' + escapeHtml(item.year) + '</span></div>' +
          '<h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>' +
          '<p>' + escapeHtml(item.oneLine) + '</p>' +
          '<div class="tag-row">' + tags + '</div>' +
          '</div>' +
          '</article>';
      }).join('');
    };
    var search = function () {
      var q = globalSearch.value.trim().toLowerCase();
      if (!q) {
        render(movies.slice(0, 12));
        return;
      }
      var result = movies.filter(function (item) {
        var text = [item.title, item.category, item.year, item.region, item.type, item.genre, item.tags.join(' ')].join(' ').toLowerCase();
        return text.indexOf(q) >= 0;
      });
      render(result);
    };
    globalSearch.addEventListener('input', search);
    render(movies.slice(0, 12));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char];
    });
  }
})();
