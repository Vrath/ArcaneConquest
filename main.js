"use strict";

document.getElementById('version').innerText = "0.0.15"
// (9+X) ^ 2 / 100 * log10(9+X)

let gameData;
let initialGameData = {
  golems: {
      total: 0,
      working: 0,
      type: {
        clay: {
          amount: 0,
          working: 0,
          unlocked: false,
          efficiency: 1,
          upkeepMultiplier: 1
        },
        wood: {
          amount: 0,
          working: 0,
          unlocked: false,
          efficiency: 1,
          upkeepMultiplier: 1
        },
        stone: {
          amount: 0,
          working: 0,
          unlocked: false,
          efficiency: 1,
          upkeepMultiplier: 1
        }
      }
  },
  buildings: {
      manaTower: {
        level: 0,
        unlocked: false
      },
      manaWell: {
        level: 0,
        unlocked: false
      },
      clayStorage: {
        level: 0,
        unlocked: false
      },
      clayDeposits: {
        level: 0,
        unlocked: false
      },
      woodShed: {
        level: 0,
        unlocked: false
      },
      lumberjacksHut: {
        level: 0,
        unlocked: false
      },
      stoneyard: {
        level: 0,
        unlocked: false
      },
      stoneQuarry: {
        level: 0,
        unlocked: false
      },
      library: {
        level: 0,
        unlocked: false
      }
    },
  resources: {
    mana: {
      amount: 10,
      max: 10,
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 1,
      usage: 0,
      unlocked: false
    },
    clay: {
      amount: 0,
      max: 5,
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 0,
      usage: 0,
      unlocked: true
    },
    wood: {
      amount: 0,
      max: 0,
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 0,
      usage: 0,
      unlocked: false
    },
    stone: {
      amount: 0,
      max: 0,
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 0,
      usage: 0,
      unlocked: false
    }
  }
}

const production = {
  mana: {
    resourceId: "mana",
    displayName: "mana",
    workers: "N/A",
    desc: "Mana is the magical energy used to power, control, cast, and more..."
  },
  clay: {
    resourceId: "clay",
    displayName: "clay",
    workers: "clay diggers",
    desc: "Clay is the one of the most primitive materials. It is easy to shape, but not very durable."
  },
  wood: {
    resourceId: "wood",
    displayName: "livingwood",
    workers: "lumberjacks",
    desc: "Wood is easy to gather, easy to work with, relatively durable, but prone to fire."
  },
  stone: {
    resourceId: "stone",
    displayName: "stone",
    workers: "stone miners",
    desc: "Stone is hard to gather or work with, but also tough to break."
  }
}

const golems = {
  clay: {
    resource: "clay",
    displayName: "clay golem",
    desc: "Clay golems are easy to make, dexterous, but also very fragile.",
    upkeep: 0.25,
    power: 1
  },
  wood: {
    resource: "wood",
    displayName: "wood golem",
    desc: "Wood golems are well balanced between their toughness, strength, and ease of control.",
    upkeep: 1,
    power: 5
  },
  stone: {
    resource: "stone",
    displayName: "stone golem",
    desc: "Stone golems are tough and sturdy, but very slow.",
    upkeep: 5,
    power: 30
  }
}

const buildings = {
  manaTower: {
    buildingId: "manaTower",
    displayName: "mana tower",
    type: "storage",
    resource: "mana",
    desc: "This building has a magical artifact within it, which lets you store mana."
  },
  manaWell: {
    buildingId: "manaWell",
    displayName: "mana well",
    type: "production",
    resource: "mana",
    desc: "This building concentrates magical energy from the stars and converts it to mana."
  },
  clayStorage: {
    buildingId: "clayStorage",
    displayName: "clay storage",
    type: "storage",
    resource: "clay",
    desc: "This building is used to store clay. Upgrade it to increase the max amount of clay you can store."
  },
  clayDeposits: {
    buildingId: "clayDeposits",
    displayName: "clay deposits",
    type: "production",
    resource: "clay",
    desc: "This building allows your golems to produce clay. Upgrade it to increase maximum amount of diggers and increase their efficiency."
  },
  woodShed: {
    buildingId: "woodShed",
    displayName: "wood shed",
    type: "storage",
    resource: "wood",
    desc: "This building is used to store wood."
  },
  lumberjacksHut: {
    buildingId: "lumberjacksHut",
    displayName: "lumberjacks hut",
    type: "production",
    resource: "wood",
    desc: "This building allows you to hire lumberjacks. Upgrade it to increase maximum amount of lumberjacks and increase their efficiency."
  },
  stoneyard: {
    buildingId: "stoneyard",
    displayName: "stoneyard",
    type: "storage",
    resource: "stone",
    desc: "This building is used to store stone. "
  },
  stoneQuarry: {
    buildingId: "stoneQuarry",
    displayName: "stone quarry",
    type: "production",
    resource: "stone",
    desc: "This building lets your golems mine stone."
  },
  library: {
    buildingId: "library",
    displayName: "library",
    type: "other",
    resource: "research",
    desc: "This building allows you to research new technologies."
  }
}

// *** UTILITY ***
//number formatter
function nFormatter(num, digits) {
  if (num < 1){
    return parseFloat(num.toFixed(2));
  }
  else {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
}

// *** UI ***
//navigation
function topnavMenu() {
  var x = document.getElementById("topMenu");
  if (x.className === "topnav") {
    x.classList.add("responsive");
  } else {
    x.classList.remove("responsive");
  }
};

// When the user scrolls the page, execute updateNav
window.onscroll = function() {updateNav()};

// Get the navbar
var navbar = document.getElementById("topMenu");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function updateNav() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

// Get the modal
var modal = document.getElementById("golemsModal");

// Get the button that opens the modal
var createGolemBtn = document.getElementById("createGolemBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
createGolemBtn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//tabs
function tab(tab) {
  document.getElementById("hearth").style.display = "none"
  document.getElementById("buildings").style.display = "none"
  document.getElementById("workers").style.display = "none"
  document.getElementById("research").style.display = "none"
  document.getElementById("workshop").style.display = "none"
  document.getElementById(tab).style.display = "flex"
}
tab("hearth");

//game log alerts
function gameLog(message) {
  let element = document.createElement("div");
  element.classList.add("message");
  element.innerHTML = `<p>${message}</p>`;
  document.getElementById("gameLogContent").firstChild.prepend(element);
}

// *** GAME CORE ***

//execute these upon loading the page
resourceGen();
buildingsGen();
golemsGen();
golemsInfoGen();
workerGen();
// researchGen();
reset(true);
checkUnlocks();

//hard reset
function reset(confirmReset) {
  confirmReset = confirmReset ?? confirm("Are you sure you want to reset your progress?");
  if (!confirmReset) {return;}
  gameData = JSON.parse(JSON.stringify(initialGameData));

//hide hearth buttons
  document.getElementById('createGolemBtn').style.visibility = "hidden";

  Object.values(production).forEach(p =>{
    document.getElementById(p.resourceId + "Res").style.display = "none";
  //   document.getElementById(p.resource + "Btn").style.display = "none";
    document.getElementById(p.resourceId + "Worker").style.display = "none";
  })

  Object.values(buildings).forEach(b =>{
    document.getElementById(b.buildingId + "Building").style.display = "none";
  })
  

  document.getElementById('tabBuildings').style.display = "none";
  document.getElementById('tabWorkers').style.display = "none";
  document.getElementById('tabResearch').style.display = "none";
  document.getElementById('tabWorkshop').style.display = "none";
  

  document.getElementById('gameLogContent').innerHTML = "<span></span>";

  //unlocked by default:
  document.getElementById('manaRes').style.display = "";
  document.getElementById('clayRes').style.display = "";

  tab("hearth");
}

//load data
let savegame = JSON.parse(localStorage.getItem("gameSave"))
if (savegame !== null) {
  gameData = savegame;
  updateAll();
}

//save loop
let saveLoop = window.setInterval(function(){
  localStorage.setItem("gameSave", JSON.stringify(gameData))
}, 10000)

//update all data
function updateAll(){

  //resourcebar updates
  Object.values(production).forEach(p =>{
    if (gameData.resources[p.resourceId].amount > gameData.resources[p.resourceId].max){gameData.resources[p.resourceId].amount = gameData.resources[p.resourceId].max}
    let prod = nFormatter((gameData.resources[p.resourceId].production - gameData.resources[p.resourceId].usage), 2);
    let amt = nFormatter(gameData.resources[p.resourceId].amount, 2);
    let max = nFormatter(gameData.resources[p.resourceId].max, 2);
    if (prod > 0){document.getElementById(`${p.resourceId}Prod`).innerHTML = "+" + prod + "/s";}
    if (prod < 0){document.getElementById(`${p.resourceId}Prod`).innerHTML = `<span style="color= red">` + prod + "/s</span>";}
    document.getElementById(`${p.resourceId}Amt`).innerHTML = amt;
    document.getElementById(`${p.resourceId}Max`).innerHTML = "/" + max;
  })

  //buildings
  Object.values(buildings).forEach(b =>{
    document.getElementById(b.buildingId + "Name").innerHTML = `<h3>${b.displayName} - level <span style="font-family: 'Titillium Web', sans-serif;"> ${gameData.buildings[b.buildingId].level}</span></h3>`;
    document.getElementById(b.buildingId + "Costs").innerHTML = "";
    Object.values(getUpgradeCost(b.buildingId, gameData.buildings[b.buildingId].level + 1)).forEach(r =>{
      let element = document.createElement("span");
      if (r.amount > gameData.resources[r.resource].amount) {element.classList.add("red");}
      element.innerHTML = `<div class="item-bg"><img src="img/${r.resource}.png"></img></div> ` + production[r.resource].displayName + ": "+ r.amount + "<br>";
      document.getElementById(b.buildingId + "Costs").appendChild(element);
    })
  })

  //golem creation menu
  Object.values(golems).forEach(g =>{
    document.getElementById(g.resource + "GolemAmt").innerHTML = gameData.golems.type[g.resource].amount;
    document.getElementById(g.resource + "GolemCosts").innerHTML = "";  
    Object.values(getGolemCost(g.resource)).forEach(r =>{
      let element = document.createElement("span");
      if (r.amount > gameData.resources[r.resource].amount) {element.classList.add("red");}
      element.innerHTML = `<div class="item-bg"><img src="img/${r.resource}.png"></img></div> ` + production[r.resource].displayName + ": "+ r.amount + "<br>";
      document.getElementById(g.resource + "GolemCosts").appendChild(element);
    })
  })

  //golem management
  document.getElementById("golemsTotal").innerHTML = nFormatter(gameData.golems.total, 0);
  Object.values(golems).forEach(g =>{
    if (gameData.golems.type[g.resource].amount > gameData.golems.type[g.resource].working){
      document.getElementById(g.resource + "GolemInfo").innerHTML = gameData.golems.type[g.resource].amount + " ("+ (gameData.golems.type[g.resource].amount - gameData.golems.type[g.resource].working) +" without a job)"
    }
    else{
      document.getElementById(g.resource + "GolemInfo").innerHTML = gameData.golems.type[g.resource].amount
    }
  })

  Object.values(production).forEach(p =>{
    Object.values(golems).forEach(g =>{
      if (p.resourceId != "mana"){
        document.getElementById(g.resource + "Golem_" + p.resourceId + "Workers").innerHTML = gameData.resources[p.resourceId].workers[g.resource];
      }
    })
  })


  checkUnlocks();
}
// *** HEARTH BUTTONS ***

//conjure clay
function gatherClay(){
  if (gameData.resources.mana.amount >= 1 && gameData.resources.clay.amount < gameData.resources.clay.max){
    gameData.resources.mana.amount -= 1;
    gameData.resources.clay.amount++;
    updateAll();
  }
}

// *** DYNAMIC GENERATION ***

function resourceGen() {
  Object.values(production).forEach(p =>{
    let element = document.createElement("tr");
    element.id = p.resourceId + "Res";
    element.classList.add("res");
    element.innerHTML = `<td class='name'><div class="item-bg"><img src="img/${p.resourceId}.png"></img></div> ${p.displayName}:</td>
    <td id='${p.resourceId}Prod' class='prod'></td>
    <td id='${p.resourceId}Amt' class='amt'></td>
    <td id='${p.resourceId}Max' class='max'></td>`
    element.classList.add("res");
    document.getElementById("resourceBarContents").appendChild(element);
    document.getElementById(p.resourceId + "Res").style.display = "none";
  })
}

function buildingsGen() {
  Object.values(buildings).forEach(b =>{
    let element = document.createElement("div");
    element.classList.add("building", "box", "flow-column");
    element.id = b.buildingId + "Building";
    element.buildingType = b.buildingId;
    element.innerHTML = `<h3 id="${b.buildingId}Name" style="font-size:24px;">${b.displayName} - level 0</h3>
    <div>
    <p class="desc">${b.desc}</p>
    <div class="btn buildingBtn" id="${b.buildingId}Btn">Upgrade</div>
    <div class="listCosts" id="${b.buildingId}Costs"></div>
    </div>`;
    document.getElementById("buildingsList").appendChild(element);

    document.getElementById(b.buildingId + "Building").style.display = "none";
  })
  document.addEventListener("click", event => {
    let target = event.target.closest(".buildingBtn");
    if (target) {
      upgradeBuilding(target.parentNode.parentNode.buildingType);
    }
  })
}

function golemsGen() {
  Object.values(golems).forEach(g =>{
    let element = document.createElement("div");
    element.classList.add("golem", "box", "flow-column", g.resource + "Golem");
    element.style.display = "none";
    element.id = g.resource + "Golem";
    element.golemType = g.resource;
    element.innerHTML = `<h3>${g.displayName}</h3>
    <div>
    <p class="desc">${g.desc}</p>
    <div class="btn golemBtn" id="${g.resource}GolemBtn">Create</div>
    <p>Amount owned: <span id="${g.resource}GolemAmt"></span></p>
    <p>Mana upkeep cost: <b>${g.upkeep}</b>/s</p>
    <div class="listCosts" id="${g.resource}GolemCosts"></div>
    </div>`
    document.getElementById("listGolems").appendChild(element);
    document.getElementById(g.resource + "Golem").style.display = "none";
  })
  document.addEventListener("click", event => {
    let target = event.target.closest(".golemBtn");
    if (target) {
      createGolem(target.parentNode.parentNode.golemType);
    }
  })
}

function golemsInfoGen(){
  Object.values(golems).forEach(g =>{
    let element = document.createElement("p");
    element.classList.add(g.resource + "Golem");
    element.style.display = "none";
    element.innerHTML = `${g.displayName}s: <span id="${g.resource}GolemInfo"></span>`
    document.getElementById("golemsInfo").appendChild(element);
  }
)}

////worker buttons gen
function workerGen() {
  Object.values(production).forEach(p =>{
    let element = document.createElement("div");
    element.classList.add("worker");
    element.style.display = "none";
    element.resource = p.resourceId;
    element.id = p.resourceId + "Worker";
    element.innerHTML = `<h3>${p.workers}</h3>`
    document.getElementById("workerList").appendChild(element);

    Object.values(golems).forEach(g =>{
      let element = document.createElement("tr");
      element.classList.add(`${g.resource}Golem`, "golemWorker");
      element.style.display = "none";
      element.innerHTML = `<td>${g.displayName}s:</td> 
      <td class="center"><img class="clickable" src="img/-.png" onclick="hire('${p.resourceId}', '${g.resource}', -1)"></img></td>
      <td class="center" id="${g.resource}Golem_${p.resourceId}Workers">0</td>
      <td class="center"><img class="clickable" src="img/+.png" onclick="hire('${p.resourceId}', '${g.resource}', 1)"></img></td>`
      document.getElementById(`${p.resourceId}Worker`).appendChild(element);
    })
  })
}


// *** RESOURCE PRODUCTION LOOP ***
let productionLoop = window.setInterval(function(){
  
  Object.values(production).forEach(p =>{
    let resource = gameData.resources[p.resourceId]
    resource.amount += resource.production/10;
    resource.amount -= resource.usage/10;
    if (resource.amount > resource.max){resource.amount = resource.max}
  })

  updateAll();
}, 100)

function hire(job, type, amt){
  if (amt > 0 && gameData.golems.type[type].amount >= gameData.golems.type[type].working + amt
    //&& gameData.resources[job].workersTotal + amt <= gameData.resources[job].workersMax
    ){
    gameData.golems.type[type].working += amt;
    gameData.golems.working += amt;
    gameData.resources[job].workers[type] += amt;
    gameData.resources[job].workersTotal += amt;
  }
  if (amt < 0 && gameData.golems.type[type].working + amt >= 0 && gameData.resources[job].workersTotal + amt >= 0){
    gameData.golems.type[type].working += amt;
    gameData.golems.working += amt;
    gameData.resources[job].workers[type] += amt;
    gameData.resources[job].workersTotal += amt;
  }
  updateAll();
}

// *** UNLOCKS ***
function unlockResource(resource){
  gameData.resources[resource].unlocked = true;
  document.getElementById(resource + "Res").style.display = "";
}

function unlockBuilding(building){
  if (gameData.buildings[building].unlocked == false){
    gameLog("Unlocked new building: " + buildings[building].displayName + "!");
  }
  gameData.buildings[building].unlocked = true;
  document.getElementById(building + "Building").style.display = "";
}

function unlockTab(tabName){
  document.getElementById(tabName).style.display = "";
}

function unlockBtn(btnName){
  document.getElementById(btnName).style.visibility = "visible";
}

function unlockWorker(workerName){
  document.getElementById(workerName + "Worker").style.display = "";
}

function unlockGolem(golemType){
  document.querySelectorAll(`.${golemType}Golem`).forEach(function(el) {
    el.style.display = '';
 });
 for (let element of document.getElementsByClassName(`.${golemType}Golem`)){
  element.style.display="none";
}
  if (gameData.golems.type[golemType].unlocked == false){
    gameLog("Unlocked new golem type: " + golemType + "!");
    gameData.golems.type[golemType].unlocked = true;
  }
}

function checkUnlocks(){
  if (gameData.resources.clay.amount >= 5 || gameData.buildings.clayStorage.unlocked == true){
    unlockBuilding("clayStorage");
    unlockTab("tabBuildings");
  }
  if (gameData.resources.clay.amount >= 10 || gameData.golems.type.clay.unlocked == true){
    unlockBtn("createGolemBtn");
    unlockGolem("clay");
  }
  if (gameData.golems.type.clay.amount >= 1 || gameData.buildings.clayDeposits.unlocked == true){
    unlockBuilding("clayDeposits");
  }
  if (gameData.resources.clay.amount >= 25 || gameData.buildings.manaTower.unlocked == true){
    unlockBuilding("manaTower");
  }
  if (gameData.resources.clay.amount >= 35 || gameData.buildings.manaWell.unlocked == true){
    unlockBuilding("manaWell");
  }
  if (gameData.buildings.clayDeposits.level >= 1){
    unlockWorker("clay");
    unlockTab("tabWorkers")
  }
}

// *** UPGRADES ***

function hasResource(resource) {
  return gameData.resources[resource.resource].amount >= resource.amount;
}

function payResource(resource) {
  return gameData.resources[resource.resource].amount -= resource.amount;
}

function payResources(resources) {
  for (const resource of resources){
    payResource(resource);
  }
}

function hasResources(resources){
  for (const resource of resources){
    if (!hasResource(resource)){
      return false;
    }
  }
  return true;
}

function payIfPossible(resources){
  if (hasResources(resources)){
    payResources(resources);
    return true;
  }
  return false;
}

function createGolem(type){
  if (golems[type].upkeep + gameData.resources.mana.production > gameData.resources.mana.usage){
    if (payIfPossible(getGolemCost(type))){
      gameData.golems.type[type].amount++;
      gameData.golems.total++;
      gameData.resources.mana.usage += golems[type].upkeep;
    }
  }
}

function getGolemCost(type){
  let amount = gameData.golems.type[type].amount + 1;

  const resources = [];
  switch (type) {
    case 'clay':
      resources.push({'resource': 'mana', 'amount': Math.ceil(5 * Math.pow(amount, 1.23))});
      resources.push({'resource': 'clay', 'amount': Math.ceil(10 * Math.pow(amount, 1.43))});
    break;
    case 'wood':
      resources.push({'resource': 'mana', 'amount': Math.ceil(25 * Math.pow(amount, 1.23))});
      resources.push({'resource': 'wood', 'amount': Math.ceil(15 * Math.pow(amount, 1.43))});
    break;
    case 'stone':
      resources.push({'resource': 'mana', 'amount': Math.ceil(150 * Math.pow(amount, 1.23))});
      resources.push({'resource': 'stone', 'amount': Math.ceil(20 * Math.pow(amount, 1.43))});
    break;
  }
  return resources;
}

function getUpgradeCost(building){
  let level = gameData.buildings[building].level + 1;

  const resources = [];
    switch (building) {
      case 'clayStorage':
        resources.push({'resource': 'clay', 'amount': Math.ceil(5 * Math.pow(level, 1.73))});
      break;
      case 'clayDeposits':
        resources.push({'resource': 'clay', 'amount': Math.ceil(20 * Math.pow(level, 1.73))});
      break;
      case 'manaTower':
        resources.push({'resource': 'clay', 'amount': Math.ceil(30 * Math.pow(level, 1.73))});
      break;
      case 'manaWell':
        resources.push({'resource': 'clay', 'amount': Math.ceil(40 * Math.pow(level, 1.73))});
      break;
    }
  return resources;
}

function upgradeBuilding(building){
  if (payIfPossible (getUpgradeCost(building))){
    gameData.buildings[building].level ++;
    let level = gameData.buildings[building].level;
    switch (building) {
      case 'clayStorage':
        gameData.resources.clay.max = 10 + 10 * Math.round(Math.pow(level, 1.8));
      break;
      case 'clayDeposits':
        gameData.resources.clay.maxworkers = Math.floor(Math.pow(level, 2)/2);
      break;
      case 'manaTower':
        gameData.resources.mana.max = 10 + 10 * Math.round(Math.pow(level, 1.43));
      break;
      case 'manaWell':
        gameData.resources.mana.production += Math.round(Math.pow(level, 1.43));
      break;
  }
  updateAll();
  }
}