/**
 * @file This file contains the code used to test the player's function.
 * @author James Holtom
 */

/**
 * @callback TypeFnTestFunc
 * @param {number} input  The value to test.
 * @returns {boolean} If the value meets the criteria of the function.
 */

/**
 * @typedef {TypeFnTestFunc} TestFunc
 */
type TestFunc = (input: number) => boolean;

/**
 * An item containing a random value and it's test results.
 * @property {number}   value       The value being tested.
 * @property {boolean}  willPass    Will this value pass, according to the player's function?
 * @property {boolean}  shouldPass  Should this value pass, according to the correct function?
 */
export class TestItem {
  /**
   * Constructs the test item.
   * @constructor
   * @param {TestFunc}  testFunc    The player's function.
   * @param {TestFunc}  correctFunc The correct function.
   */
  constructor(testFunc: TestFunc, correctFunc: TestFunc) {
    this.value = Math.round(Math.random() * 50);
    this.willPass = testFunc(this.value);
    this.shouldPass = correctFunc(this.value);
  }

  value: number
  willPass: boolean
  shouldPass: boolean
};

/**
 * Contains a list of items, and the full results.
 * @property {number}           numPassed The number of items that have passed.
 * @property {number}           numFailed The number of items that have failed.
 * @property {Array<TestItem>}  items     The list of items being tested.
 */
export class TestResults {
  /**
   * Constructs the list of results.
   * @constructor
   */
  constructor() {
    this.numPassed = 0;
    this.numFailed = 0;
    this.items = [];
  }

  numPassed: number
  numFailed: number
  items: Array<TestItem>
};

/**
 * The function to compare the results of the player's function against.
 * @param {number} input The input value to test.
 * @returns {boolean} If the value meets the criteria of the function.
 */
const correctFunction: TestFunc = (input: number) : boolean => input > 6 && input < 12;

/**
 * Generates test values, and runs the player's function against them.
 * @param {string} code The generated code to run.
 * @returns {TestResults} The results of the tests.
 */
export function Run(code: string) : TestResults
{
  let testResults: TestResults = new TestResults();

  try {
    /**
     * Runs the player's function against a value.
     * @param {number} input The value to test.
     * @returns {boolean} If the value meets the criteria of the function.
     */
    const TestingFunction: TestFunc = (input: number): boolean => {
      let retVal: boolean = true;

      eval(code);

      return retVal;
    }

    // Generate a list of items with random values to test.
    for (let i = 0; i < 10; ++i)
    {
      testResults.items.push(new TestItem(TestingFunction, correctFunction));
    }
  
    // Tally the number of tests that have passed (i.e. it _should_ pass, and _will_ pass), and vice versa.
    for (const item of testResults.items) {
      if (item.willPass === item.shouldPass) {
        testResults.numPassed++;
      } else {
        testResults.numFailed++;
      }
    }
  }
  catch (e) {
    console.error(e)
  }

  return testResults;
}