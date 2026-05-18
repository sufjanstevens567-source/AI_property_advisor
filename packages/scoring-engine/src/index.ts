export type PropertyDataStatus = {
  isSizeUnknown: boolean;
  isServiceChargeEstimated: boolean;
  isBerUnknown: boolean;
  isTenancyUnknown: boolean;
  isMicroLocationUncertain: boolean;
  isPreviousRentUnknown: boolean;
};

export type PropertyQualitativeInput = {
  locationQuality: number;
  safetyPerception: number;
  recessionResilience: number;
  tenantDemand: number;
  rentAchievability: number;
  legalRentConfidence: number;
  buildingQuality: number;
  omcRisk: number;
  berRisk: number;
  serviceChargeReasonableness: number;
  maintenanceRisk: number;
  layoutQuality: number;
  parkingValue: number;
  resaleLiquidity: number;
  operationalHassle: number;
};

export type ScoringInputs = {
  dataStatus: PropertyDataStatus;
  qualitativeInputs: PropertyQualitativeInput;
  combinedStressCashFlow: number; // Scenario #9 monthly CF
  severeStressCashFlow: number; // Scenario #10 monthly CF
  baseCashFlow: number;
};

export type ScoringOutputs = {
  dataQualityScore: number;
  rawQualitativeScore: number;
  resilienceWeightedScore: number;
  overallRiskAdjustedScore: number;
  rankingConfidence: "High" | "Medium" | "Low";
  riskFlags: string[];
};

export function calculateScores(inputs: ScoringInputs): ScoringOutputs {
  const flags: string[] = [];

  // 1. Data Quality Score
  let dqScore = 10;
  if (inputs.dataStatus.isSizeUnknown) dqScore -= 1.5;
  if (inputs.dataStatus.isServiceChargeEstimated) dqScore -= 1.0;
  if (inputs.dataStatus.isBerUnknown) dqScore -= 1.0;
  if (inputs.dataStatus.isTenancyUnknown) dqScore -= 1.0;
  if (inputs.dataStatus.isMicroLocationUncertain) dqScore -= 1.5;
  if (inputs.dataStatus.isPreviousRentUnknown) dqScore -= 1.0;
  
  dqScore = Math.max(1, Math.round(dqScore * 2) / 2); // Round to nearest 0.5

  let rankingConfidence: "High" | "Medium" | "Low" = "High";
  if (dqScore < 7 && dqScore >= 5) rankingConfidence = "Medium";
  if (dqScore < 5) rankingConfidence = "Low";

  if (dqScore < 7) {
    flags.push("Low Data Quality prevents unconditional Buy recommendation.");
  }

  // 2. Qualitative Scoring
  const q = inputs.qualitativeInputs;
  const rawQualitativeScore = 
    (q.locationQuality + q.safetyPerception + q.recessionResilience + q.tenantDemand + 
     q.rentAchievability + q.legalRentConfidence + q.buildingQuality + q.omcRisk + 
     q.berRisk + q.serviceChargeReasonableness + q.maintenanceRisk + q.layoutQuality + 
     q.parkingValue + q.resaleLiquidity + q.operationalHassle) / 15;

  // Resilience Weighted Score
  // Double-weight: 2, 3, 6, 8, 9, 14
  const weightedSum = 
    q.locationQuality + 
    q.safetyPerception * 2 + 
    q.recessionResilience * 2 + 
    q.tenantDemand + 
    q.rentAchievability + 
    q.legalRentConfidence * 2 + 
    q.buildingQuality + 
    q.omcRisk * 2 + 
    q.berRisk * 2 + 
    q.serviceChargeReasonableness + 
    q.maintenanceRisk + 
    q.layoutQuality + 
    q.parkingValue + 
    q.resaleLiquidity * 2 + 
    q.operationalHassle;
  
  const resilienceWeightedScore = weightedSum / 21; // 15 original + 6 extra weights

  // 3. Penalty Triggers for Overall Risk-Adjusted Score
  let overallRiskAdjustedScore = resilienceWeightedScore;
  
  if (inputs.combinedStressCashFlow < 0) {
    overallRiskAdjustedScore -= 1.5;
    flags.push("Negative combined downside stress cash flow.");
  }
  
  if (q.safetyPerception < 6) {
    overallRiskAdjustedScore -= 1.0;
    flags.push("Safety/tenant perception score below 6.");
  }

  if (q.legalRentConfidence < 6) {
    overallRiskAdjustedScore -= 1.0;
    flags.push("Legal rent confidence score below 6.");
  }

  if (q.omcRisk < 6) {
    overallRiskAdjustedScore -= 1.0;
    flags.push("Current OMC liability risk score below 6.");
  }

  if (q.berRisk < 6) {
    overallRiskAdjustedScore -= 1.0;
    flags.push("BER is D or below (needs funded upgrade plan).");
  }

  overallRiskAdjustedScore = Math.max(1, Math.min(10, overallRiskAdjustedScore));

  return {
    dataQualityScore: dqScore,
    rawQualitativeScore: Number(rawQualitativeScore.toFixed(2)),
    resilienceWeightedScore: Number(resilienceWeightedScore.toFixed(2)),
    overallRiskAdjustedScore: Number(overallRiskAdjustedScore.toFixed(2)),
    rankingConfidence,
    riskFlags: flags
  };
}
