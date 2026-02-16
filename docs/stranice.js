// ===== Dropdown hamburger (clickable) =====
const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdown');

function setDropdown(open){
    dropdown.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

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

// ===== Dish modal data (extend easily) =====
const dishes = {
    soup1: {
    title: "Krem juha od povrća",
    photo: "assets/juha-povrce.jpg",
    ingredients: ["1 luk", "Sezonsko povrće", "Povrtni temeljac", "Maslinovo ulje", "Sol, papar", "Limunova korica"],
    steps: ["Sotiraj luk 3–4 min.", "Dodaj povrće i temeljac.", "Kuhaj 20–25 min.", "Izmiksaj u kremu.", "Začini i posluži."]
    },
    soup2: {
    title: "Juha od bundeve",
    photo: "assets/juha-bundeva.jpeg",
    ingredients: ["Bundeva", "Luk", "Temeljac", "Kiselo vrhnje", "Sjemenke", "Začini"],
    steps: ["Zapeći bundevu.", "Skuhaj s temeljcem.", "Izmiksaj.", "Dodaj vrhnje.", "Posipaj sjemenkama."]
    },
    main1: {
    title: "Sporo pečeno meso",
    photo: "assets/pulled-pork.jpg",
    ingredients: ["Meso", "Timijan", "Sol, papar", "Umak (temeljac)", "Sezonski prilog"],
    steps: ["Začini i zapeci.", "Peci na 160°C 45–60 min.", "Pripremi prilog.", "Reduciraj umak.", "Serviraj."]
    },
    main2: {
    title: "Riblji file",
    photo: "assets/riba.jpg",
    ingredients: ["Riblji file", "Maslac", "Limun", "Povrće", "Sol, papar"],
    steps: ["Začini ribu.", "Zapeći s maslacem.", "Dodaj limun.", "Povrće na žaru.", "Spoji i posluži."]
    },
    dessert1: {
    title: "Voće & krema",
    photo: "assets/kreme_vocna.jpg",
    ingredients: ["Voće", "Krema", "Keks/tuile", "Citrus", "Šećer u prahu"],
    steps: ["Pripremi kremu.", "Mariniraj voće.", "Složi slojeve.", "Dovrši prah šećer.", "Serviraj."]
    },
    dessert2: {
    title: "Čokoladni mousse",
    photo: "assets/coko-mus.jpg",
    ingredients: ["Tamna čokolada", "Vrhnje", "Jaje", "Prstohvat soli", "Crumble"],
    steps: ["Otopi čokoladu.", "Umuti vrhnje.", "Spoji i ohladi.", "Dodaj crumble.", "Posluži hladno."]
    },
};
const drinks = {
    drink1: {
    title: "Negroni",
    photo: "assets/smoked-negroni.jpg",
    description: "Gin, Campari i slatki vermut — gorko-slatki klasik."
    },
    drink2: {
    title: "Whiskey Sour",
    photo: "assets/whiskey-sour.jpg",
    description: "Whiskey, limun i šećerni sirup — svježe i balansirano."
    },
    drink3: {
    title: "Chardonnay (0.15)",
    photo: "assets/chardonnay.jpg",
    description: "Suho bijelo vino, voćno, idealno uz ribu i tjesteninu."
    },
    drink4: {
    title: "Plavac Mali (0.15)",
    photo: "assets/vino.jpg",
    description: "Crno vino punog tijela, tamno voće i začini."
    },
};

// ===== Modal open/close =====
const dishModal = document.getElementById('dishModal');
const closeDish = document.getElementById('closeDish');
const dishTitle = document.getElementById('dishTitle');
const dishPhoto = document.getElementById('dishPhoto');
const dishIngredients = document.getElementById('dishIngredients');
const dishSteps = document.getElementById('dishSteps');
const drinkDescBox = document.getElementById('drinkDescBox');
const drinkDesc = document.getElementById('drinkDesc');


function openDish(key){
    const d = dishes[key];
    if (!d) return;

    dishTitle.textContent = d.title || "Detalji";
    dishPhoto.src = d.photo || "assets/cocktail.jpeg";

    // ako nema ingredients/steps, sakrij sekcije
    const ing = Array.isArray(d.ingredients) ? d.ingredients : [];
    const stp = Array.isArray(d.steps) ? d.steps : [];

    dishIngredients.innerHTML = ing.map(x => `<li>${x}</li>`).join('');
    dishSteps.innerHTML = stp.map(x => `<li>${x}</li>`).join('');

    // sakrij box ako je prazan
    const ingBox = dishIngredients.closest('.box');
    const stpBox = dishSteps.closest('.box');

    if (ingBox) ingBox.style.display = ing.length ? '' : 'none';
    if (stpBox) stpBox.style.display = stp.length ? '' : 'none';

    dishModal.classList.add('open');
    dishModal.setAttribute('aria-hidden', 'false');
}

function closeDishModal(){
    dishModal.classList.remove('open');
    dishModal.setAttribute('aria-hidden', 'true');
}

function openDish(id){

    const d = dishes[id];
    if (!d) return;

    dishTitle.textContent = d.title;
    dishPhoto.src = d.photo || "assets/plate1.png";

    // prikaz FOOD layouta
    drinkDescBox.style.display = "none";

    dishIngredients.closest('.box').style.display = "";
    dishSteps.closest('.box').style.display = "";

    dishIngredients.innerHTML = d.ingredients.map(x => `<li>${x}</li>`).join('');
    dishSteps.innerHTML = d.steps.map(x => `<li>${x}</li>`).join('');

    dishModal.classList.add('open');
    dishModal.setAttribute('aria-hidden', 'false');
}

function openDrink(id){

    const d = drinks[id];
    if (!d) return;

    dishTitle.textContent = d.title;
    dishPhoto.src = d.photo || "assets/cocktail.jpeg";

    // prikaz DRINK layouta (samo slika + opis)
    drinkDescBox.style.display = "";
    drinkDesc.textContent = d.description || "";

    dishIngredients.closest('.box').style.display = "none";
    dishSteps.closest('.box').style.display = "none";

    dishModal.classList.add('open');
    dishModal.setAttribute('aria-hidden', 'false');
}


document.addEventListener('click', (e) => {
const item = e.target.closest('.item');
if (!item) return;

const type = item.dataset.type; // "dish" ili "drink"
const id = item.dataset.id;

if (type === "dish") openDish(id);
if (type === "drink") openDrink(id);
});


closeDish.addEventListener('click', closeDishModal);
dishModal.addEventListener('click', (e) => { if (e.target === dishModal) closeDishModal(); });

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
    setDropdown(false);
    if (dishModal.classList.contains('open')) closeDishModal();
    }
});

// ===== Tabs animacija (Food/Drinks) =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabFood = document.getElementById('tab-food');
const tabDrinks = document.getElementById('tab-drinks');

let current = 'food';
let busy = false;

function cleanClasses(el){
el.classList.remove('enter-left','enter-right','exit-left','exit-right');
}

function switchTab(target){
if (busy || target === current) return;
busy = true;

const fromEl = current === 'food' ? tabFood : tabDrinks;
const toEl   = target === 'food' ? tabFood : tabDrinks;

// aktivni gumb
tabButtons.forEach(b => b.classList.toggle('is-active', b.dataset.tab === target));

// Smjer "listanja":
// Food -> Drinks: food izlazi lijevo, drinks ulazi s desna
// Drinks -> Food: drinks izlazi desno, food ulazi s lijeva
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

// force reflow da animacija krene
void toEl.offsetWidth;

// makni enter klasu -> ide u normalno stanje
requestAnimationFrame(() => {
cleanClasses(toEl);
busy = false;
current = target;
});

}, 500);
}

tabButtons.forEach(btn => {
btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});




// ===== Entrance animacija kartica (fade + smjer) =====
const cards = document.querySelectorAll('.section-card');

// 1) prva kartica odmah vidljiva (bez animacije)
if (cards[0]) {
cards[0].classList.remove('reveal', 'from-left', 'from-right');
cards[0].classList.add('in-view');
}

cards.forEach((card, idx) => {
if (idx === 0) return;
card.classList.add('reveal', 'from-left');
});

// 3) observer
const io = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add('in-view');
    io.unobserve(entry.target); // animira samo prvi put
    }
});
}, { threshold: 0.08, rootMargin: "0px 0px -10% 0px" });

// 4) promatraj samo reveal kartice
cards.forEach((card, idx) => {
if (idx === 0) return;
io.observe(card);
});
