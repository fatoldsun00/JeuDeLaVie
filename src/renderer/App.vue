<template>
  <div id="app">
    <div
      v-show="errorMsg"
      id="errorMsg"
    >
      {{ errorMsg }}
    </div>

    <renderGame :arr-game="arrGame" />
    <button @click="changeState()">
      {{ state?"Stopper":"Lancer" }}
    </button>
    <button @click="nextTick()">
      Iteraton suivante
    </button>
    <button @click="reset()">
      Reinitialiser
    </button>
    <br>
    <input
      v-model="filename"
      type="text"
      placeholder="Nom fichier de sauvegarde"
    > <button @click="saveGame()">
      Sauvegarder le plateau
    </button>
    <select v-model="boardToLoad">
      <option
        v-for="(boardGame,k) in boardsGame"
        :key="k"
        :value="boardGame"
      >
        {{ boardGame }}
      </option>
    </select>
    <button @click="restoreGame()">
      Restaurer un plateau
    </button>
    <br>
    Hauteur <input
      v-model="dimension.h"
      type="range"
      min="3"
      max="30"
      @change="changeBoardSize()"
    >
    Largeur <input
      v-model="dimension.w"
      type="range"
      min="3"
      max="30"
      @change="changeBoardSize()"
    >
    <br>
    Vitesse d'execution <input
      v-model="interval"
      type="range"
      min="2"
      max="100"
      @change="changeInterval($event.target.value)"
    >
  </div>
</template>
<style>
  #app{
    margin: 0 auto;
  }
  #errorMsg{
    color: red
  }
</style>
<script>
import renderGame from '@/components/RenderGame'

export default {
  name: 'Jdlv',
  components: {
    renderGame,
  },
  data() {
    return {
      arrGame: [],
      state: false,
      filename: 'planeur',
      boardsGame: [],
      boardToLoad: undefined,
      dimension: {
        w: localStorage.getItem('dimensionw') || 30,
        h: localStorage.getItem('dimensionh') || 30,
      },
      interval: localStorage.getItem('interval') || 100,
      errorMsg: undefined,
      errorTimeOutPointer: undefined,
    }
  },
  created() {
    // Ininitialisation
    // Rafraichssement du plateau de jeu
    this.$electron.ipcRenderer.on('arrGame', (event, arg) => {
      this.arrGame = JSON.parse(arg)
    })
    // Liste des plateaux de jeu
    this.$electron.ipcRenderer.on('boardsGame', (event, arg) => {
      this.boardsGame = arg
    })
    // Rafraichssement de l'etat (lancé ou stoppé)
    this.$electron.ipcRenderer.on('state', (event, arg) => {
      /* eslint-disable no-unneeded-ternary */
      this.state = arg ? true : false
    })
    // Affichage des erreurs
    this.$electron.ipcRenderer.on('error', (event, arg) => {
      if (this.errorTimeOutPointer) {
        clearTimeout(this.errorTimeOutPointer)
      }

      this.errorTimeOutPointer = setTimeout(() => { this.errorMsg = undefined }, 2000)

      this.errorMsg = arg
    })
    this.changeBoardSize()
    this.changeInterval()
    this.getBoardsGame()
  },
  methods: {
    changeState() {
      this.state = !this.state
      this.$electron.ipcRenderer.send('setState', this.state)
    },
    nextTick() {
      this.$electron.ipcRenderer.send('nextTick')
    },
    reset() {
      this.$electron.ipcRenderer.send('reset')
    },
    changeInterval() {
      this.$electron.ipcRenderer.send('changeInterval', this.interval)
      // On enregistre l'interval ds le ocal storage pour le recharger au redemarrage
      localStorage.setItem('interval', this.interval)
    },
    changeBoardSize() {
      localStorage.setItem('dimensionw', this.dimension.w)
      localStorage.setItem('dimensionh', this.dimension.h)
      this.$electron.ipcRenderer.send('changeBoardSize', this.dimension)
    },
    saveGame() {
      this.$electron.ipcRenderer.send('saveGame', this.filename)
      this.getBoardsGame()
    },
    restoreGame() {
      this.$electron.ipcRenderer.send('restoreGame', this.boardToLoad)
    },
    getBoardsGame() {
      this.$electron.ipcRenderer.send('getBoardsGame')
    },
  },
}
</script>
