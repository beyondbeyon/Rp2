class TwoPlay extends Phaser.Scene {
    constructor() {
        super("twoplayScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('ship04', './assets/ship04.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p2)
        this.p2rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship2(this, game.config.width, borderUISize*3 , 'ship04', 0, 45).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        p2Score = 0;

        //initialize time
        this.timer = game.settings.gameTimer;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, p2Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(this.timer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            if(p1Score > p2Score){
                this.add.text(game.config.width/2, game.config.height/2 + 64, `Player 1 wins, Score:${p1Score}`, scoreConfig).setOrigin(0.5);
            }else if(p1Score < p2Score){
                this.add.text(game.config.width/2, game.config.height/2 + 64, `Player 2 wins, Score:${p2Score}`, scoreConfig).setOrigin(0.5);
            }
            //this.add.text(game.config.width/2, game.config.height/2 + 64, `Player 1 wins, Score:${p1Score}`, scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 120, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.input.on("pointermove", (pointer, gameObjects) =>{
            this.p2rocket.x = pointer.x;
            console.log('move')

            // Force the sprite to stay on screen
            this.p2rocket.x = Phaser.Math.Wrap(this.p2rocket.x, 0, game.config.width);
            this.p2rocket.y = Phaser.Math.Wrap(this.p2rocket.y, 0, game.config.height)
        }, this);

        this.input.on("pointerdown", (pointer, gameObjects) =>{
            this.p2rocket.fire()
        }, this)

        this.explode = this.add.particles(0, 0, 'bubbles', {
            frame: 'elec1',
            angle: { start: 0, end: 360, steps: 32 },
            lifespan: 1500,
            speed: 400,
            quantity: 32,
            scale: { start: 0.5, end: 0 },
            emitting: false
        });
    }

    update() {
        //p2Score = p2Score
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("playScene");
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p2rocket.update();             // update p2
             this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // check collisions
        if(this.checkCollision(this.p2rocket, this.ship03)) {
            this.p2rocket.reset();
            this.shipExplode(this.ship03);
            
        }
        if (this.checkCollision(this.p2rocket, this.ship02)) {
            this.p2rocket.reset();
            this.shipExplode(this.ship02);
            
        }
        if (this.checkCollision(this.p2rocket, this.ship01)) {
            this.p2rocket.reset();
            this.shipExplode(this.ship01);
            
        }
        if (this.checkCollision(this.p2rocket, this.ship04)) {
            this.p2rocket.reset();
            this.shipExplode(this.ship04);
            this.time += 150
        }
        else{
            this.time -= 100
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        p2Score += ship.points;
        this.scoreLeft.text = p2Score; 
        
        this.sound.play('sfx_explosion');
        this.explode.emitParticleAt(ship.x, ship.y);
    }
}
