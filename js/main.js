// Initialize Lucide Icons
if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
  lucide.createIcons();
}

    // Responsive Mobile Hamburger Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOpenIcon = document.getElementById('menuOpenIcon');
    const menuCloseIcon = document.getElementById('menuCloseIcon');

    if (mobileMenuBtn && mobileMenu) {
      function toggleMobileMenu(forceState) {
        const isHidden = mobileMenu.classList.contains('hidden');
        const shouldOpen = typeof forceState === 'boolean' ? forceState : isHidden;
        mobileMenu.classList.toggle('hidden', !shouldOpen);
        mobileMenuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        if (menuOpenIcon) menuOpenIcon.classList.toggle('hidden', shouldOpen);
        if (menuCloseIcon) menuCloseIcon.classList.toggle('hidden', !shouldOpen);
      }

      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
      });

      // Close menu on link selection
      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          toggleMobileMenu(false);
        });
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
          toggleMobileMenu(false);
        }
      });

      // Close menu on click outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          toggleMobileMenu(false);
        }
      });
    }

    // 3D Card Tilt Effect on Mouse Move
    const tiltCard = document.getElementById('tiltCard');
    if (tiltCard && window.innerWidth > 768) {
      document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xOffset = (clientX / innerWidth - 0.5) * 16;
        const yOffset = (clientY / innerHeight - 0.5) * -16;

        tiltCard.style.transform = `perspective(1000px) rotateX(${yOffset}deg) rotateY(${xOffset}deg)`;
      });

      document.addEventListener('mouseleave', () => {
        tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    }