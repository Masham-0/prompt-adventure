// script.js - Prompt Adventure with combat, leveling, and items

// ---------- Game Data ----------
const rooms = {
  start: {
    description: "You stand at the edge of a misty forest. Paths lead north and east.",
    exits: { north: "clearing", east: "river" },
  },
  clearing: {
    description: "A quiet clearing bathed in dappled sunlight. A strange stone lies here. Paths south and east.",
    exits: { south: "start", east: "cave" },
  },
  river: {
    description: "A swift river blocks your way. A rickety bridge stretches west. Paths west.",
    exits: { west: "start" },
  },
  cave: {
    description: "A dark cave mouth yawns before you. An eerie glow beckons inside. Paths west.",
    exits: { west: "clearing" },
  },
};

// ---------- Player State ----------
const PLAYER_START_HP = 100;
const PLAYER_BASE_ATTACK = { min: 5, max: 10 };
let player = {
  hp: PLAYER_START_HP,
  level: 1,
  attackMin: PLAYER_BASE_ATTACK.min,
  attackMax: PLAYER_BASE_ATTACK.max,
  inventory: [],
};

// ---------- Item Definitions ----------
const ITEM_POOL = [
  { name: "Health Potion", type: "heal", amount: 30 },
  { name: "Iron Sword", type: "buff", attackBoost: 5 },
];

// ---------- Utility Functions ----------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateHUD() {
  const hud = document.getElementById("hud");
  if (!hud) return;
  const invList = player.inventory.length ? player.inventory.map(i => i.name).join(", ") : "(empty)";
  hud.innerHTML = `HP: ${player.hp} | Level: ${player.level} | Attack: ${player.attackMin}-${player.attackMax} | Inventory: ${invList}`;
}

function print(text, cssClass = "") {
  const p = document.createElement("p");
  if (cssClass) p.className = cssClass;
  p.textContent = text;
  outputEl.appendChild(p);
  outputEl.scrollTop = outputEl.scrollHeight;
  updateHUD();
}

function showRoom() {
  const room = rooms[currentRoom];
  print(`📍 ${room.description}`);
  const exits = Object.keys(room.exits).join(", ");
  print(`⬅️ Exits: ${exits}`);
}

// ---------- Monster Generation ----------
function generateMonster(level) {
  const base = level * 10;
  return {
    name: "Goblin",
    hp: randInt(base, base + 20),
    attackMin: randInt(5, 10) + level * 2,
    attackMax: randInt(15, 20) + level * 2,
  };
}

// ---------- Combat System ----------
function fight(monster) {
  print(`⚔️ A wild ${monster.name} appears!`, "combat");
  while (monster.hp > 0 && player.hp > 0) {
    const playerDmg = randInt(player.attackMin, player.attackMax);
    monster.hp -= playerDmg;
    print(`🗡️ You hit the ${monster.name} for ${playerDmg} damage.`, "player-damage");
    if (monster.hp <= 0) break;
    const monsterDmg = randInt(monster.attackMin, monster.attackMax);
    player.hp -= monsterDmg;
    print(`👹 ${monster.name} strikes you for ${monsterDmg} damage.`, "monster-damage");
    if (player.hp <= 0) break;
  }
  if (player.hp <= 0) {
    print("💀 You have been defeated. Game over.", "defeat");
    form.removeEventListener("submit", submitHandler);
    return false;
  }
  print(`🏆 You have slain the ${monster.name}!`, "victory");
  player.level += 1;
  const newMin = randInt(60, 70) + player.level * 2;
  const newMax = randInt(65, 75) + player.level * 2;
  player.attackMin = newMin;
  player.attackMax = newMax;
  print(`✨ You are now level ${player.level}. Attack power is now ${player.attackMin}-${player.attackMax}.`, "level-up");
  // Item drop
  if (Math.random() < 0.5) {
    const dropped = ITEM_POOL[randInt(0, ITEM_POOL.length - 1)];
    print(`📦 You found a ${dropped.name}! Type 'pick up ${dropped.name.toLowerCase()}' to collect.`, "item-drop");
    pendingItem = dropped;
  } else {
    pendingItem = null;
  }
  return true;
}

// ---------- Command Processing ----------
let currentRoom = "start";
let pendingItem = null;

const outputEl = document.getElementById("output");
const form = document.getElementById("commandForm");
const input = document.getElementById("commandInput");

function submitHandler(e) {
  e.preventDefault();
  const cmd = input.value;
  input.value = "";
  processCommand(cmd);
}
form.addEventListener("submit", submitHandler);

function processCommand(command) {
  const cmd = command.trim().toLowerCase();
  if (!cmd) return;
  print(`> ${cmd}`);
  if (cmd === "help") {
    print("Commands: look, go <direction>, status, pick up <item>, help");
    return;
  }
  if (cmd === "look") {
    showRoom();
    return;
  }
  if (cmd === "status") {
    const inv = player.inventory.length ? player.inventory.map(i => i.name).join(", ") : "(empty)";
    print(`HP: ${player.hp}, Level: ${player.level}, Attack: ${player.attackMin}-${player.attackMax}, Inventory: ${inv}`);
    return;
  }
  if (cmd.startsWith("pick up ")) {
    const itemName = cmd.slice(8).trim();
    if (pendingItem && pendingItem.name.toLowerCase() === itemName) {
      player.inventory.push(pendingItem);
      if (pendingItem.type === "heal") {
        player.hp = Math.min(PLAYER_START_HP, player.hp + pendingItem.amount);
        print(`💖 You consumed the ${pendingItem.name} and recovered ${pendingItem.amount} HP.`, "heal");
      } else if (pendingItem.type === "buff") {
        player.attackMin += pendingItem.attackBoost;
        player.attackMax += pendingItem.attackBoost;
        print(`⚔️ Your attack power increased by ${pendingItem.attackBoost}.`, "buff");
      }
      pendingItem = null;
      updateHUD();
    } else {
      print("There is no such item to pick up.");
    }
    return;
  }
  const parts = cmd.split(/\s+/);
  if (parts[0] === "go" && parts[1]) {
    const direction = parts[1];
    const room = rooms[currentRoom];
    if (room.exits[direction]) {
      currentRoom = room.exits[direction];
      if (Math.random() < 0.3) {
        const monster = generateMonster(player.level);
        if (!fight(monster)) return; // game over
      } else {
        showRoom();
      }
    } else {
      print("You can't go that way.");
    }
    return;
  }
  print("I don't understand that command. Try 'help'.");
}

// ---------- Game Init ----------
function initGame() {
  print("Welcome to Prompt Adventure! Type 'help' for commands.");
  updateHUD();
  showRoom();
}

initGame();
