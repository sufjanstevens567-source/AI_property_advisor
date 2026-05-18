export type InvestorAssumptions = {
  cashDeployed: number;
  mortgageRate: number;
  mortgageTermYears: number;
  vacancyMonthsBase: number;
  taxRates: number[];
  centralTaxRate: number;
  managementFeePct?: number;
};

export type PropertyFinancialInput = {
  purchasePrice: number;
  monthlyRent: number;
  stampDuty: number;
  legalSetupCost: number;
  furnishingSetupCost: number;
  refurbishmentCost: number;
  berUpgradeCost: number;
  annualServiceCharge: number;
  annualMaintenance: number;
  annualInsurance: number;
  annualAccountingCompliance: number;
  annualLettingFeeAmortised: number;
  annualCapexReserve: number;
  annualBerAllowance?: number;
};

export type FinancialResult = {
  totalAcquisitionCost: number;
  mortgageRequired: number;
  ltv: number;
  monthlyMortgagePayment: number;
  annualMortgagePayment: number;
  yearOneInterest: number;
  yearOnePrincipal: number;
  annualHeadlineRent: number;
  vacancyAdjustedRent: number;
  grossYieldOnPrice: number;
  grossYieldOnAcquisitionCost: number;
  taxableProfitByTaxRate: Record<string, number>;
  estimatedTaxByTaxRate: Record<string, number>;
  annualAfterTaxCashFlowByTaxRate: Record<string, number>;
  monthlyCashFlowByTaxRate: Record<string, number>;
  economicReturnByTaxRate: Record<string, number>;
  economicRoiByTaxRate: Record<string, number>;
  roiWith2PctAppreciationByTaxRate: Record<string, number>;
  roiWith4PctAppreciationByTaxRate: Record<string, number>;
  dscr: number;
  breakEvenRent: number;
};

export type StressScenario = {
  id: number;
  name: string;
  rentMultiplier: number;
  costMultiplier: number;
  vacancyMonths: number;
  mortgageRate: number;
};

export type StressResult = {
  scenarioId: number;
  name: string;
  monthlyCashFlow: number;
  dscr: number;
  resilienceCategory: 'Robust' | 'Good' | 'Thin but positive' | 'Weak' | 'Fragile';
};

export function calculateFinancials(
  input: PropertyFinancialInput,
  assumptions: InvestorAssumptions
): FinancialResult {
  const totalAcquisitionCost =
    input.purchasePrice +
    input.stampDuty +
    input.legalSetupCost +
    input.furnishingSetupCost +
    input.refurbishmentCost +
    input.berUpgradeCost;

  const mortgageRequired = Math.max(0, totalAcquisitionCost - assumptions.cashDeployed);
  const ltv = mortgageRequired / input.purchasePrice;

  // Mortgage Math
  const r = assumptions.mortgageRate / 12;
  const n = assumptions.mortgageTermYears * 12;
  let monthlyMortgagePayment = 0;
  if (mortgageRequired > 0 && r > 0) {
    monthlyMortgagePayment = (mortgageRequired * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else if (mortgageRequired > 0 && r === 0) {
    monthlyMortgagePayment = mortgageRequired / n;
  }
  const annualMortgagePayment = monthlyMortgagePayment * 12;

  let balance = mortgageRequired;
  let yearOneInterest = 0;
  for (let i = 0; i < 12; i++) {
    const interest = balance * r;
    yearOneInterest += interest;
    const principal = monthlyMortgagePayment - interest;
    balance -= principal;
  }
  const yearOnePrincipal = annualMortgagePayment - yearOneInterest;

  // Rent & Vacancy
  const annualHeadlineRent = input.monthlyRent * 12;
  const vacancyAdjustedRent = annualHeadlineRent * ((12 - assumptions.vacancyMonthsBase) / 12);
  const grossYieldOnPrice = annualHeadlineRent / input.purchasePrice;
  const grossYieldOnAcquisitionCost = annualHeadlineRent / totalAcquisitionCost;

  // Operating Costs
  const totalAnnualCosts =
    input.annualServiceCharge +
    input.annualMaintenance +
    input.annualInsurance +
    input.annualAccountingCompliance +
    input.annualLettingFeeAmortised +
    input.annualCapexReserve +
    (input.annualBerAllowance || 0) +
    (assumptions.managementFeePct ? annualHeadlineRent * assumptions.managementFeePct : 0);

  const taxableProfitByTaxRate: Record<string, number> = {};
  const estimatedTaxByTaxRate: Record<string, number> = {};
  const annualAfterTaxCashFlowByTaxRate: Record<string, number> = {};
  const monthlyCashFlowByTaxRate: Record<string, number> = {};
  const economicReturnByTaxRate: Record<string, number> = {};
  const economicRoiByTaxRate: Record<string, number> = {};
  const roiWith2PctAppreciationByTaxRate: Record<string, number> = {};
  const roiWith4PctAppreciationByTaxRate: Record<string, number> = {};

  assumptions.taxRates.forEach(rate => {
    const key = (rate * 100).toString();
    // In Ireland, 100% of mortgage interest is deductible. 
    // Principal is not deductible.
    const taxableProfit = Math.max(0, vacancyAdjustedRent - yearOneInterest - totalAnnualCosts);
    taxableProfitByTaxRate[key] = taxableProfit;
    
    const estimatedTax = taxableProfit * rate;
    estimatedTaxByTaxRate[key] = estimatedTax;

    const annualAfterTaxCashFlow = vacancyAdjustedRent - totalAnnualCosts - estimatedTax - annualMortgagePayment;
    annualAfterTaxCashFlowByTaxRate[key] = annualAfterTaxCashFlow;
    monthlyCashFlowByTaxRate[key] = annualAfterTaxCashFlow / 12;

    const economicReturn = annualAfterTaxCashFlow + yearOnePrincipal;
    economicReturnByTaxRate[key] = economicReturn;
    economicRoiByTaxRate[key] = economicReturn / assumptions.cashDeployed;

    roiWith2PctAppreciationByTaxRate[key] = (economicReturn + input.purchasePrice * 0.02) / assumptions.cashDeployed;
    roiWith4PctAppreciationByTaxRate[key] = (economicReturn + input.purchasePrice * 0.04) / assumptions.cashDeployed;
  });

  const dscr = annualMortgagePayment > 0 ? vacancyAdjustedRent / annualMortgagePayment : 0;

  // Break-even rent: vacancyAdjustedRent - totalAnnualCosts - tax - annualMortgagePayment = 0
  // tax = (vacancyAdjustedRent - yearOneInterest - totalAnnualCosts) * centralTaxRate
  // CF = (1 - t) * vacancyAdjustedRent - (1 - t) * totalAnnualCosts + t * yearOneInterest - annualMortgagePayment = 0
  // vacancyAdjustedRent = (annualMortgagePayment - t * yearOneInterest + (1 - t) * totalAnnualCosts) / (1 - t)
  // Monthly Break-Even Rent = vacancyAdjustedRent / ((12 - vacancyMonthsBase) / 12) / 12
  const t = assumptions.centralTaxRate;
  const targetAnnualVacancyAdjustedRent = (annualMortgagePayment - t * yearOneInterest + (1 - t) * totalAnnualCosts) / (1 - t);
  const breakEvenRent = targetAnnualVacancyAdjustedRent / ((12 - assumptions.vacancyMonthsBase) / 12) / 12;

  return {
    totalAcquisitionCost,
    mortgageRequired,
    ltv,
    monthlyMortgagePayment,
    annualMortgagePayment,
    yearOneInterest,
    yearOnePrincipal,
    annualHeadlineRent,
    vacancyAdjustedRent,
    grossYieldOnPrice,
    grossYieldOnAcquisitionCost,
    taxableProfitByTaxRate,
    estimatedTaxByTaxRate,
    annualAfterTaxCashFlowByTaxRate,
    monthlyCashFlowByTaxRate,
    economicReturnByTaxRate,
    economicRoiByTaxRate,
    roiWith2PctAppreciationByTaxRate,
    roiWith4PctAppreciationByTaxRate,
    dscr,
    breakEvenRent,
  };
}

export function runStressTests(
  input: PropertyFinancialInput,
  assumptions: InvestorAssumptions
): StressResult[] {
  const baseResult = calculateFinancials(input, assumptions);
  const centralTaxKey = (assumptions.centralTaxRate * 100).toString();

  const scenarios: StressScenario[] = [
    { id: 1, name: 'Base', rentMultiplier: 1, costMultiplier: 1, vacancyMonths: assumptions.vacancyMonthsBase, mortgageRate: assumptions.mortgageRate },
    { id: 2, name: 'Rent -10%', rentMultiplier: 0.9, costMultiplier: 1, vacancyMonths: assumptions.vacancyMonthsBase, mortgageRate: assumptions.mortgageRate },
    { id: 3, name: 'Rent -15%', rentMultiplier: 0.85, costMultiplier: 1, vacancyMonths: assumptions.vacancyMonthsBase, mortgageRate: assumptions.mortgageRate },
    { id: 4, name: 'Costs +25%', rentMultiplier: 1, costMultiplier: 1.25, vacancyMonths: assumptions.vacancyMonthsBase, mortgageRate: assumptions.mortgageRate },
    { id: 5, name: '2 months vacancy', rentMultiplier: 1, costMultiplier: 1, vacancyMonths: 2, mortgageRate: assumptions.mortgageRate },
    { id: 6, name: '3 months vacancy', rentMultiplier: 1, costMultiplier: 1, vacancyMonths: 3, mortgageRate: assumptions.mortgageRate },
    { id: 7, name: 'Rate 7%', rentMultiplier: 1, costMultiplier: 1, vacancyMonths: assumptions.vacancyMonthsBase, mortgageRate: 0.07 },
    { id: 8, name: 'Rate 8%', rentMultiplier: 1, costMultiplier: 1, vacancyMonths: assumptions.vacancyMonthsBase, mortgageRate: 0.08 },
    { id: 9, name: 'Combined downside', rentMultiplier: 0.9, costMultiplier: 1.25, vacancyMonths: 2, mortgageRate: 0.07 },
    { id: 10, name: 'Severe downside', rentMultiplier: 0.85, costMultiplier: 1.25, vacancyMonths: 3, mortgageRate: 0.08 },
  ];

  const results = scenarios.map(sc => {
    const scInput = {
      ...input,
      monthlyRent: input.monthlyRent * sc.rentMultiplier,
      annualServiceCharge: input.annualServiceCharge * sc.costMultiplier,
      annualMaintenance: input.annualMaintenance * sc.costMultiplier,
      annualInsurance: input.annualInsurance * sc.costMultiplier,
      annualAccountingCompliance: input.annualAccountingCompliance * sc.costMultiplier,
      annualLettingFeeAmortised: input.annualLettingFeeAmortised * sc.costMultiplier,
      annualCapexReserve: input.annualCapexReserve * sc.costMultiplier,
      annualBerAllowance: (input.annualBerAllowance || 0) * sc.costMultiplier,
    };
    const scAssumptions = {
      ...assumptions,
      vacancyMonthsBase: sc.vacancyMonths,
      mortgageRate: sc.mortgageRate
    };

    const fin = calculateFinancials(scInput, scAssumptions);
    return {
      scenarioId: sc.id,
      name: sc.name,
      monthlyCashFlow: fin.monthlyCashFlowByTaxRate[centralTaxKey],
      dscr: fin.dscr,
    };
  });

  const getResilienceCategory = (combined: number, severe: number): StressResult['resilienceCategory'] => {
    if (combined > 300 && severe >= 0) return 'Robust';
    if (combined > 100 && combined <= 300) return 'Good';
    if (combined > 0 && combined <= 100) return 'Thin but positive';
    if (combined < 0 && baseResult.monthlyCashFlowByTaxRate[centralTaxKey] > 0) return 'Weak';
    return 'Fragile';
  };

  const combinedCF = results.find(r => r.scenarioId === 9)!.monthlyCashFlow;
  const severeCF = results.find(r => r.scenarioId === 10)!.monthlyCashFlow;
  const category = getResilienceCategory(combinedCF, severeCF);

  return results.map(r => ({
    ...r,
    resilienceCategory: category
  }));
}
