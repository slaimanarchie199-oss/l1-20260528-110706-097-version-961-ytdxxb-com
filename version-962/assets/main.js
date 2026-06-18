(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");
  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  if (slides.length > 1) {
    var index = 0;
    var show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
  filterForms.forEach(function (form) {
    var scope = document.querySelector(form.getAttribute("data-filter-form"));
    if (!scope) return;
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
    var empty = document.querySelector(".search-empty");
    var queryInput = form.querySelector("input[type='search']");
    var yearSelect = form.querySelector("select[name='year']");
    var apply = function () {
      var keyword = queryInput ? queryInput.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = [card.dataset.title, card.dataset.region, card.dataset.genre, card.dataset.year].join(" ").toLowerCase();
        var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchedYear = !year || card.dataset.year === year;
        var visible = matchedKeyword && matchedYear;
        card.style.display = visible ? "" : "none";
        if (visible) shown += 1;
      });
      if (empty) {
        empty.classList.toggle("is-visible", shown === 0);
      }
    };
    form.addEventListener("input", apply);
    form.addEventListener("change", apply);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      apply();
    });
    apply();
  });

  var params = new URLSearchParams(window.location.search);
  var q = params.get("q");
  if (q) {
    Array.prototype.slice.call(document.querySelectorAll("input[type='search']")).forEach(function (input) {
      if (!input.value) input.value = q;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
})();
