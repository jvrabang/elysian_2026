document.addEventListener('DOMContentLoaded', function () {
  const faqButtons = document.querySelectorAll('.faq-item button');

  faqButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const faqItem = button.closest('.faq-item');
      const isOpen = faqItem.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  const navLinks = document.querySelectorAll('.page-nav a');
  const path = window.location.pathname.split('/').pop();
  navLinks.forEach(function (link) {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
});
