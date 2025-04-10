class MainMap{
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.hasTrash = true; // Initially, there is trash
    this.playerHasTrash = false; // Player doesn't have the trash yet
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};
    this.map = new Image();
    this.map.src = config.mapSrc;
    this.map.onload = () => {
      this.mapLoaded = true;
    };
    this.isCutscenePlaying = false;
  }
  drawMap(ctx){
    ctx.drawImage(
      this.map, 0,0, 672, 384
    )
  }
  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction)
    return this.walls[`${x},${y}`] || false
  }

  mountObjects(){
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key]
      object.id = key
      //todo: determnine if fthis objec tshould actuualy mount
     object.mount(this)
    })
  }

 async startCutscene(events){
    this.isCutscenePlaying = true
    
    for(let i=0; i<events.length; i++){
      const eventHandler = new OverWorldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init()
    }

    this.isCutscenePlaying = false

    //Reset NPCS to do their idle behvior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }
  

  checkForActionCutscene(){
    const employee = this.gameObjects["employee"]
    const nextCoords = utils.nextPosition(employee.x, employee.y, employee.direction)
    const match = Object.values(this.gameObjects).find(object =>{
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    })
    console.log({match})
    if(!this.isCutscenePlaying && match && match.talking.length){
      this.startCutscene(match.talking[0].events)
    }
  }
  checkForItem() {
    const employee = this.gameObjects["employee"];
    const nextCoords = utils.nextPosition(employee.x, employee.y, employee.direction);
  
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}` && object.isInteractable;
    });
    console.log({match})
  
    if (!this.isCutscenePlaying && match) {
      // Initiate interaction or cutscene with the matched object
      this.startCutscene(match.talking[0].events);
    }
  }
  checkForFootstepCutscene(){
    const employee = this.gameObjects["employee"];
    const match = this.cutsceneSpaces[`${employee.x},${employee.y}`]
   if (!this.isCutscenePlaying && match){
    this.startCutscene(match[0].events)
   }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction){
    this.removeWall(wasX,wasY)
    const {x,y} = utils.nextPosition(wasX,wasY,direction)
    this.addWall(x,y)
  }
}

window.OverWorldMaps = {
  Kitchen:{
    mapSrc: '/images/kitchen.png',
    gameObjects: {
      fridge: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(4),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(4),
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(12),
        x: utils.withGrid(20),
        y: utils.withGrid(3),
        src:'/images/assets.png'
      }),
      table: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(6),
        sizeH: utils.withGrid(3),
        cropXW: utils.withGrid(6),
        cropYW: utils.withGrid(3),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(18),
        x: utils.withGrid(16),
        y: utils.withGrid(9.7),
        src:'/images/assets.png'
      }),
      table: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(6),
        sizeH: utils.withGrid(3),
        cropXW: utils.withGrid(6),
        cropYW: utils.withGrid(3),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(18),
        x: utils.withGrid(16),
        y: utils.withGrid(9.7),
        src:'/images/assets.png'
      }),
      table1: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(6),
        sizeH: utils.withGrid(3),
        cropXW: utils.withGrid(6),
        cropYW: utils.withGrid(3),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(18),
        x: utils.withGrid(4),
        y: utils.withGrid(9.7),
        src:'/images/assets.png'
      }),
      oven: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(4),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(4),
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(14),
        x: utils.withGrid(22),
        y: utils.withGrid(3),
        src:'/images/assets.png'
      }),
      counter: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(8),
        cropX: utils.withGrid(4),
        x: utils.withGrid(26),
        y: utils.withGrid(5),
        src:'/images/assets.png'
      }),
      counter2: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(8),
        cropX: utils.withGrid(4),
        x: utils.withGrid(28),
        y: utils.withGrid(5),
        src:'/images/assets.png'
      }),
      counter3: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(8),
        cropX: utils.withGrid(4),
        x: utils.withGrid(30),
        y: utils.withGrid(5),
        src:'/images/assets.png'
      }),
      counterTopLeft: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(6),
        cropX: utils.withGrid(2),
        x: utils.withGrid(24),
        y: utils.withGrid(5),
        src:'/images/assets.png'
      }),
      counterTopRight: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(4),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(4),
        cropY: utils.withGrid(8),
        cropX: utils.withGrid(6),
        x: utils.withGrid(32),
        y: utils.withGrid(5),
        src:'/images/assets.png'
      }),
      counterBottomRight: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(4),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(4),
        cropY: utils.withGrid(10),
        cropX: utils.withGrid(6),
        x: utils.withGrid(32),
        y: utils.withGrid(9),
        src:'/images/assets.png'
      }),
      counterBottom: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(8),
        cropX: utils.withGrid(4),
        x: utils.withGrid(30),
        y: utils.withGrid(11),
        src:'/images/assets.png'
      }),
      counterBottom1: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(8),
        cropX: utils.withGrid(4),
        x: utils.withGrid(28),
        y: utils.withGrid(11),
        src:'/images/assets.png'
      }),
      counterBottomLeft: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(10),
        cropX: utils.withGrid(4),
        x: utils.withGrid(26),
        y: utils.withGrid(11),
        src:'/images/assets.png'
      }),
      counterChair: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(6),
        x: utils.withGrid(26),
        y: utils.withGrid(13),
        src:'/images/assets.png'
      }),
      counterChair1: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(6),
        x: utils.withGrid(30),
        y: utils.withGrid(13),
        src:'/images/assets.png'
      }),
      chairLeft: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(8),
        x: utils.withGrid(14.5),
        y: utils.withGrid(9.5),
        src:'/images/assets.png'
      }),
      chairRight: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(10),
        x: utils.withGrid(21.5),
        y: utils.withGrid(9.5),
        src:'/images/assets.png'
      }),
      chairDown: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(10),
        x: utils.withGrid(16.5),
        y: utils.withGrid(10),
        src:'/images/assets.png'
      }),
      chairDown3: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(10),
        x: utils.withGrid(7.5),
        y: utils.withGrid(10),
        src:'/images/assets.png'
      }),
      chairUp3: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(8),
        x: utils.withGrid(7.5),
        y: utils.withGrid(8.5),
        src:'/images/assets.png'
      }),
      chairUp4: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(8),
        x: utils.withGrid(4.5),
        y: utils.withGrid(8.5),
        src:'/images/assets.png'
      }),
      chairLeft2: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(8),
        x: utils.withGrid(2.5),
        y: utils.withGrid(9.5),
        src:'/images/assets.png'
      }),
      chairRight1: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(10),
        x: utils.withGrid(9.5),
        y: utils.withGrid(9.5),
        src:'/images/assets.png'
      }),
      chairDown4: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(10),
        x: utils.withGrid(4.5),
        y: utils.withGrid(10),
        src:'/images/assets.png'
      }),
      chairDown2: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(10),
        x: utils.withGrid(19.5),
        y: utils.withGrid(10),
        src:'/images/assets.png'
      }),
      chairUp2: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(8),
        x: utils.withGrid(19.5),
        y: utils.withGrid(8.5),
        src:'/images/assets.png'
      }),
      chairUp: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(8),
        x: utils.withGrid(16.5),
        y: utils.withGrid(8.5),
        src:'/images/assets.png'
      }),
      trashCanFull: new GameObjects({
        isInteractable: true,
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(40),
        x: utils.withGrid(16),
        y: utils.withGrid(5),
        src:'/images/assets.png'
      }),
      plate: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(12),
        cropX: utils.withGrid(16),
        x: utils.withGrid(6),
        y: utils.withGrid(15),
        src:'/images/assets.png'
      }),
      food: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(2),
        x: utils.withGrid(28),
        y: utils.withGrid(18),
        src:'/images/foods.png'
      }),
      cabnit: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(4),
        x: utils.withGrid(14),
        y: utils.withGrid(0),
        src:'/images/assets.png'
      }),
      cabnit1: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(4),
        x: utils.withGrid(12),
        y: utils.withGrid(0),
        src:'/images/assets.png'
      }),
      cabnit2: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(4),
        x: utils.withGrid(10),
        y: utils.withGrid(0),
        src:'/images/assets.png'
      }),
      cabnit3: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(4),
        x: utils.withGrid(8),
        y: utils.withGrid(0),
        src:'/images/assets.png'
      }),
      cabnit4: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(2),
        cropX: utils.withGrid(4),
        x: utils.withGrid(34),
        y: utils.withGrid(0),
        src:'/images/assets.png'
      }),
      door: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: 56,
        cropXW: utils.withGrid(2),
        cropYW: 56,
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(0),
        x: utils.withGrid(0),
        y: utils.withGrid(2.5),
        src:'/images/door.png'
      }),
      dishWasher: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(4),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(4),
        cropY: utils.withGrid(0),
        cropX: utils.withGrid(16),
        x: utils.withGrid(18),
        y: utils.withGrid(3),
        src:'/images/assets.png'
      }),
      microwave: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(6),
        cropX: utils.withGrid(8),
        x: utils.withGrid(26),
        y: utils.withGrid(3.4),
        src:'/images/assets.png'
      }),
      blender: new GameObjects({
        hasAnimation: false,
        useShadow: false,
        sizeW: utils.withGrid(2),
        sizeH: utils.withGrid(2),
        cropXW: utils.withGrid(2),
        cropYW: utils.withGrid(2),
        cropY: utils.withGrid(8),
        cropX: utils.withGrid(8),
        x: utils.withGrid(28),
        y: utils.withGrid(11),
        src:'/images/assets.png'
      }),
      employee: new Player({
        isControlled: true,
        hasAnimation: true,
        useShadow: true,
        direction: 'down',
        sizeW: utils.withGrid(3),
        sizeH: utils.withGrid(3),
        cropXW: utils.withGrid(3),
        cropYW: utils.withGrid(3),
        cropY: utils.withGrid(3),
        cropX: utils.withGrid(3),
        x: utils.withGrid(14),
        y: utils.withGrid(6),
        src:'/images/player.png'
      }),
      chef: new Player({
        behaviorLoop: [
          { type: 'stand', direction: 'right', time : 700},
         { type: 'stand', direction: 'up', time : 1200},
          { type: 'stand', direction: 'left', time : 600},
          { type: 'stand', direction: 'up', time : 800},
        ],
        talking: [
         {
          events: [
            {type: "textMessage", text: `Hello There Employee, I’m the Chef, and… yeah, it’s a bit of a mess in here.`, faceEmployee: "chef"},
            {type: "textMessage", text: `The team left in a rush, and we forgot to actually finish cleaning up. Typical.`},
            {type: "textMessage", text: `Your job? Is to go Around the Kitchen To the colored squares to learn how to close that section`},
            {type: "textMessage", text: `You’ve got four tasks: Take out the trash, Load the dishwasher, Put the food in the fridge, Put the plates in the cabinets`},
            {type: "textMessage", text: `Use the arrow keys to move or WASD Keys, [Enter] to interact, and [Enter] to keep talkin’ to me.`},
            {type: "textMessage", text: `When all that’s done? Boom. Project closed. Kitchen clean. Everyone’s happy.`},
            {type: "textMessage", text: `After Go take The Project Closure Test, After You Complete all The Tasks`},
            {type: "textMessage", text: `Lets Start By taking Out the Trash, go to The Red Sqaure Near the TrashCan`},
          ]
         } 
        ],
        isControlled: false,
        hasAnimation: true,
        useShadow: true,
        sizeW: utils.withGrid(3),
        sizeH: utils.withGrid(3),
        cropXW: utils.withGrid(3),
        cropYW: utils.withGrid(3),
        cropY: utils.withGrid(3),
        cropX: utils.withGrid(3),
        x: utils.withGrid(16),
        y: utils.withGrid(14),
        src:'/images/chef.png'
      }),
    },
      walls: {
        //Trashcan
        [utils.asGridCoord(8,2)] : true,
        //counterChairs
        [utils.asGridCoord(13,6)] : true,
        [utils.asGridCoord(15,6)] : true,
        //counters
        [utils.asGridCoord(12,2)] : true,
        [utils.asGridCoord(13,2)] : true,
        [utils.asGridCoord(14,2)] : true,
        [utils.asGridCoord(15,2)] : true,
        [utils.asGridCoord(16,2)] : true,
        [utils.asGridCoord(16,3)] : true,
        [utils.asGridCoord(16,4)] : true,
        [utils.asGridCoord(16,5)] : true,
        [utils.asGridCoord(15,5)] : true,
        [utils.asGridCoord(14,5)] : true,
        [utils.asGridCoord(13,5)] : true,
        
        //table
        [utils.asGridCoord(8,4)] : true,
        [utils.asGridCoord(9,4)] : true,
        [utils.asGridCoord(10,4)] : true,
        [utils.asGridCoord(2,4)] : true,
        [utils.asGridCoord(3,4)] : true,
        [utils.asGridCoord(4,4)] : true,
        //top wall
        [utils.asGridCoord(0,1)] : true,
        [utils.asGridCoord(1,1)] : true,
        [utils.asGridCoord(2,1)] : true,
        [utils.asGridCoord(3,1)] : true,
        [utils.asGridCoord(4,1)] : true,
        [utils.asGridCoord(5,1)] : true,
        [utils.asGridCoord(6,1)] : true,
        [utils.asGridCoord(7,1)] : true,
        [utils.asGridCoord(8,1)] : true,
        [utils.asGridCoord(9,1)] : true,
        [utils.asGridCoord(10,1)] : true,
        [utils.asGridCoord(11,1)] : true,
        [utils.asGridCoord(12,1)] : true,
        [utils.asGridCoord(13,1)] : true,
        [utils.asGridCoord(14,1)] : true,
        [utils.asGridCoord(15,1)] : true,
        [utils.asGridCoord(16,1)] : true,
        [utils.asGridCoord(17,1)] : true,
        [utils.asGridCoord(18,1)] : true,
        [utils.asGridCoord(19,1)] : true,
        [utils.asGridCoord(20,1)] : true,
        //left side
        [utils.asGridCoord(-1,2)] : true,
        [utils.asGridCoord(-1,3)] : true,
        [utils.asGridCoord(-1,4)] : true,
        [utils.asGridCoord(-1,5)] : true,
        [utils.asGridCoord(-1,6)] : true,
        [utils.asGridCoord(-1,7)] : true,
        [utils.asGridCoord(-1,8)] : true,
        [utils.asGridCoord(-1,9)] : true,
        [utils.asGridCoord(-1,10)] : true,
        //right side
        [utils.asGridCoord(21,2)] : true,
        [utils.asGridCoord(21,3)] : true,
        [utils.asGridCoord(21,4)] : true,
        [utils.asGridCoord(21,5)] : true,
        [utils.asGridCoord(21,6)] : true,
        [utils.asGridCoord(21,7)] : true,
        [utils.asGridCoord(21,8)] : true,
        [utils.asGridCoord(21,9)] : true,
        [utils.asGridCoord(21,10)] : true,
        //bottom
        [utils.asGridCoord(20,11)] : true,
        [utils.asGridCoord(19,11)] : true,
        [utils.asGridCoord(18,11)] : true,
        [utils.asGridCoord(17,11)] : true,
        [utils.asGridCoord(16,11)] : true,
        [utils.asGridCoord(15,11)] : true,
        [utils.asGridCoord(14,11)] : true,
        [utils.asGridCoord(13,11)] : true,
        [utils.asGridCoord(12,11)] : true,
        [utils.asGridCoord(11,11)] : true,
        [utils.asGridCoord(10,11)] : true,
        [utils.asGridCoord(9,11)] : true,
        [utils.asGridCoord(8,11)] : true,
        [utils.asGridCoord(7,11)] : true,
        [utils.asGridCoord(6,11)] : true,
        [utils.asGridCoord(5,11)] : true,
        [utils.asGridCoord(4,11)] : true,
        [utils.asGridCoord(3,11)] : true,
        [utils.asGridCoord(2,11)] : true,
        [utils.asGridCoord(1,11)] : true,
        [utils.asGridCoord(0,11)] : true,
      },
      cutsceneSpaces: {
        [utils.asGridCoord(7,2)] : [
          {
            events: [
              { who: 'chef', type: 'stand', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'employee', type: 'stand', direction: 'left'},
              { who: 'chef', type: 'stand', direction: 'right', time:200, faceEmployee: "chef"},
              {type: "textMessage", text: `Alright, listen up! To close out the project, it's just like taking out the trash in the kitchen.`},
              {type: "textMessage", text: `You’ve finished all the tasks, but now you need to clean up and wrap things up properly.`},
              {type: "textMessage", text: `To ‘take out the trash’ for a project, Simply go to the door and the bin will be There`},
              {type: "textMessage", text: `Just like you’d handle the final tasks and make sure everything’s cleared away.`},
              {type: "textMessage", text: `Don’t forget to confirm with your client that all’s good before you officially finish! (In this case It does It Automatically when you take out the trash)"`},
              {type: "textMessage", text: `After The trash Is Taken Out Go Over To A Plate on The Red Sqaure And I will show you what to do next`},
              { who: 'employee', type: 'stand', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              {type: "textMessage", text: `Now go Over to The door`},
            ]
          }
        ],
        [utils.asGridCoord(0,2)] :[
          {
            events: [
              { who: 'chef', type: 'stand', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'employee', type: 'stand', direction: 'down'},
              { who: 'chef', type: 'stand', direction: 'up', time:200, faceEmployee: "chef"},
              {type: "textMessage", text: `Good Now that you Know where The trash goes at the end of the night, now you can learn how to put away Dishes!`},
              {type: "textMessage", text: `Knowing exactly what shold be waste and what shoudnt is crucial to Project Closure`},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              {type: "textMessage", text: `Now Head Over to The Plates (Next To The Red Square) on The Floor, Someone Must have left there`},
            ]
          }
        ],
        [utils.asGridCoord(4,7)] :[
          {
            events: [
              { who: 'chef', type: 'stand', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'employee', type: 'stand', direction: 'right'},
              { who: 'chef', type: 'stand', direction: 'left', time:200, faceEmployee: "chef"},
              {type: "textMessage", text: `Well Who ever Was Here Obviously Didnt Know Where these Plates go...`},
              {type: "textMessage", text: `Now They Are on the Dirty Floor!`},
              {type: "textMessage", text: `For This You Will have to Know How to Clean Them In the DishWasher!`},
              {type: "textMessage", text: `These Dishes Can Be used For next service So it is something we Want to Keep and not thrown Away`},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              {type: "textMessage", text: `Now Go Over To the DishWasher (Yellow Square) To learn how to clean these Dishes`},
            ]
          }
        ],
        [utils.asGridCoord(9,2)] : [
          {
            events: [
              { who: 'chef', type: 'stand', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'employee', type: 'stand', direction: 'down'},
              { who: 'chef', type: 'stand', direction: 'up', time:200, faceEmployee: "chef"},
              {type: "textMessage", text: `Because Those Plates Are reusable We can keep it in our Inventory, And Because none of them are Broken We can Put Them In here to clean!`},
              {type: "textMessage", text: `When Closing it is important to know what inventory we have and it is Updated Each Night Before We Close!`},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              {type: "textMessage", text: `Now Head Over to the Cabnit Put The Dishes Away!`},
              {type: "textMessage", text: `Head Over To The Cabnit on the Far right Side (Purple Square)`},
              { who: 'employee', type: 'walk', direction: 'down'},
            ]
          }
        ],
        [utils.asGridCoord(17,2)] : [
          {
            events: [
              { who: 'chef', type: 'stand', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'employee', type: 'stand', direction: 'down'},
              { who: 'chef', type: 'stand', direction: 'up', time:200, faceEmployee: "chef"},
              {type: "textMessage", text: `Now We Can Finally Put the Dishes Once they are Clean!`},
              {type: "textMessage", text: `Its Important when closing to Keep A Clean Kitchen For the Next Day!`},
              {type: "textMessage", text: `Now I see Some Food On The Floor Lets Take A closer Look at that!`},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              {type: "textMessage", text: `Head Over to the Jar Of Jam Someone Must have Also Left On the Floor! (Red Square)`},
            ]
          }
        ],
        [utils.asGridCoord(13,8)] : [
          {
            events: [
              { who: 'chef', type: 'stand', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'employee', type: 'stand', direction: 'left'},
              { who: 'chef', type: 'stand', direction: 'right', time:200, faceEmployee: "chef"},
              {type: "textMessage", text: `It looks Like the Jam is still in Good Condition`},
              {type: "textMessage", text: `Lets Make sure it does not go bad!`},
              {type: "textMessage", text: `Lastly Go Over To the Fridge to Learn how to put Food Away!`},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'up'},
              {type: "textMessage", text: `Head Over To the Fridge (Blue Square)`},
            ]
          }
        ],
        [utils.asGridCoord(10,2)] : [
          {
            events: [
              { who: 'chef', type: 'stand', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'up'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'employee', type: 'stand', direction: 'down'},
              { who: 'chef', type: 'stand', direction: 'up', time:200, faceEmployee: "chef"},
              {type: "textMessage", text: `We Are Almost Done Learning How To close This place!`},
              {type: "textMessage", text: `Lets Make Sure Any Foods Like the Jam get Put In here to keep From Going Bad`},
              {type: "textMessage", text: `Seeing What is waste and not We count all the Items, This Has To be Updated Every Night`},
              {type: "textMessage", text: `This Will Help me Know How much Money We lost, And Waste We Had to Throw Away!`},
              {type: "textMessage", text: `Luckily We Had No Waste Of Food Tonight!`},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'right'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'down'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              { who: 'chef', type: 'walk', direction: 'left'},
              {type: "textMessage", text: `Well Thats Everything On how To close This Kitchen!`},
              {type: "textMessage", text: `Head Over To the Test, By clicking on the Go Back Then Take Test!`},
              {type: "textMessage", text: `Good Luck`},
              {type: "textMessage", text: `Feel Free To Roam Around The Game Too (This Took Forever!)`},
              {type: "textMessage", text: `Game Created By Dmitry Ferrantelli - Project Closure Resturant`},
              { who: 'employee', type: 'walk', direction: 'down'},
            ]
          }
        ],
      }
  },
  KitchenBlue:{
    mapSrc: '/images/kitchenBlue.png',
    gameObjects: {
      employee: new Player({
        sizeW: utils.withGrid(3),
        sizeH: utils.withGrid(3),
        cropXW: utils.withGrid(3),
        cropYW: utils.withGrid(3),
        cropY: utils.withGrid(6),
        cropX: utils.withGrid(6),
        x: utils.withGrid(16) -8,
        y: utils.withGrid(6),
        src:'/images/player.png'
      }),
      employee2: new Player({
        sizeW: utils.withGrid(3),
        sizeH: utils.withGrid(3),
        cropXW: utils.withGrid(3),
        cropYW: utils.withGrid(3),
        cropY: utils.withGrid(3),
        cropX: utils.withGrid(6),
        x: utils.withGrid(32) -8,
        y: utils.withGrid(12),
        src:'/images/player.png'
      }),
    } 
  }
}