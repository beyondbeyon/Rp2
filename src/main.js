//Bryon Anderson
//rocket patrol 2: - more buddy more cop
//attempted mods: Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5),
//Implement mouse control for player movement and left mouse click to fire (5)
//Implement an alternating two-player mode (5)
//Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (5)
//Particle emmitter from phaser examples:https://github.com/phaserjs/examples/blob/master/public/src/game%20objects/particle%20emitter/particle%20physics%20body%20overlap.js

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play, Player, TwoPlay ]
  }
let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let p1Score
let p2Score

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keySpace;