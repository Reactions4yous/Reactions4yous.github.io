class Sprite {
  constructor(config){
    
    //create our image
    this.image = new Image()
    this.image.src = config.src
    this.image.onload = ()=>{
      this.imageLoaded = true
    }
    //Shadow
    this.shadow = new Image()
    this.useShadow = config.useShadow
    if (this.useShadow){
     this.shadow.src = '/images/shadow.png'
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true
    }
    
    //refrence our Game Object
    this.gameObject = config.gameObject

    this.animations = config.animations || {
      "idle-down": [   [0,2] ],
      "idle-right": [   [0,1] ],
      "idle-up": [   [0,3] ],
      "idle-left": [   [0,0] ],
      "walk-down": [ [0,2], [1,2], [2,2], [3,2]],
      "walk-up": [ [0,3], [1,3], [2,3], [3,3]],
      "walk-left": [ [0,0], [1,0], [2,0], [3,0]],
      "walk-right": [ [0,1], [1,1], [2,1], [3,1]],
    }
    this.currentAnimation = config.currentAnimation || "idle-down"
    this.currentAnimationFrame = 0

    this.animationFrameLimit = config.animationFrameLimit || 16
    this.animationFrameProgress = this.animationFrameLimit;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key){
    if(this.currentAnimation !== key){
      this.currentAnimation = key
      this.currentAnimationFrame = 0
      this.animationFrameProgress = this.animationFrameLimit
    }
  }
  updateAnimationProgress(){
    //downtixk frame progress
    if(this.animationFrameProgress > 0){
      this.animationFrameProgress -= 1
      return;
    }

    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1

    if(this.frame === undefined){
      this.currentAnimationFrame = 0
    }
  }
  
  draw(ctx){
    const cS = {
      hasAnimation : this.gameObject.hasAnimation,
      sizeH : this.gameObject.sizeH,
      sizeW : this.gameObject.sizeW,
      cropY : this.gameObject.cropY,
      cropX : this.gameObject.cropX,
      cropYW : this.gameObject.cropYW,
      cropXW : this.gameObject.cropXW,
      x : this.gameObject.x,
      y : this.gameObject.y,
    }
    this.isShadowLoaded && ctx.drawImage(this.shadow, 0,0,32,32,cS.x -16, cS.y -8, 64,64)
    const [frameX, frameY] = this.frame
    if(cS.hasAnimation){this.imageLoaded && ctx.drawImage(this.image, cS.cropX * frameX,cS.cropY * frameY,cS.cropXW,cS.cropYW,cS.x -8,cS.y,cS.sizeW,cS.sizeH)}
    else {this.imageLoaded && ctx.drawImage(this.image, cS.cropX ,cS.cropY,cS.cropXW,cS.cropYW,cS.x,cS.y,cS.sizeW,cS.sizeH)}
    this.updateAnimationProgress()
  }
}