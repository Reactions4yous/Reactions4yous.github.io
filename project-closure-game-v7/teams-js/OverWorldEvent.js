class OverWorldEvent {
  constructor({map,event}){
    this.map = map
    this.event = event
  }

  stand(resolve){
    const who = this.map.gameObjects[this.event.who]
    who.startBehavior({
     map: this.map
    }, {
     type: 'stand',
     direction: this.event.direction,
     time: this.event.time
    })
    //Set up a handler to complete when correct person is donw walking, thewn resolve the event
    const completeHandler = e => {
     if (e.detail.whoId === this.event.who){
       document.removeEventListener("PersonStandComplete", completeHandler)
       resolve();
   }
  }
    document.addEventListener("PersonStandComplete", completeHandler)
  }
  walk(resolve){
   const who = this.map.gameObjects[this.event.who]
   who.startBehavior({
    map: this.map
   }, {
    type: 'walk',
    direction: this.event.direction,
    retry: true
   })
   //Set up a handler to complete when correct person is donw walking, thewn resolve the event
   const completeHandler = e => {
    if (e.detail.whoId === this.event.who){
      document.removeEventListener("PersonWalkingComplete", completeHandler)
      resolve();
    }
   }
   

   document.addEventListener("PersonWalkingComplete", completeHandler)
  }
  
  textMessage(resolve){
    if(this.event.faceEmployee){
      const obj = this.map.gameObjects[this.event.faceEmployee];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["employee"].direction)
    }
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init(document.querySelector('.canvas'))
  }
  checkTrash(resolve) {
    // Assuming your map object has a property "hasTrash" that is true when trash is present.
    if (!this.map.hasTrash) {  
      // Trash has been picked up — no message needed.
      console.log("Trash has been picked up; proceeding.");
      resolve();
    } else {
      // Trash is still present, so inform the player.
      const message = new TextMessage({
        text: "You need to pick up the trash first!",
        onComplete: () => resolve()
      });
      message.init(document.querySelector('.canvas'));
    }
  }

  takeOutTrash(resolve) {
    // Here you would normally execute the action to take out the trash
    if (this.map.hasTrash) {
      console.log("Taking out the trash!");
      // For example, change the state so trash is no longer present:
      this.map.hasTrash = false;
      resolve();
    } else {
      // If the trash isn't available, immediately resolve.
      resolve();
    }
  }

  init(){
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}