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

// ===== Podaci (ključevi MORAJU odgovarati data-key u HTML-u) =====
const menuData = {
  // FOOD
  soup1: {
    kind: "dish",
    title: "Krem juha od povrća",
    photo: "assets/juha-povrce.jpg",
    desc: "Lagano, sezonski, citrusni završetak.",
    ingredients: ["1 luk", "Sezonsko povrće", "Povrtni temeljac", "Maslinovo ulje", "Sol, papar", "Limunova korica"],
    steps: ["Sotiraj luk 3–4 min.", "Dodaj povrće i temeljac.", "Kuhaj 20–25 min.", "Izmiksaj u kremu.", "Začini i posluži."]
  },
  soup2: {
    kind: "dish",
    title: "Juha od bundeve",
    photo: "assets/juha-bundeva.jpeg",
    desc: "Kremasta tekstura, tostirane sjemenke.",
    ingredients: ["Bundeva", "Luk", "Temeljac", "Kiselo vrhnje", "Sjemenke", "Začini"],
    steps: ["Zapeći bundevu.", "Skuhaj s temeljcem.", "Izmiksaj.", "Dodaj vrhnje.", "Posipaj sjemenkama."]
  },
  main1: {
    kind: "dish",
    title: "Sporo pečeno meso",
    photo: "assets/pulled-pork.jpg",
    desc: "Umak od temeljca, sezonski prilog.",
    ingredients: ["Meso", "Timijan", "Sol, papar", "Umak (temeljac)", "Sezonski prilog"],
    steps: ["Začini i zapeci.", "Peci na 160°C 45–60 min.", "Pripremi prilog.", "Reduciraj umak.", "Serviraj."]
  },
  main2: {
    kind: "dish",
    title: "Riblji file",
    photo: "assets/riba.jpg",
    desc: "Maslac-limun, povrće na žaru.",
    ingredients: ["Riblji file", "Maslac", "Limun", "Povrće", "Sol, papar"],
    steps: ["Začini ribu.", "Zapeći s maslacem.", "Dodaj limun.", "Povrće na žaru.", "Spoji i posluži."]
  },
  dessert1: {
    kind: "dish",
    title: "Voće & krema",
    photo: "assets/kreme_vocna.jpg",
    desc: "Lagano, svježe, hrskavi element.",
    ingredients: ["Voće", "Krema", "Keks/tuile", "Citrus", "Šećer u prahu"],
    steps: ["Pripremi kremu.", "Mariniraj voće.", "Složi slojeve.", "Dovrši prah šećer.", "Serviraj."]
  },
  dessert2: {
    kind: "dish",
    title: "Čokoladni mousse",
    photo: "assets/coko-mus.jpg",
    desc: "Dubok okus, malo soli, crumble.",
    ingredients: ["Tamna čokolada", "Vrhnje", "Jaje", "Prstohvat soli", "Crumble"],
    steps: ["Otopi čokoladu.", "Umuti vrhnje.", "Spoji i ohladi.", "Dodaj crumble.", "Posluži hladno."]
  },

  // DRINKS
  drink1: {
    kind: "drink",
    title: "Negroni",
    photo: "assets/smoked-negroni.jpg",
    desc: "Gin, Campari i slatki vermut — gorko-slatki klasik."
  },
  drink2: {
    kind: "drink",
    title: "Whiskey Sour",
    photo: "assets/whiskey-sour.jpg",
    desc: "Whiskey, limun i šećerni sirup — svježe i balansirano."
  },
  drink3: {
    kind: "drink",
    title: "Chardonnay (0.15)",
    photo: "assets/chardonnay.jpg",
    desc: "Suho bijelo vino, voćno, idealno uz ribu i tjesteninu."
  },
  drink4: {
    kind: "drink",
    title: "Plavac Mali (0.15)",
    photo: "assets/vino.jpg",
    desc: "Crno vino punog tijela, tamno voće i začini."
  }
};


