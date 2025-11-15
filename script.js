document.getElementById('loginTime').textContent = new Date().toLocaleString();
let credits = 0;
let clickPwr = 1;
let cps = 0;
let startTime = Date.now();
let solar = 0, fusion = 0, siege = 0, quantum = 0;
let warpLvl = 0;
let lifetimeCreds = 0;
let warpMult = 1;

const upgrades = [
    {id:'solar', name:'SOLAR_PANELS', desc:'0.1 EC/s', cost:10, owned: 0,cps: 0.1},
    {id:'click1', name:'PWR_AMP_1', desc:'+1 EC/click', cost:50,owned: 0, clickBonus:1},
    {id:'fusion', name:'FUSION_CORE', desc:'+1 EC/s', cost:100, owned: 0, cps: 1},
    {id:'click2', name:'PWR_AMP_2', desc:'+5 EC/click', cost:250, owned: 0, clickBonus:5},
    {id:'siege', name:'SIEGE_CORE', desc:'+10 EC/s', cost:1000, owned: 0, cps: 10},
    {id:'click3', name:'PWR_AMP_3', desc:'+25 EC/click', cost:2500, owned: 0, clickBonus:25},
    {id:'quantum', name:'QUANTUM_CORE', desc:'+100 EC/s', cost:10000, owned: 0, cps: 100},
    {id:'click4', name:'PWR_AMP_4', desc:'+100 EC/click', cost:15000, owned: 0, clickBonus:100}
]; // used ai for this array cuz i wasnt creative enough to come up w more upgrades :sob:

const upgSec = document.getElementById('upgSec');
upgrades.forEach(upgrade => {
    const line = document.createElement('div');
    line.className = 'upg-ln locked';
    line.id = `upgrade-${upgrade.id}`;
    line.innerHTML = `
    <span class="upg-name">${upgrade.name} - ${upgrade.desc}</span>
    <span class="upg-lvl">lv.<span class="lvl">0</span></span>
    <span class="upg-cost"><span class="cost">${upgrade.cost}</span> EC</span>`; // yk what's annoying? while in the backtick thing it wont lemme autocomplete the tags rahh
    line.addEventListener('click', () => buyUpg(upgrade.id));
    upgSec.appendChild(line);
});

function addLog(msg) {
    const log = document.getElementById('logSec');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const time = new Date().toLocaleTimeString();
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-msg">${msg}</span>`;
    log.insertBefore(entry, log.firstChild);
    if (log.children.length > 20) log.removeChild(log.lastChild);
}

document.getElementById('genBtn').addEventListener('click', function(e) {
    credits += clickPwr * warpMult;
    const floater = document.createElement('div');
    floater.className = 'float-txt';
    floater.textContent = `+${clickPwr}`;
    floater.style.left = e.clientX + 'px';
    floater.style.top = e.clientY + 'px';
    document.body.appendChild(floater);
    setTimeout(() => floater.remove(), 1000);
    updUI();
});

function buyUpg(id) {
    const upg = upgrades.find(u => u.id === id);
    if (!upg || credits < upg.cost) return;
    credits -= upg.cost;
    upg.owned++;
    upg.cost = Math.floor(upg.cost * 1.15);
    if (upg.cps) {
        cps += upg.cps;
        if (upg.id === 'solar') solar++;
        if (upg.id === 'fusion') fusion++;
        if (upg.id === 'siege') siege++;
        if (upg.id === 'quantum') quantum++;
    }
    if (upg.clickBonus) clickPwr += upg.clickBonus;
    addLog(`> deployed ${upg.name} [level ${upg.owned}]`);
    updUI();
}

function warp() {
    if (credits < 1000000) return; // note: it's 1 million
    const confirmed = confirm('WARP DRIVE\n \nAre you sure you want to enable WARP DRIVE? It will erase your progress, BUT.. \n it will grant you +10% to all production and +10% to click power\n\n Continue?');
    if (!confirmed) return;
    warpLvl++;
    warpMult = 1+(warpLvl * 0.1);
    addLog(`> WARP DRIVE INITIATED - WARP LEVEL ${warpLvl}`);
    addLog(`> ALL SYSTEMS RESET - MULTIPLIER: ${warpMult.toFixed(1)}x`);
    credits = 0;
    clickPwr= 1;
    cps = 0;
    solar = 0;
    fusion = 0;
    siege = 0;
    quantum = 0;
    startTime = Date.now();
    upgrades.forEach(upg => {
        upg.owned = 0;
        upg.cost = [10, 50, 100, 250, 1000, 2500, 10000, 15000][upgrades.indexOf(upg)];
    });
    updUI();
}

function updUI() {
    document.getElementById('credits').textContent = Math.floor(credits).toLocaleString();
    document.getElementById('clickPower').textContent = clickPwr;
    document.getElementById('cps').textContent = cps.toFixed(1);
    document.getElementById('solarCount').textContent = solar;
    document.getElementById('fusionCount').textContent = fusion;
    document.getElementById('siegeCount').textContent = siege;
    document.getElementById('quantumCount').textContent  =quantum;

    // uptime
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    document.getElementById('uptime').textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    const oxygen = 85 + Math.random() * 15;
    const pwr = 90 + Math.random() * 10;
    const oxyBlocks = Math.floor(oxygen / 5);
    const pwrBlocks = Math.floor(pwr / 5);
    lifetimeCreds += (cps / 10) * warpMult;
    
    document.getElementById('oxfill').textContent = '█'.repeat(oxyBlocks) + '░'.repeat(20 - oxyBlocks);
    document.getElementById('oxPercent').textContent = Math.floor(oxygen) + '%';
    document.getElementById('powerFill').textContent = '█'.repeat(pwrBlocks) + '░'.repeat(20 - pwrBlocks);
    document.getElementById('powerPercent').textContent = Math.floor(pwr) + '%';

    const warpBtn = document.getElementById('warpBtn');
    if (warpBtn) {
        if (credits >= 1000000) { // note again, this is 1 million
            warpBtn.classList.remove('locked');
        } else {
            warpBtn.classList.add('locked');
        }
    }
    document.getElementById('warpLvl').textContent = warpLvl
    document.getElementById('warpMult').textContent = warpMult.toFixed(1);
    document.getElementById('lifetimeCreds').textContent = Math.floor(lifetimeCreds);
    upgrades.forEach(upg => {
        const line = document.getElementById(`upgrade-${upg.id}`);
        line.querySelector('.lvl').textContent = upg.owned;
        line.querySelector('.cost').textContent = upg.cost.toLocaleString();
        line.classList.toggle('locked', credits < upg.cost);
    });
}

setInterval(() => {
    credits += (cps / 10) * warpMult;
    updUI();
},100);

setInterval(() => {
    const events = [
        '> power array calibrated',
        '> incoming transmission from earth @ 127.0.0.1', // haha cuz yk 127.0.0.1 is urself bahahaha
        '> thermals in check',
        '> maintenance drones deployed',
        '> interspace scan complete',
        '> PWR_MAIN: grid stable'
    ];
    addLog(events[Math.floor(Math.random() * events.length)]);
},12000);

addLog('> remote control interface initialised');
addLog('> SYS_CHECK: all systems operational');
addLog('> WARN: start power generation');

updUI();