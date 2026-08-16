window.addEventListener('DOMContentLoaded', function () {
  setupNewsFilters();
});

/* 6. News filter buttons */
function setupNewsFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const newsItems = document.querySelectorAll('[data-category]');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn === button);
      });

      newsItems.forEach(function (item) {
        const itemCategory = item.dataset.category;

        if (selectedCategory === 'all' || selectedCategory === itemCategory) {
          item.style.display = 'grid';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
