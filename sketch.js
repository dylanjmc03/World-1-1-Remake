kaboom({
  scale: 3,
  background: [144,144,248],
})
loadSpriteAtlas("https://kaboomjs.com/sprites/dungeon.png", "atlas.json");

loadSprite("lava", "lava jpeg.jfif")
loadSprite("laser", "laser.png")
loadSound("theme", "Mario Music Full.mp3")
const levelConfig = {
  width: 16,
  height: 16,
  pos: vec2(32,32),
  "w": () => [
    "wall",
    sprite("wall"),
    area(),
    solid()
  ],
   "o": () => [
    "enemy",
    sprite("ogre",{
      "anim": "run"
    }),
    area({"scale": 0.6}),
    //solid(),
     origin("center"),
     {
       "xVel": 40
     }
  ],
  "D": () => [
    "door",
    sprite("closed_door"),
    area({"scale": 0.5}),
    solid(),
    origin("left")
  ],
   "c": () => [
    "chest",
    sprite("chest"),
    area({"scale": 0.5}),
    solid(),
    origin("top")
  ],
  "b": () => [
    "barrier",
    sprite("wall"),
    area(),
    opacity(0.0)
  ],
  
  "L": () => [
    "lava",
    sprite("lava",{
      width: 50,
      height: 50,
    }),
    area(),
    opacity(0.8)
  ],
}

const levels = [
  [
    "                        w                                                       wwwwwwww   wwwww              w           www        wwww",
    "",
    "",
    "                  w   wwwww                                                  www               w     ww    w  w  w     w              ww",
    "          ",
    "                                                                                                                                                wwww  ",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww   wwwwwwwwwwwwwww   wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww   wwwwwwwwwwwwwww   wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww   wwwwwwwwwwwwwww   wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    
  ],
  [
    "          www     ",
    "   b  o bc        ",
    "ww wwwwwww    wwD",
    "                  ",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
    "LLLLLLLLLLLLLLLLLL",
  ]
]
let levelNum = 0
scene("game",() => {
  
  //levelNum = localStorage.getItem("level")
  
  let hp = 3
  let key = false
  
  const music = play("theme", {
    volume: 0.8,
    loop: true
})
  const level = addLevel(levels[levelNum],levelConfig)
  
 const hpLabel = add([
    text("hp: "+hp,{
      "size":16
    }),
    pos(16, 16),
    fixed()
  ])

  const player = add([
      sprite("hero"),
      pos(163, 80),
      area({scale:0.5}),
      //solid(),
      origin("bot"),
      body(),
    {
      "speed":100,
      "jumpSpeed": 400,
      "health": 10
    }
  ]);
  player.play("idle")
  
  
  onUpdate("enemy",(e) => {
    e.move(e.xVel,0)
  })
  
  onCollide("enemy","barrier",(e,b) => {
    e.xVel = -e.xVel
    if (e.xVel < 0) {e.flipX(true)}
    else {
      e.flipX(false)
    }
  })
  
  onCollide("enemy","laser",(e,l) => {
   destroy(e)
   destroy(l)
    }
  )
    
     
  
  //speed defined on line 33?

  
  onKeyDown("right", () => {
    player.move(player.speed,0)
    player.flipX(false)
  })
  
  
  onKeyDown("left", () => {
    player.move(-player.speed,0)
    player.flipX(true)
  })
  onKeyPress(["right", "left"], () => {
    player.play("run")
  })
  onKeyRelease(["right", "left"], () => {
    player.play("idle")
  })
  
  onKeyPress("up", () => {
  if (player.isGrounded()) {
    player.jump(player.jumpSpeed)
    player.play("hit")
  } })
  
  onKeyPress("space", () => {
    add([
      "laser",
      sprite("laser",{
      width: 10,
      height: 5,
    }),
      color(255,0,0),
      area(),
      pos(player.pos.x,player.pos.y-15),
      move(RIGHT, 150),
      cleanup()
    ])
  })
  
  player.onClick(() => {
    add([
      "laser",
      sprite("laser",{
      width: 10,
      height: 5,
    }),
      color(255,0,0),
      area(),
      pos(player.pos.x,player.pos.y-15),
      move(RIGHT, 150),
      cleanup()
    ])
  })
  
  player.onCollide("wall", () => {
    player.play("idle")
  })
  
  player.onCollide("enemy", () => {
 addKaboom(player.pos)
  
    hp -= 1
    hpLabel.text = "hp: "+hp
      //localStorage.setItem("health", hp)
    if (hp == 0) {
      destroy(player)
     wait(1,() => {
    go("lose")
      }) 
    }
  })
  
  player.onCollide("lava", () => {
    
     wait(1,() => {
    destroy(player)
    go("lose")
  })
  })
  
  //hp = onUpdate(localStorage.getItem("health", hp))
  
  player.onCollide("door",() => {
     if (key) {
       if (levelNum == levels.length - 1) {
        go("win")
      }
    else {
      levelNum++
      localStorage.setItem("level",levelNum)
      
  
      go("game")
    }
     }
    
    
    })
  player.onCollide("chest", (c) => {
    key = true
    c.play("open")
  })
  
  onUpdate(() => {
  camPos(player.pos.x,60)
})
    
  
}) //end of game

scene("menu", () => {
  add([
    text("Super Mario Bros."),
    pos(width()/2,height()/2),
    origin("center"),
    scale(28/100)
  ])
  
  add([
    text("Press Enter"),
    "playButton",
    pos(width()/2,height()/2+50),
    area(),
    origin("center"),
    scale(1/6),
    color("black")
  ])
  add([
    text("Continue?"),
    "continue",
    pos(width()/2,height()/2+130),
    area(),
    origin("center"),
    scale(1/3)
  ])
  onKeyPress("enter", () => {
    go("game")
  })
  
  //continue function
  
  onClick("continue",() => {
    levelNum = localStorage.getItem("level") || 0
    go("game")
  })

})

scene("win", () => {
  add([
    text("You Win!"),
    pos(width()/2,height()/2),
    origin("center"),
    scale(1/3)
  ])
  
  add([
    text("Play Again"),
    "playButton",
    pos(width()/2,height()/2+50),
    area(),
    origin("center"),
    scale(1/3)
  ])
  onClick("playButton",() => {
    levelNum = 0
    go("game")
  })

})

scene("lose", () => {
  add([
    text("You Lose!"),
    pos(width()/2,height()/2),
    origin("center"),
    scale(1/3)
  ])
  
  add([
    text("Retry?"),
    "playButton",
    pos(width()/2,height()/2+50),
    area(),
    origin("center"),
    scale(1/3)
  ])
  onClick("playButton",() => {
    levelNum = 0
    go("game")
  })

})

go("menu")
