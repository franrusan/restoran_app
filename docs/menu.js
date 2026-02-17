// menu.js (radi s data-key + #food/#drinks + closeModal/dishImg/dishDesc)

// ===== Tabs animacija (Food/Drinks) =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabFood = document.getElementById('food');
const tabDrinks = document.getElementById('drinks');

let current = 'food';
let busy = false;

function cleanClasses(el) {
  if (!el) return;
  el.classList.remove('enter-left', 'enter-right', 'exit-left', 'exit-right');
}

function switchTab(target) {
  if (!tabFood || !tabDrinks) return;
  if (busy || target === current) return;
  busy = true;

  const fromEl = current === 'food' ? tabFood : tabDrinks;
  const toEl   = target === 'food' ? tabFood : tabDrinks;

  // aktivni gumb
  tabButtons.forEach(b => b.classList.toggle('is-active', b.dataset.tab === target));

  const goingToDrinks = target === 'drinks';
  const exitClass  = goingToDrinks ? 'exit-left'   : 'exit-right';
  const enterClass = goingToDrinks ? 'enter-right' : 'enter-left';

  // EXIT
  cleanClasses(fromEl);
  fromEl.classList.add(exitClass);

  setTimeout(() => {
    // sakrij stari
    fromEl.classList.add('hidden');
    cleanClasses(fromEl);

    // pokaži novi (ENTER)
    toEl.classList.remove('hidden');
    cleanClasses(toEl);
    toEl.classList.add(enterClass);

    // force reflow
    void toEl.offsetWidth;

    requestAnimationFrame(() => {
      cleanClasses(toEl);
      busy = false;
      current = target;
    });
  }, 500);
}

if (tabButtons.length) {
  tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
}

// ===== Modal (radi s closeModal/dishImg/dishDesc) =====
const dishModal = document.getElementById('dishModal');
const closeBtn = document.getElementById('closeModal');
const dishTitle = document.getElementById('dishTitle');
const dishImg = document.getElementById('dishImg');
const dishDesc = document.getElementById('dishDesc');
const dishIngredients = document.getElementById('dishIngredients');
const dishSteps = document.getElementById('dishSteps');

// menu-page.js
document.addEventListener("click", (e) => {
  const item = e.target.closest(".item");
  if (!item) return;

  const key = item.dataset.key;
  if (!key) return;

  // utvrdi jel klik došao s Food ili Drinks papira
  const paper = item.closest(".paper");
  const from = paper?.classList.contains("back") ? "drinks" : "food";

  window.location.href = `item.html?id=${encodeURIComponent(key)}&from=${from}`;
});
(function(){
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");
  if (!tab) return;

  const food = document.getElementById("page-food");
  const drinks = document.getElementById("page-drinks");

  if (tab === "drinks" && drinks) drinks.checked = true;
  if (tab === "food" && food) food.checked = true;
})();
