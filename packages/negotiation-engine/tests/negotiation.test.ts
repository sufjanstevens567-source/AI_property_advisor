import { expect, test } from 'vitest';
import { calculateNegotiationStrategy, NegotiationInputs } from '../src/index';

test('calculates rounded negotiation prices for a clean property', () => {
  const inputs: NegotiationInputs = {
    askingPrice: 400000,
    daysOnMarket: 30,
    dataQualityScore: 9,
    verdict: "Buy",
    priceForTargetReturns: 390000,
    priceForBreakEven: 400000,
    combinedStressCashFlow: 150,
  };

  const results = calculateNegotiationStrategy(inputs);

  expect(results.targetPrice).toBe(390000);
  expect(results.openingPrice).toBe(380000);
  expect(results.stretchPrice).toBe(400000);
  expect(results.walkAwayPrice).toBe(400000);
  expect(results.acceptanceProbability).toBe("High");
  expect(results.priceSensitivity).toHaveLength(5);
  expect(results.agentScript).toContain("EUR 380,000");
});

test('prices unresolved risks and stale listing into the target', () => {
  const inputs: NegotiationInputs = {
    askingPrice: 400000,
    daysOnMarket: 95,
    dataQualityScore: 6.5,
    verdict: "Conditional Buy",
    priceForTargetReturns: 395000,
    priceForBreakEven: 410000,
    combinedStressCashFlow: -50,
    unresolvedRisks: ["OMC", "RTB", "Service charge"],
  };

  const results = calculateNegotiationStrategy(inputs);

  expect(results.targetPrice).toBe(352000);
  expect(results.openingPrice).toBe(343000);
  expect(results.acceptanceProbability).toBe("Medium");
  expect(results.ddFindingsThatDecreaseOffer.length).toBeGreaterThan(2);
});

test('handles avoid verdict', () => {
  const inputs: NegotiationInputs = {
    askingPrice: 400000,
    daysOnMarket: 30,
    dataQualityScore: 9,
    verdict: "Avoid",
    priceForTargetReturns: 390000,
    priceForBreakEven: 430000,
    combinedStressCashFlow: 200,
  };

  const results = calculateNegotiationStrategy(inputs);

  expect(results.targetPrice).toBe(0);
  expect(results.openingPrice).toBe(0);
  expect(results.walkAwayPrice).toBe(0);
  expect(results.acceptanceProbability).toBe("n/a");
});
