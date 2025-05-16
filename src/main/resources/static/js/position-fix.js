// Force correct positioning of action buttons
document.addEventListener('DOMContentLoaded', function() {
  setInterval(function() {
    document.querySelectorAll('.action-buttons').forEach(function(el) {
      el.style.position = 'absolute';
      el.style.bottom = '10px';
      el.style.left = '10px';
      el.style.top = 'auto';
      el.style.right = 'auto';
    });
  }, 500);
});