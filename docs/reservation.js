 function pad2(n){ return String(n).padStart(2, '0'); }

  // ===== Set default date to today + min=today =====
  const dateEl = document.getElementById('date');
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = pad2(today.getMonth() + 1);
  const dd = pad2(today.getDate());
  const todayStr = `${yyyy}-${mm}-${dd}`;

  dateEl.value = todayStr;     // default selected
  dateEl.min = todayStr;       // cannot pick past

  // ===== Time dropdown every 1h between 16 and 24 =====
  // Napomena: 24:00 se često NE podržava kao value. Koristimo 23:00 kao zadnji sat.
  // Ako baš želiš "24:00", bolja praksa je ponuditi "00:00 (sljedeći dan)".
  const timeEl = document.getElementById('time');
  const OPEN_HOUR = 16;
  const CLOSE_HOUR = 24; // interpretirano kao "do 24", zadnji slot 23:00

  for(let h = OPEN_HOUR; h < CLOSE_HOUR; h++){
    const label = `${pad2(h)}:00`;
    const opt = document.createElement('option');
    opt.value = label;
    opt.textContent = label;
    timeEl.appendChild(opt);
  }

  dateEl.addEventListener('click', () => {
    if (dateEl.showPicker) dateEl.showPicker();
  });
  dateEl.addEventListener('focus', () => {
    if (dateEl.showPicker) dateEl.showPicker();
  });

  function closeAllSelects(except=null){
    document.querySelectorAll('.cselect.open').forEach(el=>{
      if(el!==except){
        el.classList.remove('open');
        el.querySelector('.cselect-btn').setAttribute('aria-expanded','false');
      }
    });
  }

  document.addEventListener('click', (e) => {
    const cs = e.target.closest('.cselect');
    if(!cs){ closeAllSelects(); return; }

    const btn = e.target.closest('.cselect-btn');
    if(btn){
      const isOpen = cs.classList.contains('open');
      closeAllSelects(cs);
      cs.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      return;
    }

    const opt = e.target.closest('.cselect-opt');
    if(opt){
      const hidden = cs.querySelector('input[type="hidden"]');
      const valueSpan = cs.querySelector('.cselect-value');

      cs.querySelectorAll('.cselect-opt').forEach(o=>o.classList.remove('selected'));
      opt.classList.add('selected');

      hidden.value = opt.dataset.value;
      valueSpan.textContent = opt.textContent;

      cs.classList.remove('open');
      cs.querySelector('.cselect-btn').setAttribute('aria-expanded','false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeAllSelects();
  });

  // ===== Demo submit (nema backend) =====
  document.getElementById('reserveForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('reserveMsg');
    msg.textContent = "Upit je poslan! Javit ćemo se na email uskoro.";
    e.target.reset();

    // nakon reseta opet postavi default datum
    dateEl.value = todayStr;
    timeEl.selectedIndex = 0;
  });