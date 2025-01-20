const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024 // 1024
canvas.height = 64 * 9 // 576

const key = {
   w: {
     pressed: false,
   },
   a: {
     pressed: false,
   },
   d: {
     pressed: false,
   }
 }
let parsedCollisions
let collisionBlocks
let background
let doors

const gameKey = new Sprite({
   position: {
     x: 400,
     y: 300,
   },
   imageSrc: './img/key.png',
   frameRate: 1,
   frameBuffer: 1,
 })

const player = new Player({
   imageSrc: './img/king/idle.png',
   frameRate: 11,
   animations: {
     idleRight: {
       frameRate: 11,
       frameBuffer: 6,  // Changed from 2 to 6 (slower)
       loop: true,
       imageSrc: './img/king/idle.png',
     },
     idleLeft: {
       frameRate: 11,
       frameBuffer: 8,  // Changed from 2 to 6 (slower)
       loop: true,
       imageSrc: './img/king/idleLeft.png',
     },
     runRight: {
       frameRate: 8,
       frameBuffer: 8,  // Changed from 4 to 8 (slower)
       loop: true,
       imageSrc: './img/king/runRight.png',
     },
     runLeft: {
       frameRate: 8,
       frameBuffer: 8,  // Changed from 4 to 8 (slower)
       loop: true,
       imageSrc: './img/king/runLeft.png',
     },
     enterDoor: {
       frameRate: 8,
       frameBuffer: 8,  // Changed from 4 to 8 (slower)
       loop: false,
       imageSrc: './img/king/enterDoor.png',
      onComplete: () => {
        console.log('completed animation')
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++

            if (level === 4) level = 1
            levels[level].init()
            player.switchSprite('idleRight')
            player.preventInput = false
            gsap.to(overlay, {
              opacity: 0,
            })
          },
        })
      },
    },
  },
})

let level = 3
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks
      if (player.currentAnimation) player.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel1.png',
      })

      doors = [
        new Sprite({
          position: {
            x: 767,
            y: 270,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
  2: {
    init: () => {
         parsedCollisions = collisionsLevel2.parse2D()
         collisionBlocks = parsedCollisions.createObjectsFrom2D()
         player.collisionBlocks = collisionBlocks
         player.position.x = 96
         player.position.y = 140
         player.hasKey = false // Reset key status
   
         if (player.currentAnimation) player.currentAnimation.isActive = false
   
         background = new Sprite({
           position: {
             x: 0,
             y: 0,
           },
           imageSrc: './img/backgroundLevel2.png',
         })
   
         // Add key to level 2
         gameKey.position = {
           x: 400,
           y: 300,
         }
   
         doors = [
           new Sprite({
             position: {
               x: 772.0,
               y: 336,
             },
             imageSrc: './img/doorOpen.png',
             frameRate: 5,
             frameBuffer: 5,
             loop: false,
             autoplay: false,
           }),
         ]
       },
  },
  3: {
    init: () => {
      parsedCollisions = collisionsLevel3.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks
      player.position.x = 750
      player.position.y = 230
      if (player.currentAnimation) player.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel3.png',
      })

      doors = [
        new Sprite({
          position: {
            x: 176.0,
            y: 335,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
}

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const overlay = {
  opacity: 0,
}

function animate() {
   window.requestAnimationFrame(animate)
 
   background.draw()
 
   doors.forEach((door) => {
     door.draw()
   })
 
   // Draw key in level 2 if not collected
   if (level === 2 && !player.hasKey) {
     gameKey.draw()
     
     // Check for key collection
     if (
       player.hitbox.position.x + player.hitbox.width >= gameKey.position.x &&
       player.hitbox.position.x <= gameKey.position.x + gameKey.width &&
       player.hitbox.position.y + player.hitbox.height >= gameKey.position.y &&
       player.hitbox.position.y <= gameKey.position.y + gameKey.height
     ) {
       player.hasKey = true
       console.log('Key collected!')
     }
   }
 
   player.handleInput(key)
   player.draw()
   player.update()
 
   c.save()
   c.globalAlpha = overlay.opacity
   c.fillStyle = 'black'
   c.fillRect(0, 0, canvas.width, canvas.height)
   c.restore()
 }

levels[level].init()
animate()
