import { expect, test } from 'vitest';
import { calculateNegotiationStrategy, NegotiationInputs } from '../src/index';

test('calculates correct negotiation prices for a clean property', () => {
  const inputs: NegotiationInputs = {
    askingPrice: 400000,
    daysOnMarket: 30,
    dataQualityScore: 9,
    verdict: "Buy",
    priceForTargetReturns: 390000,
    priceForBreakEven: 430000
  };

  const results = calculateNegotiationStrategy(inputs);
  
  // target price should be 390000 (since it's < asking and DOM < 60)
  expect(results.targetPrice).toBe(390000);

  // opening price should be 390000 * 0.95 = 370500, rounded to 5000 -> 370000
  expect(results.openingPrice).toBe(370000);

  // walk away is min(breakEven, 1.05 * asking) -> min(430000, 420000) = 420000
  expect(results.walkAwayPrice).toBe(420000);

  expect(results.discountToAsking).toBe(10000 / 400000);
  expect(results.agentScript).toContain("completed our underwriting");
});

test('applies stale listing penalty', () => {
  const inputs: NegotiationInputs = {
    askingPrice: 400000,
    daysOnMarket: 90, // > 60
    dataQualityScore: 9,
    verdict: "Buy",
    priceForTargetReturns: 390000,
    priceForBreakEven: 430000
  };

  const results = calculateNegotiationStrategy(inputs);
  
  // target price should be 390000 * 0.97 = 378300 -> round to 5000 -> 380000
  expect(results.targetPrice).toBe(380000);
});

test('handles low data quality score', () => {
  const inputs: NegotiationInputs = {
    askingPrice: 400000,
    daysOnMarket: 30,
    dataQualityScore: 6, // < 7
    verdict: "Marginal",
    priceForTargetReturns: 390000,
    priceForBreakEven: 430000
  };

  const results = calculateNegotiationStrategy(inputs);
  
  expect(results.agentScript).toContain("prevent us from making a firm unconditional offer");
});

test('handles avoid verdict', () => {
  const inputs: NegotiationInputs = {
    askingPrice: 400000,
    daysOnMarket: 30,
    dataQualityScore: 9,
    verdict: "Avoid",
    priceForTargetReturns: 390000,
    priceForBreakEven: 430000
  };

  const results = calculateNegotiationStrategy(inputs);
  
  expect(results.targetPrice).toBe(0);
  expect(results.openingPrice).toBe(0);
  expect(results.walkAwayPrice).toBe(0);
});
