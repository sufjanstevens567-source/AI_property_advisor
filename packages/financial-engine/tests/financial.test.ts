import { expect, test } from 'vitest';
import { calculateFinancials, runStressTests, InvestorAssumptions, PropertyFinancialInput } from '../src/index';

const assumptions: InvestorAssumptions = {
  cashDeployed: 300000,
  mortgageRate: 0.0565,
  mortgageTermYears: 25,
  vacancyMonthsBase: 1,
  taxRates: [0.2, 0.3, 0.4],
  centralTaxRate: 0.3,
};

const input: PropertyFinancialInput = {
  purchasePrice: 400000,
  monthlyRent: 2500,
  stampDuty: 4000,
  legalSetupCost: 3500,
  furnishingSetupCost: 5000,
  refurbishmentCost: 0,
  berUpgradeCost: 0,
  annualServiceCharge: 2000,
  annualMaintenance: 1200,
  annualInsurance: 400,
  annualAccountingCompliance: 600,
  annualLettingFeeAmortised: 500,
  annualCapexReserve: 800,
};

test('calculates basic financial metrics correctly', () => {
  const result = calculateFinancials(input, assumptions);

  expect(result.totalAcquisitionCost).toBe(412500); // 400k + 4k + 3.5k + 5k
  expect(result.mortgageRequired).toBe(112500); // 412.5k - 300k
  expect(result.annualHeadlineRent).toBe(30000); // 2500 * 12
  expect(result.vacancyAdjustedRent).toBe(27500); // 30000 * 11/12

  // M = P * r * (1+r)^n / ((1+r)^n - 1)
  // P = 112500, r = 0.0565 / 12, n = 300
  // M ≈ 700.96
  expect(result.monthlyMortgagePayment).toBeCloseTo(700.96, 1);
  expect(result.annualMortgagePayment).toBeCloseTo(8411.55, 1);
  
  // Year 1 interest ≈ 6302
  // Year 1 principal ≈ 2109
  expect(result.yearOneInterest).toBeCloseTo(6302, 0);
  expect(result.yearOnePrincipal).toBeCloseTo(2109, 0);

  // total annual costs = 2000 + 1200 + 400 + 600 + 500 + 800 = 5500
  // taxable profit = 27500 - 6302 - 5500 = 15698
  const taxableProfit = result.taxableProfitByTaxRate['30'];
  expect(taxableProfit).toBeCloseTo(15698, 0);

  // tax @ 30% = 4709
  const tax = result.estimatedTaxByTaxRate['30'];
  expect(tax).toBeCloseTo(4709, 0);

  // CF = 27500 - 5500 - 4709 - 8412 = 8879
  const annualCF = result.annualAfterTaxCashFlowByTaxRate['30'];
  expect(annualCF).toBeCloseTo(8879, 0);

  const monthlyCF = result.monthlyCashFlowByTaxRate['30'];
  expect(monthlyCF).toBeCloseTo(740, 0);

  // Eco ROI = (8879 + 2110) / 300000 = 3.66%
  const ecoRoi = result.economicRoiByTaxRate['30'];
  expect(ecoRoi).toBeCloseTo(0.0366, 2);
});

test('runs stress tests correctly', () => {
  const stress = runStressTests(input, assumptions);
  expect(stress).toHaveLength(10);
  
  const combined = stress.find(s => s.scenarioId === 9)!;
  // rent -10%: 27000 annual -> 10/12 = 22500
  // costs +25%: 5500 -> 6875
  // rate 7%: M ≈ 795 -> annual ≈ 9540
  // year 1 int ≈ 7815
  // taxable profit = 22500 - 7815 - 6875 = 7810
  // tax = 2343
  // CF = 22500 - 6875 - 2343 - 9540 = 3742
  // monthly CF ≈ 312
  expect(combined.monthlyCashFlow).toBeCloseTo(312, 0);

  const severe = stress.find(s => s.scenarioId === 10)!;
  // rent -15%: 25500 -> 9/12 = 19125
  // costs +25%: 6875
  // rate 8%: M ≈ 868 -> annual ≈ 10419
  // year 1 int ≈ 8945
  // taxable profit = 19125 - 8945 - 6875 = 3305
  // tax = 991
  // CF = 19125 - 6875 - 991 - 10419 = 840
  // monthly CF ≈ 70
  expect(severe.monthlyCashFlow).toBeCloseTo(70, 0);
  
  // combined > 300 and severe >= 0 -> Robust
  expect(combined.resilienceCategory).toBe('Robust');
});
