# Prompt Adventure

A small browser-based text adventure game where you explore a mysterious forest, fight enemies, level up, and collect useful items.

## How it works

The game is built with plain HTML, CSS, and JavaScript. You type commands into the page to explore rooms, move through the map, and survive encounters with goblins.

### Core gameplay

- Explore different rooms such as the forest, clearing, river, and cave.
- Move between locations using commands like `go north`, `go east`, `go west`, and `go south`.
- Encounter random goblin enemies while traveling.
- Fight in turn-based combat until either you or the monster is defeated.
- Gain levels after victories and increase your attack power.
- Pick up dropped items such as health potions and swords.

## Commands

- `help` – show available commands
- `look` – describe the current room and available exits
- `status` – view health, level, attack range, and inventory
- `go <direction>` – move to another room
- `pick up <item>` – collect an item you found during combat

Example:

```text
help
look
status
go north
pick up health potion
```

## Run the project

You can run it in any modern browser.

### Option 1: Open the file directly

Open [index.html](index.html) in your browser.

### Option 2: Serve it locally

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project files

- [index.html](index.html) – page structure and game shell
- [style.css](style.css) – styling for the interface
- [script.js](script.js) – game logic, rooms, combat, and commands
- [assets/](assets/) – project assets

## Notes

This project is intentionally simple and uses no external game engine or framework. It is a good starter project for learning text-based game logic, DOM updates, and browser interactivity.

