function getMinMax(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth <= 0) {
        return {
          backgroundColor: '#eb4d4b',
        };
      }
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
      if (this.playerHealth <= 0) {
        return {
          backgroundColor: '#eb4d4b',
        };
      }
      return { width: this.playerHealth + '%' };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 5 !== 0;
    },
    mayUseHeal() {
      if (this.playerHealth === 100) return true;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0) {
        // Player lost
        this.winner = 'monster';
      }
    },
    monsterHealth(value) {
      if (value <= 0) {
        // Monster lost
        this.winner = 'player';
      }
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getMinMax(5, 12);
      this.addLogMessage('player', 'attack', attackValue);
      this.monsterHealth -= attackValue;

      if (this.monsterHealth > 0) {
        this.attackPlayer();
      }
    },
    attackPlayer() {
      const attackValue = getMinMax(8, 15);
      setTimeout(() => {
        this.addLogMessage('monster', 'attack', attackValue);
        this.playerHealth -= attackValue;
      }, 500);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getMinMax(10, 25);
      this.addLogMessage('player', 'attack', attackValue);
      this.monsterHealth -= attackValue;

      if (this.monsterHealth > 0) {
        this.attackPlayer();
      }
    },
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
    surrender() {
      this.winner = 'monster';
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
      console.log(this.logMessages);
    },
  },
});

app.mount('#game');
