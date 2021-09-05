function getMinMax(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
    };
  },
  computed: {
    monsterBarStyles() {
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
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
      }
    },
    monsterHealth(value) {
      if (value <= 0) {
        // Monster lost
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const attackValue = getMinMax(5, 12);
      this.monsterHealth -= attackValue;
      if (this.monsterHealth > 0) {
        this.attackPlayer();
      }
    },
    attackPlayer() {
      setTimeout(() => {
        const attackValue = getMinMax(8, 15);
        this.playerHealth -= attackValue;
      }, 500);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getMinMax(10, 25);
      this.monsterHealth -= attackValue;
      if (this.monsterHealth > 0) {
        this.attackPlayer();
      }
    },
    healPlayer() {
      const healValue = getMinMax(5, 10);
      if (this.playerHealth + healValue > 100) this.playerHealth = 100;
      else this.playerHealth += healValue;
      this.healMonster();
    },
    healMonster() {
      const healValue = getMinMax(3, 8);
      setTimeout(() => {
        if (this.monsterHealth + healValue > 100) this.monsterHealth = 100;
        else this.monsterHealth += healValue;
      }, 500);
    },
  },
});

app.mount('#game');
