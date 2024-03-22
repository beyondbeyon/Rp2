// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.clicked = false
        this.moveSpeed = 2;         // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    create(){
        input.on("pointerdown", this.fire, this);

        this.input.on("pointermove", (pointer, gameObjects) =>{
            this.x += pointer.deltaX;
            console.log(pointer)

            // Force the sprite to stay on screen
            this.x = Phaser.Math.Wrap(this.sprite.x, 0, game.renderer.width);
            this.y = Phaser.Math.Wrap(this.sprite.y, 0, game.renderer.height)
        }, this);
    }

    update() {
        // left/right movement
        if(!this.isFiring &&(this.x >= borderUISize + this.width || this.x <= game.config.width - borderUISize - this.width)) {
            //this.input.on('pointermove', function (pointer){
                //this.sprite.x += pointer.movementX;

                // Force the sprite to stay on screen
                //this.sprite.x = Phaser.Math.Wrap(this.sprite.x, 0, game.renderer.width);
                //this.sprite.y = Phaser.Math.Wrap(this.sprite.y, 0, game.renderer.height)
            //}, this);

        }
        // fire button
        if(this.clicked && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }
        // if fired, move up
        if(this.isFiring) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.clicked = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }

    fire(){
        //this.sfxRocket = scene.sound.add('sfx_rocket');
        //this.isFiring = true;
        this.clicked = true;
        //this.sfxRocket.play();
    }

    move(){
        this.sprite.x += pointer.movementX;

            // Force the sprite to stay on screen
            this.sprite.x = Phaser.Math.Wrap(this.sprite.x, 0, game.renderer.width);
            this.sprite.y = Phaser.Math.Wrap(this.sprite.y, 0, game.renderer.height)
    }
}