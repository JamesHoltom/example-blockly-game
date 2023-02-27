/**
 * @file This file contains all code relating to Phaser.
 * @author James Holtom
 * @see [Phaser](https://phaser.io/)
 */

import { Game, AUTO, GameObjects, Scale, Scene } from "phaser";
import { ShowResults } from "./core";
import { TestResults } from "./tester";

/**
 * Represents what colour to render the gate.
 * @typedef {string} GateState
 */
type GateState = "default" | "pass" | "fail";

/**
 * Holds an incoming number.
 * @property {GameObjects.Text} textObj     The game object representing the number, that flys in from the left side of the screen.
 * @property {boolean}          gateValue   Denotes what colour to set the gate to, when this object moves through it.
 * @property {boolean}          reachedGate Has the game object reached the gate, and is now fading?
 */
interface INumberObject {
  textObj: GameObjects.Text
  gateValue: boolean
  reachedGate: boolean
};

/**
 * Extends the scene to create the game area.
 * @property {boolean}                running               Is the scene currently running (i.e. the game is in the 'Play' phase)?
 * @property {GameObjects.Rectangle}  gateObj               The game object representing the gate.
 * @property {Array<TestItemStruct>}  testItems             The list of incoming numbers to test.
 * @property {number}                 valuesFinishedMoving  The number of incoming numbers that have reached the gate and have disappeared.
 */
class GameScene extends Scene
{
  /**
   * Constructs the game object.
   * @constructor
   */
  constructor() {
    super("GameScene");

    this.running = false;
    this.gateObj = null;
    this.testItems = [];
    this.valuesFinishedMoving = 0;
  }

  running: boolean
  gateObj: GameObjects.Rectangle
  testItems: Array<INumberObject>
  valuesFinishedMoving: number

  /**
   * Creates the game objects.
   */
  create()
  {
    this.add.rectangle(480, 60, 40, 120, 0xCCCCCC);
    this.add.rectangle(480, 420, 40, 120, 0xCCCCCC);

    this.gateObj = this.add.rectangle(480, 240, 10, 240, 0x0000FF, 192);
  }

  /**
   * Updates the scene every tick.
   */
  update()
  {
    // Only update the incoming numbers if the scene is meant to be running.
    if (this.running)
    {
      this.testItems.forEach((item) => {
        // Only update an incoming number if it hasn't yet moved to the gate.
        if (item.textObj.active)
        {
          item.textObj.x += 2

          // Once the incoming number reaches the right of the screen, disable it...
          if (item.textObj.x >= 720)
          {
            item.textObj.setActive(false);
            this.valuesFinishedMoving++;
          }
          // ... otherwise, fade it and update the gate's colour, when it reaches the gate.
          else if (item.textObj.x >= 480)
          {
            if (!item.reachedGate)
            {
              this.SetGate(item.gateValue ? "pass" : "fail");
              setTimeout(() => { this.SetGate("default"); }, 300);
              item.reachedGate = true;
            }
            else
            {
              item.textObj.alpha-= 0.015;
            }
          }
        }
      })

      // Once all incoming numbers have reached the gate and have disappeared, stop the scene and show the results modal.
      if (this.valuesFinishedMoving === this.testItems.length)
      {
        Stop();
        ShowResults();
      }
    }
  }

  /**
   * Sets the colour of the gate, depending on the given state.
   * 
   * @param {GateState} state The new state of the gate.
   */
  SetGate(state: GateState): void
  {
    switch (state) {
      case "default":
        this.gateObj.fillColor = 0x0000FF;
        break;
      case "pass":
        this.gateObj.fillColor = 0x00FF00;
        break;
      case "fail":
        this.gateObj.fillColor = 0xFF0000;
        break;
    }
  }

  /**
   * Creates a game object for an incoming number.
   * 
   * @param {number}  position    The position of the game object in the list.
   * @param {number}  value       The number value to render.
   * @param {boolean} willPass    Given the player's function, will this number pass?
   * @param {boolean} shouldPass  Given the correct function, should this number pass?
   */
  CreateNumberObject(position: number, value: number, willPass: boolean, shouldPass: boolean): void
  {
    const text: GameObjects.Text = this.make.text({
      // Move the game object outside of the screen. The position sets how far away the object is placed.
      x: -40 - (100 * position),
      // Give the game object a random Y level for variety.
      y: 200 + (Math.random() * 80),
      // Set the origin of the game object to the center (Text objects have it at the top-left by default).
      origin: 0.5,
      text: value.toString(),
      padding: {
        x: 8,
        y: 8
      },
      style: {
        color: '#000',
        backgroundColor: shouldPass ? '#AFA' : '#FAA'
      }
    }, true);
    
    this.testItems.push({ textObj: text, gateValue: willPass, reachedGate: false });
  }
};

/**
 * The game scene to run.
 */
let gameScene: GameScene = new GameScene();

// Set up Phaser with our game scene.
new Game({
  type: AUTO,
  parent: document.getElementById("game_window"),
  backgroundColor: 0x333333,
  width: 960,
  height: 480,
  scale: {
    mode: Scale.FIT
  },
  scene: [ gameScene ]
});

/**
 * Starts the game scene.
 * 
 * @param {TestResults} results The results of running the player's function, as well as the items that were tested against.
 */
export function Start(results: TestResults): void
{
  let position: number = 0;

  for (const item of results.items)
  {
    gameScene.CreateNumberObject(position++, item.value, item.willPass, item.shouldPass);
  }

  gameScene.running = true;
}

/**
 * Stops the game scene, and resets it for the next time it starts.
 */
export function Stop(): void
{
  gameScene.running = false;

  for (const item of gameScene.testItems)
  {
    item.textObj.destroy(true);
  }

  gameScene.valuesFinishedMoving = 0;
  gameScene.testItems = [];
}
