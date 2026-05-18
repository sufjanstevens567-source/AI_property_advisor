import { expect, test } from 'vitest';
import { calculateScores, ScoringInputs } from '../src/index';

test('calculates perfect property scores correctly', () => {
  const inputs: ScoringInputs = {
    dataStatus: {
      isSizeUnknown: false,
      isServiceChargeEstimated: false,
      isBerUnknown: false,
      isTenancyUnknown: false,
      isMicroLocationUncertain: false,
      isPreviousRentUnknown: false,
    },
    qualitativeInputs: {
      locationQuality: 10,
      safetyPerception: 10,
      recessionResilience: 10,
      tenantDemand: 10,
      rentAchievability: 10,
      legalRentConfidence: 10,
      buildingQuality: 10,
      omcRisk: 10,
      berRisk: 10,
      serviceChargeReasonableness: 10,
      maintenanceRisk: 10,
      layoutQuality: 10,
      parkingValue: 10,
      resaleLiquidity: 10,
      operationalHassle: 10,
    },
    combinedStressCashFlow: 500,
    severeStressCashFlow: 200,
    baseCashFlow: 800,
  };

  const scores = calculateScores(inputs);
  expect(scores.dataQualityScore).toBe(10);
  expect(scores.rawQualitativeScore).toBe(10);
  expect(scores.resilienceWeightedScore).toBe(10);
  expect(scores.overallRiskAdjustedScore).toBe(10);
  expect(scores.rankingConfidence).toBe('High');
  expect(scores.riskFlags).toHaveLength(0);
});

test('calculates penalized property correctly', () => {
  const inputs: ScoringInputs = {
    dataStatus: {
      isSizeUnknown: true, // -1.5
      isServiceChargeEstimated: true, // -1.0
      isBerUnknown: true, // -1.0
      isTenancyUnknown: false,
      isMicroLocationUncertain: false,
      isPreviousRentUnknown: false,
    },
    qualitativeInputs: {
      locationQuality: 6,
      safetyPerception: 5, // penalty trigger
      recessionResilience: 6,
      tenantDemand: 7,
      rentAchievability: 6,
      legalRentConfidence: 5, // penalty trigger
      buildingQuality: 6,
      omcRisk: 4, // penalty trigger
      berRisk: 4, // penalty trigger
      serviceChargeReasonableness: 5,
      maintenanceRisk: 6,
      layoutQuality: 5,
      parkingValue: 4,
      resaleLiquidity: 5,
      operationalHassle: 5,
    },
    combinedStressCashFlow: -50, // penalty trigger
    severeStressCashFlow: -200,
    baseCashFlow: 300,
  };

  const scores = calculateScores(inputs);
  // DQ Score = 10 - 1.5 - 1.0 - 1.0 = 6.5
  expect(scores.dataQualityScore).toBe(6.5);
  expect(scores.rankingConfidence).toBe('Medium');

  // There are 5 penalty triggers (combined stress < 0, safety < 6, legal rent < 6, omc < 6, ber < 6)
  // Overall score should be resilience - 1.5 - 1.0 - 1.0 - 1.0 - 1.0 = resilience - 5.5
  expect(scores.riskFlags.length).toBeGreaterThan(0);
  expect(scores.overallRiskAdjustedScore).toBeLessThan(scores.resilienceWeightedScore);
});
