(function () {
  const menuButton = document.querySelector('.js-menu-toggle');
  const mobileMenu = document.querySelector('.js-mobile-menu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.js-site-search').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = form.querySelector('input');
      const query = input ? input.value.trim() : '';
      if (query) {
        window.location.href = './search.html?q=' + encodeURIComponent(query);
      }
    });
  });

  const filterInput = document.querySelector('.js-filter-input');
  if (filterInput) {
    const cards = Array.from(document.querySelectorAll('[data-filter-card]'));
    filterInput.addEventListener('input', function () {
      const keyword = filterInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = (card.getAttribute('data-filter-text') || '').toLowerCase();
        card.classList.toggle('hidden', keyword && text.indexOf(keyword) === -1);
      });
    });
  }
}());
