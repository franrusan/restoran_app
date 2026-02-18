document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:3001";

  // ====== Date: default today + min today + show picker on click ======
  function pad2(n) { return String(n).padStart(2, "0"); }

  const dateEl = document.getElementById("date");
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

  if (dateEl) {
    dateEl.value = todayStr;
    dateEl.min = todayStr;

    dateEl.addEventListener("click", () => {
      if (dateEl.showPicker) dateEl.showPicker();
    });
    dateEl.addEventListener("focus", () => {
      if (dateEl.showPicker) dateEl.showPicker();
    });
  }

  // ====== Custom select (cselect) logic ======
  function closeAllSelects(except = null) {
    document.querySelectorAll(".cselect.open").forEach((el) => {
      if (el !== except) {
        el.classList.remove("open");
        const btn = el.querySelector(".cselect-btn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("click", (e) => {
    const cs = e.target.closest(".cselect");
    if (!cs) { closeAllSelects(); return; }

    const btn = e.target.closest(".cselect-btn");
    if (btn) {
      const isOpen = cs.classList.contains("open");
      closeAllSelects(cs);
      cs.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      return;
    }

    const opt = e.target.closest(".cselect-opt");
    if (opt) {
      const hidden = cs.querySelector('input[type="hidden"]');
      const valueSpan = cs.querySelector(".cselect-value");
      if (!hidden || !valueSpan) return;

      cs.querySelectorAll(".cselect-opt").forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");

      hidden.value = opt.dataset.value;
      valueSpan.textContent = opt.textContent;

      cs.classList.remove("open");
      const b = cs.querySelector(".cselect-btn");
      if (b) b.setAttribute("aria-expanded", "false");

      // Nakon odabira people ili date -> refresh availability
      if (cs.dataset.name === "people") {
        refreshAvailability();
      }
      if (cs.dataset.name === "time") {
        // ništa
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllSelects();
  });

  // ====== Availability (populate TIME custom dropdown from backend) ======
  const peopleHidden = document.getElementById("people"); // hidden input
  const timeHidden = document.getElementById("time");     // hidden input

  const timeCSelect = document.querySelector('.cselect[data-name="time"]');
  const timeList = timeCSelect?.querySelector(".cselect-list");
  const timeValueSpan = timeCSelect?.querySelector(".cselect-value");

  function resetTimeUI() {
    if (timeHidden) timeHidden.value = "";
    if (timeValueSpan) timeValueSpan.textContent = "Odaberi";
    if (timeCSelect) timeCSelect.querySelectorAll(".cselect-opt").forEach(o => o.classList.remove("selected"));
  }

  function renderTimeOptions(times) {
    if (!timeList) return;

    timeList.innerHTML = "";

    if (!times || times.length === 0) {
      const li = document.createElement("li");
      li.className = "cselect-opt";
      li.textContent = "Nema slobodnih termina";
      li.style.opacity = "0.7";
      li.style.pointerEvents = "none";
      timeList.appendChild(li);
    } else {
      for (const t of times) {
        const li = document.createElement("li");
        li.className = "cselect-opt";
        li.setAttribute("role", "option");
        li.dataset.value = t;
        li.textContent = t;
        timeList.appendChild(li);
      }
    }

    resetTimeUI();
  }

  async function refreshAvailability() {
    const date = dateEl?.value;
    const people = peopleHidden?.value;

    // Ako nije odabrano oboje, samo očisti time listu
    if (!date || !people) {
      renderTimeOptions([]);
      return;
    }

    try {
      const r = await fetch(
        `${API_BASE}/availability?date=${encodeURIComponent(date)}&people=${encodeURIComponent(people)}`
      );
      const data = await r.json();

      if (!r.ok) throw new Error(data?.error || "Greška");
      renderTimeOptions(data.available || []);
    } catch (err) {
      console.error(err);
      renderTimeOptions([]);
    }
  }

  if (dateEl) dateEl.addEventListener("change", refreshAvailability);

  // Po defaultu: dok ne odabereš people, time neka bude prazno
  renderTimeOptions([]);

  // ====== Submit -> POST /reservations ======
  const form = document.getElementById("reserveForm");
  const msg = document.getElementById("reserveMsg");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msg) msg.textContent = "";

    const payload = {
      firstName: document.getElementById("firstName")?.value.trim(),
      lastName: document.getElementById("lastName")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      people: peopleHidden?.value,
      date: dateEl?.value,
      time: timeHidden?.value,
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.people || !payload.date || !payload.time) {
      if (msg) msg.textContent = "Molim ispuni ime, prezime, email te odaberi broj ljudi, datum i vrijeme.";
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json();

      if (r.status === 409) {
        if (msg) msg.textContent = "Nažalost, termin je upravo popunjen. Odaberi drugi.";
        await refreshAvailability();
        return;
      }

      if (!r.ok) throw new Error(data?.error || "Greška");

      if (msg) msg.textContent = "Rezervacija spremljena! Vidimo se 😊";
      form.reset();

      // vrati date na today + reset custom selects
      if (dateEl) {
        dateEl.value = todayStr;
        dateEl.min = todayStr;
      }
      if (peopleHidden) peopleHidden.value = "";
      resetTimeUI();

      const peopleValueSpan = document.querySelector('.cselect[data-name="people"] .cselect-value');
      if (peopleValueSpan) peopleValueSpan.textContent = "Odaberi";

      // očisti time listu dok opet ne odabere people
      renderTimeOptions([]);
    } catch (err) {
      console.error(err);
      if (msg) msg.textContent = "Greška pri slanju. Pokušaj ponovno.";
    }
  });
});
