// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  const initial = 100;

  test('should create account with initial balance', () => {
    const bank = getBankAccount(initial);

    expect(bank.getBalance()).toBe(initial);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bank = getBankAccount(initial);

    expect(() => {
      bank.withdraw(initial * 2);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const bankSource = getBankAccount(initial);
    const bankDest = getBankAccount(initial);

    expect(() => {
      bankSource.transfer(initial * 2, bankDest);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const bank = getBankAccount(initial);

    expect(() => {
      bank.transfer(initial * 2, bank);
    }).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const deposit = 20;
    const bank = getBankAccount(initial);

    expect(bank.deposit(deposit).getBalance()).toBe(initial + deposit);
  });

  test('should withdraw money', () => {
    const withdraw = 20;
    const bank = getBankAccount(initial);

    expect(bank.withdraw(withdraw).getBalance()).toBe(initial - withdraw);
  });

  test('should transfer money', () => {
    const transfer = 20;
    const bankSource = getBankAccount(initial);
    const bankDest = getBankAccount(initial);

    bankSource.transfer(transfer, bankDest);

    expect(bankSource.getBalance()).toBe(initial - transfer);
    expect(bankDest.getBalance()).toBe(initial + transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bank = getBankAccount(initial);

    const result = await bank.fetchBalance();

    if (result === null) {
      expect(result).toBeNull();
    } else {
      expect(result).toEqual(expect.any(Number));
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bank = getBankAccount(initial);
    expect(bank.getBalance()).toBe(initial);

    bank.synchronizeBalance().then(() => {
      const balance = bank.getBalance();

      expect(balance).not.toBe(initial);
      expect(balance).toEqual(expect.any(Number));
    });
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bank = getBankAccount(initial);
    expect(bank.getBalance()).toBe(initial);

    bank.synchronizeBalance().catch((e) => {
      expect(e).toBeInstanceOf(SynchronizationFailedError);
      expect(bank.getBalance()).toBe(initial);
    });
  });
});
