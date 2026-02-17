// item.js
const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const from = params.get("from") || "food";

  // back link
  const back = $("backToMenu");
  if (back) back.href = `menu.html?tab=${encodeURIComponent(from)}`;

  // provjera da postoji data
  const data = window.MENU_DATA;
  if (!data) {
    if ($("itemTitle")) $("itemTitle").textContent = "Greška: MENU_DATA nije učitan (provjeri menu-data.js i redoslijed scriptova).";
    console.error("MENU_DATA is undefined. menu-data.js not loaded?");
    return;
  }

  const item = data[id];
  if (!id || !item) {
    if ($("itemTitle")) $("itemTitle").textContent = "Stavka nije pronađena (krivi id u URL-u).";
    console.error("Missing id or item:", { id, item });
    return;
  }

  // popuni osnovno
  if ($("itemTitle")) $("itemTitle").textContent = item.title || "—";
  if ($("itemCategory")) $("itemCategory").textContent = item.category || "";
  if ($("itemPrice")) $("itemPrice").textContent = item.price || "";
  if ($("itemDesc")) $("itemDesc").textContent = item.desc || "";

  const img = $("itemPhoto");
  if (img) {
    img.src = item.photo || "";
    img.alt = item.title || "Photo";
  }

  // dish vs drink
  const dishOnly = $("dishOnly");
  if (item.type === "drink") {
    if (dishOnly) dishOnly.style.display = "none";
  } else {
    if (dishOnly) dishOnly.style.display = "";
    if ($("itemIngredients")) {
      $("itemIngredients").innerHTML = (item.ingredients || []).map(x => `<li>${x}</li>`).join("");
    }
    if ($("itemSteps")) {
      $("itemSteps").innerHTML = (item.steps || []).map(x => `<li>${x}</li>`).join("");
    }
  }

  document.title = item.title || "Stavka";
});
