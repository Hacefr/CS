// gameEngine.js - Main Engine & Screen Controller

// Game State Management
const GameState = {
  MENU: 'MENU',
  SETTINGS: 'SETTINGS',
  ACHIEVEMENTS: 'ACHIEVEMENTS',
  PILLARS: 'PILLARS',
  GAMEPLAY: 'GAMEPLAY',
  INTERMISSION: 'INTERMISSION',
  GAMEOVER: 'GAMEOVER'
};

let currentGameState = GameState.MENU;

// DOM Elements
const panels = {
  menu: document.getElementById('main-menu'),
  settings: document.getElementById('settings-panel'),
  achievements: document.getElementById('achievements-panel'),
  pillars: document.getElementById('pillars-panel'),
  gameplay: document.getElementById('gameplay-panel'),
  intermission: document.getElementById('intermission-panel')
};

// Initialize Event Listeners on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  setupUIEventListeners();
  switchState(GameState.MENU);
});

function setupUIEventListeners() {
  // Main Menu Buttons
  document.getElementById('btn-start').addEventListener('click', () => {
    switchState(GameState.PILLARS);
  });

  document.getElementById('btn-settings').addEventListener('click', () => {
    openModal(panels.settings);
  });

  document.getElementById('btn-achievements').addEventListener('click', () => {
    openModal(panels.achievements);
  });

  // Modal Close Buttons
  document.getElementById('btn-close-settings').addEventListener('click', () => {
    closeModal(panels.settings);
  });

  document.getElementById('btn-close-achievements').addEventListener('click', () => {
    closeModal(panels.achievements);
  });

  // Intermission Continue Button
  document.getElementById('btn-continue').addEventListener('click', () => {
    switchState(GameState.PILLARS);
  });

  // Pillar Selection Click Handler
  const pillars = document.querySelectorAll('.pillar');
  pillars.forEach(pillar => {
    pillar.addEventListener('click', (e) => {
      const pillarIndex = e.currentTarget.getAttribute('data-pillar');
      selectPillarChoice(pillarIndex);
    });
  });
}

// Switches primary active screen view
function switchState(newState) {
  currentGameState = newState;

  // Hide all screens
  Object.values(panels).forEach(panel => {
    if (panel) panel.classList.add('hidden');
  });

  // Show the requested screen
  switch (newState) {
    case GameState.MENU:
      panels.menu.classList.remove('hidden');
      break;
    case GameState.PILLARS:
      panels.pillars.classList.remove('hidden');
      if (window.pillarDraft) window.pillarDraft.generateChoices();
      break;
    case GameState.GAMEPLAY:
      panels.gameplay.classList.remove('hidden');
      if (window.cursorTracker) window.cursorTracker.startTracking();
      break;
    case GameState.INTERMISSION:
      panels.intermission.classList.remove('hidden');
      if (window.cursorTracker) window.cursorTracker.stopTracking();
      break;
  }
}

// Modal Helpers (Settings, Achievements)
function openModal(modalElement) {
  if (modalElement) modalElement.classList.remove('hidden');
}

function closeModal(modalElement) {
  if (modalElement) modalElement.classList.add('hidden');
}

// Handles selecting a choice on the Pillars screen
function selectPillarChoice(index) {
  console.log(`Pillar ${index} selected.`);
  // Transition into active gameplay
  switchState(GameState.GAMEPLAY);
}

// Global death trigger called when cursor leaves arena or hits hazard
function triggerGameOver(reason) {
  console.log(`GAME OVER: ${reason}`);
  if (window.cursorTracker) window.cursorTracker.stopTracking();
  alert(`YOU DIED!\nReason: ${reason}`);
  switchState(GameState.MENU);
}
