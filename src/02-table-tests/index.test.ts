// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 3, b: -2, action: Action.Add, expected: 1 },

  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 10, b: 2, action: Action.Subtract, expected: 8 },
  { a: 3, b: 10, action: Action.Subtract, expected: -7 },
  { a: 3, b: -2, action: Action.Subtract, expected: 5 },

  { a: 10, b: 5, action: Action.Divide, expected: 2 },
  { a: 10, b: 5, action: Action.Divide, expected: 2 },
  { a: 10, b: -5, action: Action.Divide, expected: -2 },
  { a: 5, b: 10, action: Action.Divide, expected: 0.5 },

  { a: 5, b: 10, action: Action.Multiply, expected: 50 },
  { a: 2, b: 5, action: Action.Multiply, expected: 10 },
  { a: -5, b: 10, action: Action.Multiply, expected: -50 },
  { a: -5, b: -10, action: Action.Multiply, expected: 50 },
  { a: 5, b: 0, action: Action.Multiply, expected: 0 },

  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: 25, b: 0.5, action: Action.Exponentiate, expected: 5 },
  { a: 25, b: 0, action: Action.Exponentiate, expected: 1 },

  { a: 25, b: 0, action: 'action', expected: null },
  { a: '25', b: 0, action: Action.Exponentiate, expected: null },
  { a: 25, b: '5', action: Action.Exponentiate, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return expected value',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
