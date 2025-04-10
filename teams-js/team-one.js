class Game {
  constructor(config){
     this.el = config.element
     this.canvas = this.el.querySelector('#game')
     this.ctx = this.canvas.getContext('2d')
     this.map = null
  }
  updateGame(){
      const update = () =>{
        this.ctx.clearRect(0,0, 672, 384)
        this.map.drawMap(this.ctx)
        Object.values(this.map.gameObjects).sort((a,b)=>{
          return a.y - b.y;
        }).forEach(object => {
          object.update({
            arrow: this.directionInput.direction,
            map: this.map
          })
          object.sprite.draw(this.ctx)
        })
        requestAnimationFrame(()=> {
          update()
        })
      }
      update()
  }
  bindActionInput(){
    new KeyPressListener("Enter", ()=>{
      //Is there a persion here to talk to?
      this.map.checkForActionCutscene()
    })
    new KeyPressListener("KeyE", ()=>{
      //Is there a persion here to talk to?
      this.map.checkForItem()
    })
  }

  bindEmployeePositionCheck() {
      document.addEventListener("PersonWalkingComplete", e => {
        if(e.detail.whoId === "employee") {
          this.map.checkForFootstepCutscene()
        }
      })
  }

  start(){
    this.map = new MainMap(window.OverWorldMaps.Kitchen)
    this.map.mountObjects()

    this.bindActionInput()
    this.bindEmployeePositionCheck()

    this.directionInput = new DirectionInput();
    this.directionInput.init()
    this.directionInput.direction
 
    this.updateGame()

     this.map.startCutscene([
        {type: "textMessage", text: `Welcome to *Project Closure*. Good luck, you’ll need it.`},
        {type: "textMessage", text: `In this Project Closure Game You will Know How to close the Resturant`},
        {type: "textMessage", text: `The Objective of the game is to get to know how to close a project`},
        {type: "textMessage", text: `you will go to places around them map, and understand the task of how to close the resturant`},
        {type: "textMessage", text: `Go talk to the Chef (Press Enter to talk To the Chef) to get started. He will Be The One to decide if everything is closed properly`},
     ])
  }
}
const game = new Game({element: document.querySelector('.canvas')})
game.start()

const BackButton = document.querySelector('.btn-container')
BackButton.addEventListener('click', () => {
  window.location.href = 'teams/index.html'
})



