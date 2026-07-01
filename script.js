// Main scripts for kinahub website

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  // Lazy load products module into the products section
  const productsSection = document.getElementById('products');
  if (productsSection) {
    import('./assets/Products.js')
      .then(module => {
        productsSection.innerHTML = module.default.render();
      })
      .catch(error => {
        console.warn('Failed to load products:', error);
        productsSection.innerHTML = '<p>Products are currently unavailable. Please try again later.</p>';
      });
  }
});