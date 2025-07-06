document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.getElementById('menu');
  const nav = document.getElementById('main-nav');
  menuButton.addEventListener('click', function() {
    if (nav.style.display === 'block') {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'block';
    }
  });
  // Hide nav by default on small screens
  function handleResize() {
    if (window.innerWidth >= 700) {
      nav.style.display = 'block';
    } else {
      nav.style.display = 'none';
    }
  }
  window.addEventListener('resize', handleResize);
  handleResize();
}); 