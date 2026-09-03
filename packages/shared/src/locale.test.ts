import { describe, expect, test } from 'bun:test';
import { AMOUNT_PLACEHOLDER, CURRENCY, DISPLAY_LOCALE } from './locale.ts';

describe('locale constants', () => {
  test('uses en-US display locale and USD currency', () => {
    expect(DISPLAY_LOCALE).toBe('en-US');
    expect(CURRENCY).toBe('USD');
  });

  test('uses a decimal amount placeholder', () => {
    expect(AMOUNT_PLACEHOLDER).toBe('0.00');
  });
});
