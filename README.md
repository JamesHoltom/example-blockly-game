# Gatekeeper Game

_This is a prototype, stripped down to the core features needed to display the game._

## Game Rules

The player must create a function, consisting of blocks, that will accept/reject a list of randomised values according to the criteria specified in the introductory prompt.

The game is split into 2 phases, which are:

- __Design__: Using _Blockly_, design a function that meets the requirements.
- __Play__: An animated sequence, with boxes containing randomised values being processed by the solution.

In the testing sequence, the results of each item are predetermined before the animated sequence plays. With this, the player can opt to skip the animation and head straight to the results.

After the sequence finishes, or if the player skips it, a results screen will open, showing the player how well their function handled the test items.

## Building

Node.js and NPM are required to run the project, which uses _webpack-dev-server_ to run locally.

Clone the project with `git clone https://github.com/JamesHoltom/example-blockly-game.git` and run `npm start` to build and serve the project at localhost:9000.
