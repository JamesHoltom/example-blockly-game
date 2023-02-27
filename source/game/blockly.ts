/**
 * @file This file contains all code relating to Blockly.
 * @author James Holtom
 * @see [Blockly](https://developers.google.com/blockly)
 */

import { inject, defineBlocksWithJsonArray, Block } from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import * as toolbox from "../config/toolbox.json";

/**
 * Refers to the <div> containing the workspace.
 */
const $container = document.getElementById("blocks_workspace");

// Define the custom blocks for the game.
defineBlocksWithJsonArray([
  {
    'type': 'custom_incoming_number',
    'message0': 'Incoming value',
    'output': "Number",
    'colour': '%{BKY_VARIABLES_DYNAMIC_HUE}',
    'tooltip': 'The incoming value to test.'
  },
  {
    'type': 'custom_approve',
    'message0': 'Pass',
    'colour': '#00FF00',
    'tooltip': 'Approves the incoming value.',
    'previousStatement': null
  },
  {
    'type': 'custom_reject',
    'message0': 'Fail',
    'colour': '#FF0000',
    'tooltip': 'Rejects the incoming value.',
    'previousStatement': null
  }
]);

/**
 * This block generates code to get the input variable
 * @see tester.ts:85 
 */
javascriptGenerator["custom_incoming_number"] = () => ["input", javascriptGenerator.ORDER_ASSIGNMENT];

/**
 * This block generates code to set the return value to `true`.
 * @see tester.ts:86
 */
javascriptGenerator["custom_approve"] = () => "retVal = true;";

/**
 * This block generates code to set the return value to `false`.
 * @see tester.ts:86
 */
javascriptGenerator["custom_reject"] = () => "retVal = false;";

/**
 * Creates the workspace and toolbox.
 */
const workspace = inject($container, {
  toolbox: toolbox
});

/**
 * Generates the JavaScript code based on the contents of the workspace.
 * 
 * @returns {string} The generated code.
 */
export function GetCode() : string
{
  return javascriptGenerator.workspaceToCode(workspace);
}
