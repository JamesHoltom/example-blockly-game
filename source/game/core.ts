/**
 * @file This file contains code to run the user interface.
 * @author James Holtom
 */

import { Modal } from "bootstrap";
import { Start, Stop } from "./phaser";
import { GetCode } from "./blockly";
import { TestResults, Run } from "./tester";

/**
 * Denotes what phase of gameplay the player is in. This is either:
 *  - "__design__": The player is creating a function.
 *  - "__play__": The player has created a function, and is testing it.
 */
let phase: "design" | "play" = "design";

/**
 * The current set of test results, if the game is in the "play" phase.
 */
let results: TestResults = null;

const $modal: Modal = new Modal("#modal_pane");
const $modalPrompt = document.getElementById("prompt_content");
const $modalResults = document.getElementById("results_content");
const $resultsTitle = document.getElementById("results_title");
const $resultsConfirmBtn = document.getElementById("results_confirm");
const $designPhaseControls = document.getElementById("design_phase");
const $playPhaseControls = document.getElementById("play_phase");

/**
 * Sets the current phase to "design".
 */
export function GoToDesignPhase(): void
{
  phase = "design";

  // Reset the current test results.
  results = null;

  // Stop the game scene.
  Stop();

  // Reveal the "design" phase-only controls.
  $designPhaseControls.classList.remove("hidden");
  $playPhaseControls.classList.add("hidden");
}

/**
 * Sets the current phase to "play".
 */
function GoToPlayPhase(): void
{
  phase = "play";

  // Generate the code for the player's function, run it, and get the test results.
  results = Run(GetCode());

  // Start the game scene.
  Start(results);

  // Reveal the "play" phase-only controls.
  $designPhaseControls.classList.add("hidden");
  $playPhaseControls.classList.remove("hidden");
}

/**
 * Opens the modal for the introductory prompt.
 */
function ShowPrompt(): void
{
  $modalPrompt.classList.remove("hidden");
  $modalResults.classList.add("hidden");
  $modal.show();
}

/**
 * Opens the modal for reviewing the test results.
 */
export function ShowResults(): void
{
  $modalPrompt.classList.add("hidden");
  $modalResults.classList.remove("hidden");

  // If any tests have failed, display the losing scenario...
  if (results.numFailed > 0)
  {
    $resultsTitle.textContent = "Try again!";
    $resultsConfirmBtn.classList.remove("btn-primary");
    $resultsConfirmBtn.classList.add("btn-danger");
    $resultsConfirmBtn.textContent = "Retry";
  }
  /// ... otherwise, display the winning scenario.
  else
  {
    $resultsTitle.textContent = "Congratulations!";
    $resultsConfirmBtn.classList.add("btn-primary");
    $resultsConfirmBtn.classList.remove("btn-danger");
    $resultsConfirmBtn.textContent = "Continue";
  }

  document.getElementById("results_passed").textContent = results.numPassed.toString();
  document.getElementById("results_failed").textContent = results.numFailed.toString();

  $modal.show();

  // Return the player to the "design" phase.
  GoToDesignPhase();
}

/**
 * When the player presses 'Start', enter the "play" phase.
 */
document.getElementById("start_test").addEventListener("click", () => {
  GoToPlayPhase();
});

/**
 * When the player presses 'Skip', stop the game scene and show the test results.
 */
document.getElementById("skip_test").addEventListener("click", () => {
  Stop();
  ShowResults();
});

/**
 * When the player presses 'Cancel', return to the "design" phase.
 */
document.getElementById("cancel_test").addEventListener("click", () => {
  GoToDesignPhase();
});

// Display the introductory prompt when the page loads.
ShowPrompt();
