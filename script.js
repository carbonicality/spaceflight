document.getElementById('loginTime').textContent = new Date().toLocaleString();
let credits = 0;
let clickPwr = 1;
let cps = 0;
let startTime = Date.now();
let solar = 0, fusion = 0, siege = 0, quantum = 0;

const upgrades = [
    {id:'solar', name:'SOLAR_PANELS', desc:'0.1 EC/s', cost:10, owned: 0, cps: 0.1},
    {id:'click1', name:'PWR_AMP_1', desc:'+1 EC/click', cost:50, owned: 0, clickBonus:1},
    {id:'fusion', name:'FUSION_CORE', desc:'+1 EC/s', cost:100, owned: 0, cps: 1},
    {id:'click2', name:'PWR_AMP_2', desc:'+5 EC/click', cost:250, owned: 0, clickBonus:5},
    {id:'siege', name:'SIEGE_CORE', desc:'+10 EC/s', cost:1000, owned: 0, cps: 10},
    {id:'click3', name:'PWR_AMP_3', desc:'+25 EC/click', cost:2500, owned: 0, clickBonus:25},
    {id:'quantum', name:'QUANTUM_CORE', desc:'+100 EC/s', cost:10000, owned: 0, cps: 100},
    {id:'click4', name:'PWR_AMP_4', desc:'+100 EC/click', cost:15000, owned: 0, clickBonus:100}
]; // i used AI for this here array cuz i wasn't creative enough for the upg ideas mb

const upgSec = document.getElementById('upgSec'); // sudo opsec=1? nah we got sudo upgsec (your sign to laugh hahahahaha)
upgrades.forEach(upgrade => {
    const line = document.createElement('div');
    line.className = 'upg-ln locked';
    line.id = `upgrade-${upgrade.id}`;
    line.innerHTML = `
    <span class="upg-name">${upgrade.name} - ${upgrade.desc}</span>
    <span class="upg-lvl">lv.<span class="lvl">0</span></span>
    <span class="upg-cost"><span class="cost">${upgrade.cost}</span> EC</span>`;
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