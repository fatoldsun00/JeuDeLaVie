const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron')
const path = require('path')
const { game } = require('../src/main/game')

describe('Application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.app = new Application({

      path: electronPath,

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '../dist/electron/main.js')]
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })
  describe('init',function(){
     it('Les devTools sont masqués', function () {
      return this.app.client.getWindowCount().then(function (count) {
        assert.equal(count, 1)
      })
    })
  })
  describe('game',function(){
    it('new Game renvoie un array', function () {
     assert.ok(typeof game.getGame() === 'Array')
   })
 })
})
