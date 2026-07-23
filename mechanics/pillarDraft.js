// mechanics/pillarDraft.js - Dynamic Pillars Selection System

class PillarDraft {
  constructor() {
    // Available Enemy Pool
    this.enemyPool = [
      {
        type: 'ENEMY',
        name: 'Snail',
        desc: 'Slowly tracks cursor continuously across the play area.'
      },
      {
        type: 'ENEMY',
        name: 'Phantom',
        desc: 'Follows your exact recent movement path right behind you.'
      },
      {
        type: 'ENEMY',
        name: 'Infection',
        desc: 'Converts sections of the screen into temporary danger zones.'
      }
    ];

    this.activeChoices = [];
  }

  generateChoices() {
    const pillarsContainer = document.querySelector('.pillars-container');
    if (!pillarsContainer) return;

    // Clear existing pillars HTML
    pillarsContainer.innerHTML = '';

    // Pick 3 enemies (or up to available pool size)
    this.activeChoices = [...this.enemyPool];

    // Build the 3 Pillar cards dynamically
    this.activeChoices.forEach((choice, index) => {
      const pillarEl = document.createElement('div');
      pillarEl.className = 'pillar';
      pillarEl.setAttribute('data-pillar', index);

      pillarEl.innerHTML = `
        <div class="pillar-content">
          <div class="pillar-type">${choice.type}</div>
          <div class="pillar-name">${choice.name}</div>
          <div class="pillar-desc">${choice.desc}</div>
        </div>
      `;

      // Click listener to select enemy
      pillarEl.addEventListener('click', () => {
        this.selectChoice(choice);
      });

      pillarsContainer.appendChild(pillarEl);
    });
  }

  selectChoice(selectedChoice) {
    console.log(`Selected enemy hazard: ${selectedChoice.name}`);
    
    // Add enemy to active run list
    if (window.activeEnemies) {
      window.activeEnemies.push(selectedChoice);
    }

    // Transition into active gameplay phase
    switchState(GameState.GAMEPLAY);
  }
}

// Global instance
window.pillarDraft = new PillarDraft();
