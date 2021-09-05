//Helper function for random values of heal and attack
function getMinMax(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      // Neccessary variables and initial values
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    // Monster health bar activity
    monsterBarStyles() {
      if (this.monsterHealth <= 0) {
        return {
          backgroundColor: '#eb4d4b',
        };
      }
      return { width: this.monsterHealth + '%' };
    },
    // Player health bar activity
    playerBarStyles() {
      if (this.playerHealth <= 0) {
        return {
          backgroundColor: '#eb4d4b',
        };
      }
      return { width: this.playerHealth + '%' };
    },
    // Special attack every fith attack
    mayUseSpecialAttack() {
      return this.currentRound % 5 !== 0;
    },
    // Can use heal if healt bar lower than 100
    mayUseHeal() {
      if (this.playerHealth === 100) return true;
    },
  },
  watch: {
    // Watcher for the player health bar
    playerHealth(value) {
      if (value <= 0) {
        // Player lost
        this.winner = 'monster';
      }
    },
    // Watcher for the monster health bar
    monsterHealth(value) {
      if (value <= 0) {
        // Monster lost
        this.winner = 'player';
      }
    },
  },
  methods: {
    // Initial values
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
    },
    // The PLAYER attacking the Monster
    attackMonster() {
      this.currentRound++;
      const attackValue = getMinMax(5, 12);
      this.addLogMessage('player', 'attack', attackValue);
      this.monsterHealth -= attackValue;

      if (this.monsterHealth > 0) {
        this.attackPlayer();
      }
    },
    // The MONSTER attacking the Player
    attackPlayer() {
      const attackValue = getMinMax(8, 15);
      setTimeout(() => {
        this.addLogMessage('monster', 'attack', attackValue);
        this.playerHealth -= attackValue;
      }, 500);
    },
    // The PLAYER'S special attacking the Monster
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getMinMax(10, 25);
      this.addLogMessage('player', 'special-attack', attackValue);
      this.monsterHealth -= attackValue;

      if (this.monsterHealth > 0) {
        this.attackPlayer();
      }
    },
    // The PLAYER healing theirself
    healPlayer() {
      const healValue = getMinMax(5, 10);
      if (this.playerHealth + healValue > 100) {
        this.addLogMessage('player', 'heal', 100 - this.playerHealth);
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
        this.addLogMessage('player', 'heal', healValue);
      }
      this.healMonster();
    },
    // The MONSTER healing itself
    healMonster() {
      const healValue = getMinMax(3, 8);
      setTimeout(() => {
        if (this.monsterHealth + healValue > 100) {
          this.addLogMessage('monster', 'heal', 100 - this.monsterHealth);
          this.monsterHealth = 100;
        } else {
          this.addLogMessage('monster', 'heal', healValue);
          this.monsterHealth += healValue;
        }
      }, 500);
    },
    // The PLAYER surrenders
    surrender() {
      this.winner = 'monster';
    },
    // Battle log messages array
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount('#game');
