document.addEventListener('DOMContentLoaded', function() {
  // Existing audio player functionality
  var audioPlayer = document.getElementById('audio-player');
  if (audioPlayer) {
    var playButton = document.getElementById('play-audio');
    if (playButton) {
      playButton.addEventListener('click', function() {
        audioPlayer.play();
      });
    }
  }

  // Theme toggle (if applicable)
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
    });
  }

  // Fixed N+1 Query: Batch inventory requests
  var productContainer = document.getElementById('product-list');
  if (productContainer) {
    fetch('/api/products')
      .then(response => response.json())
      .then(products => {
        var ids = products.map(p => p.id).join(',');
        return fetch('/api/inventory?product_ids=' + ids)
          .then(response => response.json())
          .then(inventoryList => {
            var inventoryMap = {};
            inventoryList.forEach(function(inv) {
              inventoryMap[inv.product_id] = inv;
            });
            // Render products with inventory
            products.forEach(function(product) {
              var inv = inventoryMap[product.id];
              if (inv) {
                // Update DOM element for product with inventory data
                // Example: document.getElementById('stock-' + product.id).textContent = inv.quantity;
              }
            });
          });
      })
      .catch(error => console.error('Error fetching product inventory:', error));
  }
});