class GameObjects {
  constructor(config){
    this.isInteractable = config.isInteractable || false
    this.id = null
    this.isMounted = false
    this.x = config.x,
    this.hasAnimation = config.hasAnimation || false
    this.isControlled = config.isControlled || false
    this.direction = config.direction || 'down'
    this.y = config.y
    this.sizeH = config.sizeH
    this.sizeW = config.sizeW
    this.cropYW = config.cropYW
    this.cropXW = config.cropXW
    this.cropY = config.cropY
    this.cropX = config.cropX
    this.sprite = new Sprite({
      gameObject: this,
      useShadow: config.useShadow,
      useDoor: config.useDoor,
      src: config.src || '/images/player.png'
    })

    this.behaviorLoop = config.behaviorLoop || []
    this.behaviorLoopIndex = 0

    this.talking = config.talking || {}
  }

  mount(map) {
    this.isMounted = true
    map.addWall(this.x, this.y)

    //If we have a behavior kicjk off after a short delay
    setTimeout(() =>{
      this.doBehaviorEvent(map)
    },10)
  }
  update(){
    
  }
  async doBehaviorEvent(map){
//Dont do anything if there is a more important cutscene or i Dnt have a config to do anything
     if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding){
      return
     }

      //setting up out Event with relevent info
     let eventConfig = this.behaviorLoop[this.behaviorLoopIndex]
     eventConfig.who = this.id
//Cretae our next event config
     const eventHandler = new OverWorldEvent({map, event: eventConfig})
     await eventHandler.init();
//Setting the next event to fire
  this.behaviorLoopIndex += 1
  if(this.behaviorLoopIndex === this.behaviorLoop.length){
    this.behaviorLoopIndex = 0
  }

 // Do it Again
 this.doBehaviorEvent(map)

  }
}