// ===== Floating plates bounce animation =====
(function(){
const plates = [
    { el: document.getElementById('plate1'), x: 0, y: 0, vx: -0.18, vy: 0.14 },
    { el: document.getElementById('plate2'), x: 0, y: 0, vx: 0.16, vy: -0.12 },
].filter(p => p.el);

if (plates.length === 0) return;

// start positions based on current CSS layout
function init(){
    const W = window.innerWidth;
    const H = window.innerHeight;

    plates.forEach((p, i) => {
    // random-ish start inside viewport
    p.x = (i === 0) ? W - 480 : 80;
    p.y = (i === 0) ? 120 : H - 520;

    // apply immediately
    p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    });
}

// get element size (after image loads)
function size(el){
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
}

let last = performance.now();

function tick(now){
    const dt = Math.min(32, now - last); // clamp
    last = now;

    const W = window.innerWidth;
    const H = window.innerHeight;

    plates.forEach(p => {
    const { w, h } = size(p.el);

    // move (speed scaled by dt so it's consistent)
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // bounce against edges
    if (p.x <= -w * 0.35) { p.x = -w * 0.35; p.vx *= -1; }
    if (p.y <= -h * 0.35) { p.y = -h * 0.35; p.vy *= -1; }
    if (p.x >= W - w * 0.65) { p.x = W - w * 0.65; p.vx *= -1; }
    if (p.y >= H - h * 0.65) { p.y = H - h * 0.65; p.vy *= -1; }

    p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    });

    requestAnimationFrame(tick);
}

// wait images to load so sizes are correct
let loaded = 0;
plates.forEach(p => {
    if (p.el.complete) loaded++;
    else p.el.addEventListener('load', () => { loaded++; if (loaded === plates.length) init(); }, { once:true });
});

init();
requestAnimationFrame(tick);

window.addEventListener('resize', init);
})();
