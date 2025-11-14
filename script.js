// Pools
const POOLS = {
  Monster: ["Kraken", "Hydra", "Oni", "Fenrir", "Minotaur", "Basilisk", "Chimera", "Naga", "Kitsune", "Jormungandr"],
  Hero: ["Hercules", "Mulan", "Perseus", "Gilgamesh", "Sun Wukong", "Arjuna", "Achilles", "Beowulf", "Rama", "Atalanta"],
  Setting: ["Volcano", "Sky Palace", "Frozen Sea", "Ancient Ruins", "Underworld Cave", "Sacred Forest", "Desert of Mirrors", "Floating Island", "Temple of Dawn", "Moonlit Harbor"]
};

// DOM
const optMonster = document.getElementById('optMonster');
const optHero = document.getElementById('optHero');
const optSetting = document.getElementById('optSetting');
const btnDraw = document.getElementById('btnDraw');
const btnReset = document.getElementById('btnReset');
const resMonster = document.getElementById('resMonster');
const resHero = document.getElementById('resHero');
const resSetting = document.getElementById('resSetting');
const cardMonster = document.getElementById('cardMonster');
const cardHero = document.getElementById('cardHero');
const cardSetting = document.getElementById('cardSetting');
const noteRow = document.getElementById('noteRow');
const confettiCanvas = document.getElementById('confetti');

let confettiCtx = confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;
let confettiPieces = [];
let confettiActive = false;

// resize canvas
function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// random helper
function randPick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// reveal card animation
function revealCard(cardEl, resultEl, text, delay=0){
  cardEl.classList.remove('hidden');
  resultEl.classList.add('spinAnim');
  resultEl.textContent = '...';

  setTimeout(()=>{
    resultEl.textContent = text;
    resultEl.animate(
      [{transform:'scale(0.92)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],
      {duration:420, easing:'cubic-bezier(.2,.9,.2,1)'}
    );
    resultEl.classList.remove('spinAnim');
  }, 900 + delay);
}

// confetti generator
function spawnConfetti(){
  if(!confettiCtx) return;
  confettiPieces = [];
  const count = 80;

  for(let i=0;i<count;i++){
    confettiPieces.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*-confettiCanvas.height,
      r: 6+Math.random()*8,
      dx: -2 + Math.random()*4,
      dy: 2 + Math.random()*6,
      col: `hsl(${Math.floor(Math.random()*360)} 70% 65%)`,
      rot: Math.random()*360,
      dr: -0.05 + Math.random()*0.1
    });
  }

  confettiActive = true;
  renderConfetti();
  setTimeout(()=> confettiActive = false, 3500);
}

function renderConfetti(){
  if(!confettiActive) return;
  confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);

  for(const p of confettiPieces){
    p.x += p.dx;
    p.y += p.dy;
    p.rot += p.dr;

    confettiCtx.save();
    confettiCtx.translate(p.x,p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.col;
    confettiCtx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
    confettiCtx.restore();
  }

  confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 40);

  if(confettiActive) requestAnimationFrame(renderConfetti);
}

// main gacha
btnDraw.addEventListener('click', async ()=>{
  const wantMonster = optMonster.checked;
  const wantHero = optHero.checked;
  const wantSetting = optSetting.checked;

  if(!wantMonster && !wantHero && !wantSetting){
    optMonster.checked = optHero.checked = optSetting.checked = true;
  }

  btnDraw.disabled = true;
  btnDraw.textContent = 'Drawing...';
  noteRow.style.display = 'none';

  cardMonster.classList.toggle('hidden', !optMonster.checked);
  cardHero.classList.toggle('hidden', !optHero.checked);
  cardSetting.classList.toggle('hidden', !optSetting.checked);

  await new Promise(r => setTimeout(r, 600));

  const picks = {};
  const order = [];

  if(optMonster.checked){ picks.Monster = randPick(POOLS.Monster); order.push(['Monster', cardMonster, resMonster]); }
  if(optHero.checked){ picks.Hero = randPick(POOLS.Hero); order.push(['Hero', cardHero, resHero]); }
  if(optSetting.checked){ picks.Setting = randPick(POOLS.Setting); order.push(['Setting', cardSetting, resSetting]); }

  for(let i=0;i<order.length;i++){
    const delay = i*700;
    revealCard(order[i][1], order[i][2], picks[order[i][0]], delay);
    await new Promise(r => setTimeout(r, 260));
  }

  setTimeout(()=>{
    spawnConfetti();
    noteRow.style.display = 'flex';
    btnDraw.disabled = false;
    btnDraw.textContent = '🎲 GACHA!';
  }, 1400 + order.length*150);
});

// reset button
btnReset.addEventListener('click', ()=>{
  resMonster.textContent = '—';
  resHero.textContent = '—';
  resSetting.textContent = '—';

  cardMonster.classList.remove('hidden');
  cardHero.classList.remove('hidden');
  cardSetting.classList.remove('hidden');

  noteRow.style.display = 'none';
});
