//Bryon Anderson
//rocket patrol 2: - more buddy more cop
//attempted mods: Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
//Implement an alternating two-player mode (5) note: alternate player mode
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play, Player, TwoPlay ]
  }
let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyA, keyD, keyW;