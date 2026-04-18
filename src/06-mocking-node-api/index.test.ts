// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

jest.mock('node:path', () => {
  const originalModule =
    jest.requireActual<typeof import('node:path')>('node:path');

  return {
    ...originalModule,
    join: jest.fn(),
  };
});

jest.mock('node:fs', () => {
  const originalModule =
    jest.requireActual<typeof import('node:fs')>('node:fs');

  return {
    ...originalModule,
    existsSync: jest.fn(),
  };
});

jest.mock('node:fs/promises', () => {
  const originalModule =
    jest.requireActual<typeof import('node:fs/promises')>('node:fs/promises');

  return {
    ...originalModule,
    readFile: jest.fn(),
  };
});

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.unmock('node:path');
    jest.unmock('node:fs');
    jest.unmock('node:fs/promises');
  });

  test('should set timeout with provided callback and timeout', () => {
    const timeoutSpy = jest.spyOn(globalThis, 'setTimeout');
    const callback = jest.fn();
    const delay = 1000;

    doStuffByTimeout(callback, delay);

    expect(timeoutSpy).toHaveBeenCalledWith(callback, delay);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const delay = 1000;

    doStuffByTimeout(callback, delay);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(delay - 1);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const timeoutSpy = jest.spyOn(globalThis, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(timeoutSpy).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;
    const step = 3;

    doStuffByInterval(callback, interval);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval * 2);
    expect(callback).toHaveBeenCalledTimes(step);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const path = '/home';

    await readFileAsynchronously(path);

    expect(join).toHaveBeenCalledWith(expect.any(String), path);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const path = '/home';

    const file = await readFileAsynchronously(path);

    expect(file).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const path = '/home';
    const fileContent = 'some text';

    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockReturnValue(fileContent);

    const file = await readFileAsynchronously(path);

    expect(file).toBe(fileContent);
  });
});
