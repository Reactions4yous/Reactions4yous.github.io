class Player extends GameObjects {
  constructor(config){
    super(config)
    this.tileProgressRemaining = 0
    this.isStanding = false
    this.directionUpdate = {
      "up": ["y", -0.05],
      "down": ["y", 0.05],
      "left": ["x", -0.05],
      "right": ["x", 0.05],
    }
  }

  update(state){
    if(this.tileProgressRemaining > 0){
      this.updatePosition()
    } else {
      //case: were keyboared and ahve an arrow pressed
      if (!state.map.isCutscenePlaying && state.arrow && this.isControlled) {
        this.startBehavior(state, {
          type: 'walk',
          direction: state.arrow
        })
      }
      this.updateSprite(state)
    }
  }

  startBehavior(state, behavior) {
    //Set charotre direction to whatver behavior has
    this.direction = behavior.direction;
    if (behavior.type === "walk"){
      //if space is not free
      if(state.map.isSpaceTaken(this.x, this.y, this.direction)){

        behavior.retry && setTimeout(()=>{
          this.startBehavior(state, behavior)
        },10)
        return
      }
      //ready to walk
      state.map.moveWall(this.x,this.y,this.direction)
      this.tileProgressRemaining = 16
      this.updateSprite(state)
    }
    if(behavior.type === "stand"){
      this.isStanding = true
      setTimeout(()=> {
       utils.emitEvent("PersonStandComplete", {
      whoId: this.id
       });
       this.isStanding = false
      }, behavior.time)
    }
  }
 

  updatePosition(){
     const [property, change] = this.directionUpdate[this.direction]
     this[property] += change;
     this.tileProgressRemaining -= 1 

     if(this.tileProgressRemaining === 0){
      //We finshed the walk
      utils.emitEvent("PersonWalkingComplete", {
        whoId: this.id
      })
     }
  }

  updateSprite() {

    if(this.tileProgressRemaining > 0){
      this.sprite.setAnimation("walk-"+this.direction);
      return
    }
    this.sprite.setAnimation("idle-"+this.direction)


  }
}