'use strict';

const PIXI = require('../../pixi.js');
const Renderer = require('lance-gg').render.Renderer;

const Orb = require('../common/Orb')
const OrbActor = require('../client/actors/OrbActor')

class MyRenderer extends Renderer {

    get ASSETPATHS() {
        return {
            orb_red: 'assets/objects/orb_red.png',
            orb_blue: 'assets/objects/orb_blue.png',
        };
    }

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        this.isReady = false;

        this.assetPathPrefix = this.gameEngine.options.assetPathPrefix?this.gameEngine.options.assetPathPrefix:'';

        // these define how many gameWorlds the player ship has "scrolled" through
        this.bgPhaseX = 0;
        this.bgPhaseY = 0;
    }

    init() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        this.elapsedTime = Date.now();

        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            this.onDOMLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', ()=>{
                this.onDOMLoaded();
            });
        }

        // Load asset resources
        return new Promise((resolve, reject)=>{
            PIXI.loader.add(Object.keys(this.ASSETPATHS).map((x)=>{
                return{
                    name: x,
                    url: this.assetPathPrefix + this.ASSETPATHS[x]
                };
            }))
                .load(() => {
                    this.isReady = true;
                    this.gameEngine.emit('renderer.ready');

                    if (isMacintosh()) {
                        document.body.classList.add('mac');
                    } else if (isWindows()) {
                        document.body.classList.add('pc');
                    } else {
                        document.body.classList.add('unkown-device-type');
                    }
                    resolve();
                });
        });
    }

    onDOMLoaded() {
        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
    }

    draw() {
        super.draw();

        let now = Date.now();

        if (!this.isReady) return; // assets might not have been loaded yet

        for (let objId of Object.keys(this.sprites)) {
            let objData = this.gameEngine.world.objects[objId];
            let sprite = this.sprites[objId];

            if (objData) {
                sprite.x = objData.position.x;
                sprite.y = objData.position.y;
            }

            if (sprite) {
                // object is either a Pixi sprite or an Actor. Actors have renderSteps
                if (sprite.actor && sprite.actor.renderStep) {
                    sprite.actor.renderStep(now - this.elapsedTime);
                }
            }
        }
        this.elapsedTime = now;
    }

    addObject(objData, options) {
        let sprite;

        if (objData.class == Orb) {
            let orb = objData
            // Create an actor for the orb, this allows for additional effects on the orb's sprite
            let orbActor = new OrbActor(this, orb.team);
            sprite = orbActor.sprite;
            // Add the sprite to the sprites list
            this.sprites[orb.id] = sprite;
            sprite.id = orb.id;

            if (this.clientEngine.isOwnedByPlayer(orb) && !this.gameStarted) {
                document.body.classList.remove('lostGame');
                document.body.classList.remove('lostGame');
                document.body.classList.add('gameActive');
                document.querySelector('#tryAgain').disabled = true;
                document.querySelector('#joinGame').disabled = true;
                document.querySelector('#joinGame').style.opacity = 0;

                this.gameStarted = true; // todo state shouldn't be saved in the renderer
            }
        }

        sprite.position.set(objData.position.x, objData.position.y);
        Object.assign(sprite, options);
        return sprite;
    }

    removeObject(obj) {
        let sprite = this.sprites[obj.id];
        if (sprite.actor) {
            // removal "takes time"
            sprite.actor.destroy().then(()=>{
                console.log('deleted sprite');
                delete this.sprites[obj.id];
            });
        } else{
            this.sprites[obj.id].destroy();
            delete this.sprites[obj.id];
        }
    }

    updateHUD(data) {
        if (data.RTT){ qs('.latencyData').innerHTML = data.RTT;}
        if (data.RTTAverage){ qs('.averageLatencyData').innerHTML = truncateDecimals(data.RTTAverage, 2);}
    }

    updateScore(data){
        let scoreContainer = qs('.score');
        let scoreArray = [];

        // remove score lines with objects that don't exist anymore
        let scoreEls = scoreContainer.querySelectorAll('.line');
        for (let x=0; x < scoreEls.length; x++) {
            if (data[scoreEls[x].dataset.objId] == null) {
                scoreEls[x].parentNode.removeChild(scoreEls[x]);
            }
        }

        for (let id of Object.keys(data)) {
            let scoreEl = scoreContainer.querySelector(`[data-obj-id='${id}']`);
            // create score line if it doesn't exist
            if (scoreEl == null) {
                scoreEl = document.createElement('div');
                scoreEl.classList.add('line');
                scoreEl.dataset.objId = id;
                scoreContainer.appendChild(scoreEl);
            }

            scoreEl.innerHTML = `${data[id].name}: ${data[id].score}`;

            scoreArray.push({
                el: scoreEl,
                data: data[id]
            });
        }

        scoreArray.sort((a, b) => {return a.data.score < b.data.score;});

        for (let x=0; x < scoreArray.length; x++) {
            scoreArray[x].el.style.transform = `translateY(${x}rem)`;
        }

    }
}

// convenience function
function qs(selector) { return document.querySelector(selector);}

function truncateDecimals(number, digits) {
    let multiplier = Math.pow(10, digits);
    let adjustedNum = number * multiplier;
    let truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
}

function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1;
}

function isWindows() {
    return navigator.platform.indexOf('Win') > -1;
}

module.exports = MyRenderer;
