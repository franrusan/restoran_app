// site.js - globalno: hamburger dropdown + reveal kartice

// ===== Dropdown hamburger (clickable) =====
const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdown');

function setDropdown(open) {
  if (!dropdown || !menuBtn) return;
  dropdown.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

if (menuBtn && dropdown) {
  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdown(!dropdown.classList.contains('open'));
  });

  document.addEventListener('click', (e) => {
    const clickedInside = dropdown.contains(e.target) || menuBtn.contains(e.target);
    if (!clickedInside) setDropdown(false);
  });

  document.querySelectorAll('.dd').forEach(a => {
    a.addEventListener('click', () => setDropdown(false));
  });
}

// ===== Entrance animacija kartica (fade + smjer) =====
const cards = document.querySelectorAll('.section-card');

if (cards.length) {
  // 1) prva kartica odmah vidljiva (bez animacije)
  if (cards[0]) {
    cards[0].classList.remove('reveal', 'from-left', 'from-right');
    cards[0].classList.add('in-view');
  }

  // 2) ostale kartice pripremi za animaciju
  cards.forEach((card, idx) => {
    if (idx === 0) return;
    card.classList.add('reveal', 'from-left');
  });

  // 3) observer
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -10% 0px" });

  // 4) promatraj samo reveal kartice
  cards.forEach((card, idx) => {
    if (idx === 0) return;
    io.observe(card);
  });
}

// ===== ESC key (zatvori dropdown ako postoji) =====
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    setDropdown(false);
  }
});
