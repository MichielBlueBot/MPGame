/**
 * Created by Michiel on 1/06/2017.
 */
const PIXI = require('../../../pixi.js');

class OrbActor {

    constructor(renderer, team) {
        this.gameEngine = renderer.gameEngine;
        this.sprite = new PIXI.Container();
        this.orbContainerSprite = new PIXI.Container();

        if(team == Constants.TEAM_RED) {
            this.orbSprite = new PIXI.Sprite(PIXI.loader.resources.orb_red.texture);
        } else {
            this.orbSprite = new PIXI.Sprite(PIXI.loader.resources.orb_red.texture);
        }

        // keep a reference to the actor from the sprite
        this.sprite.actor = this;


        this.orbSprite.anchor.set(0.5, 0.5);
        this.orbSprite.width = 50;
        this.orbSprite.height = 50;


        this.orbSprite.addChild(this.orbContainerSprite);
        this.orbContainerSprite.addChild(this.orbSprite);
    }

    renderStep(delta) {
        // Render effects
    }

    destroy() {
        return new Promise((resolve) =>{
            this.orbSprite.destroy();
            setTimeout(()=>{
                this.orbContainerSprite.destroy();
                resolve();
            }, 500);
        });
    }
}


module.exports = ShipActor;
