"use client";

import { useId, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  InvestorAssumptions,
  PropertyFinancialInput,
  calculateFinancials,
  runStressTests,
} from "@property-underwriter/financial-engine";
import { calculateScores, PropertyQualitativeInput } from "@property-underwriter/scoring-engine";
import { calculateNegotiationStrategy } from "@property-underwriter/negotiation-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DataStatus = "Confirmed" | "Estimated" | "Unknown";
type Step = "dashboard" | "setup" | "entry" | "comps" | "confirm" | "analysis";
type SortMode = "resilience" | "cashflow" | "yield" | "clean" | "overall";

type RentComp = {
  id: string;
  source: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  sizeSqm: number;
  ber: string;
  parking: string;
  sameBuilding: boolean;
  tier: "A" | "B" | "C" | "D";
  notes: string;
};

type PropertyRecord = {
  id: string;
  name: string;
  listingUrl: string;
  address: string;
  microLocation: string;
  beds: number;
  baths: number;
  sizeSqm: number;
  ber: string;
  floor: string;
  parking: string;
  balcony: string;
  tenancyStatus: "Vacant" | "Tenanted" | "Unknown";
  previousRent: number;
  daysOnMarket: number;
  serviceChargeStatus: DataStatus;
  sizeStatus: DataStatus;
  berStatus: DataStatus;
  tenancyStatusConfidence: DataStatus;
  microLocationStatus: DataStatus;
  askingPrice: number;
  expectedRent: number;
  annualServiceCharge: number;
  legalSetupCost: number;
  furnishingSetupCost: number;
  refurbishmentCost: number;
  berUpgradeCost: number;
  annualMaintenance: number;
  annualInsurance: number;
  annualAccountingCompliance: number;
  annualLettingFeeAmortised: number;
  annualCapexReserve: number;
  annualBerAllowance: number;
  omcRiskNotes: string;
  riskNotes: string;
  comps: RentComp[];
  qualitative: PropertyQualitativeInput;
};

type QuickTriageInput = {
  askingPrice: number;
  expectedRent: number;
  annualServiceCharge: number;
};

const defaultAssumptions: InvestorAssumptions = {
  cashDeployed: 300000,
  mortgageRate: 0.0565,
  mortgageTermYears: 25,
  vacancyMonthsBase: 1,
  taxRates: [0.2, 0.3, 0.4],
  centralTaxRate: 0.3,
  managementFeePct: 0,
};

const baseQualitative: PropertyQualitativeInput = {
  locationQuality: 8,
  safetyPerception: 7,
  recessionResilience: 8,
  tenantDemand: 8,
  rentAchievability: 7,
  legalRentConfidence: 7,
  buildingQuality: 7,
  omcRisk: 6,
  berRisk: 7,
  serviceChargeReasonableness: 6,
  maintenanceRisk: 7,
  layoutQuality: 7,
  parkingValue: 6,
  resaleLiquidity: 8,
  operationalHassle: 7,
};

const starterProperties: PropertyRecord[] = [
  {
    id: "fitz-quay",
    name: "85 Fitzwilliam Quay",
    listingUrl: "https://www.daft.ie/",
    address: "85 Fitzwilliam Quay, Ringsend, Dublin 4",
    microLocation: "Ringsend / Grand Canal edge",
    beds: 2,
    baths: 1,
    sizeSqm: 63,
    ber: "B3",
    floor: "Upper floor",
    parking: "Unknown",
    balcony: "Yes",
    tenancyStatus: "Vacant",
    previousRent: 0,
    daysOnMarket: 4,
    serviceChargeStatus: "Confirmed",
    sizeStatus: "Confirmed",
    berStatus: "Confirmed",
    tenancyStatusConfidence: "Confirmed",
    microLocationStatus: "Confirmed",
    askingPrice: 450000,
    expectedRent: 2400,
    annualServiceCharge: 2384,
    legalSetupCost: 3500,
    furnishingSetupCost: 5000,
    refurbishmentCost: 0,
    berUpgradeCost: 0,
    annualMaintenance: 1200,
    annualInsurance: 400,
    annualAccountingCompliance: 650,
    annualLettingFeeAmortised: 500,
    annualCapexReserve: 800,
    annualBerAllowance: 0,
    omcRiskNotes: "No public red flags found; management-company accounts, meeting notes, insurance, and repair reserve still required.",
    riskNotes: "Cleanest public-data profile, but combined stress is thin at asking.",
    comps: [],
    qualitative: { ...baseQualitative, legalRentConfidence: 9, omcRisk: 7, berRisk: 8 },
  },
  {
    id: "corn-mill",
    name: "111 Corn Mill",
    listingUrl: "https://www.daft.ie/",
    address: "111 Corn Mill, Dublin 3",
    microLocation: "D3 / North Strand edge",
    beds: 2,
    baths: 2,
    sizeSqm: 90,
    ber: "B3",
    floor: "Unknown",
    parking: "Unknown",
    balcony: "Unknown",
    tenancyStatus: "Unknown",
    previousRent: 0,
    daysOnMarket: 21,
    serviceChargeStatus: "Estimated",
    sizeStatus: "Confirmed",
    berStatus: "Confirmed",
    tenancyStatusConfidence: "Unknown",
    microLocationStatus: "Estimated",
    askingPrice: 475000,
    expectedRent: 2600,
    annualServiceCharge: 1700,
    legalSetupCost: 3500,
    furnishingSetupCost: 5000,
    refurbishmentCost: 0,
    berUpgradeCost: 0,
    annualMaintenance: 1500,
    annualInsurance: 450,
    annualAccountingCompliance: 650,
    annualLettingFeeAmortised: 600,
    annualCapexReserve: 900,
    annualBerAllowance: 0,
    omcRiskNotes: "Rent history and legal-rent status are the gating risk. Management-company pack still required.",
    riskNotes: "Yield candidate only if rent legality is verified.",
    comps: [],
    qualitative: { ...baseQualitative, locationQuality: 6, legalRentConfidence: 5, omcRisk: 6 },
  },
  {
    id: "longboat",
    name: "314 Longboat Quay North",
    listingUrl: "https://www.daft.ie/",
    address: "314 Longboat Quay North, Grand Canal Dock, Dublin 2",
    microLocation: "Grand Canal Dock",
    beds: 2,
    baths: 2,
    sizeSqm: 65,
    ber: "C3",
    floor: "Top floor",
    parking: "Unknown",
    balcony: "Yes",
    tenancyStatus: "Unknown",
    previousRent: 0,
    daysOnMarket: 13,
    serviceChargeStatus: "Estimated",
    sizeStatus: "Confirmed",
    berStatus: "Confirmed",
    tenancyStatusConfidence: "Unknown",
    microLocationStatus: "Confirmed",
    askingPrice: 460000,
    expectedRent: 2600,
    annualServiceCharge: 2600,
    legalSetupCost: 3500,
    furnishingSetupCost: 5000,
    refurbishmentCost: 0,
    berUpgradeCost: 0,
    annualMaintenance: 1500,
    annualInsurance: 500,
    annualAccountingCompliance: 650,
    annualLettingFeeAmortised: 650,
    annualCapexReserve: 1000,
    annualBerAllowance: 0,
    omcRiskNotes: "Longboat Quay has historical fire-safety risk; exact block status must be documented.",
    riskNotes: "Best upside if management-company and fire-safety documentation clears.",
    comps: [],
    qualitative: { ...baseQualitative, locationQuality: 9, omcRisk: 4, buildingQuality: 5, berRisk: 6 },
  },
  {
    id: "william-bligh",
    name: "84 William Bligh",
    listingUrl: "https://www.daft.ie/",
    address: "84 William Bligh, The Gasworks, Dublin 4",
    microLocation: "The Gasworks / Barrow Street",
    beds: 1,
    baths: 1,
    sizeSqm: 52,
    ber: "C3",
    floor: "Top floor",
    parking: "No",
    balcony: "Yes",
    tenancyStatus: "Unknown",
    previousRent: 0,
    daysOnMarket: 13,
    serviceChargeStatus: "Estimated",
    sizeStatus: "Confirmed",
    berStatus: "Confirmed",
    tenancyStatusConfidence: "Unknown",
    microLocationStatus: "Confirmed",
    askingPrice: 420000,
    expectedRent: 2300,
    annualServiceCharge: 2200,
    legalSetupCost: 3500,
    furnishingSetupCost: 5000,
    refurbishmentCost: 0,
    berUpgradeCost: 0,
    annualMaintenance: 1000,
    annualInsurance: 350,
    annualAccountingCompliance: 600,
    annualLettingFeeAmortised: 500,
    annualCapexReserve: 700,
    annualBerAllowance: 0,
    omcRiskNotes: "Service charge and management-company documents need confirmation.",
    riskNotes: "Strong stress profile for a premium 1-bed, but narrower tenant pool than a 2-bed.",
    comps: [],
    qualitative: { ...baseQualitative, safetyPerception: 8, legalRentConfidence: 6, berRisk: 6 },
  },
  {
    id: "fitz-point",
    name: "77 Fitzwilliam Point",
    listingUrl: "https://www.daft.ie/",
    address: "77 Fitzwilliam Point, Dublin 4",
    microLocation: "Fitzwilliam Street / D4",
    beds: 1,
    baths: 1,
    sizeSqm: 52,
    ber: "D1",
    floor: "Unknown",
    parking: "Unknown",
    balcony: "Unknown",
    tenancyStatus: "Unknown",
    previousRent: 0,
    daysOnMarket: 60,
    serviceChargeStatus: "Confirmed",
    sizeStatus: "Confirmed",
    berStatus: "Confirmed",
    tenancyStatusConfidence: "Unknown",
    microLocationStatus: "Confirmed",
    askingPrice: 395000,
    expectedRent: 2150,
    annualServiceCharge: 1600,
    legalSetupCost: 3500,
    furnishingSetupCost: 5000,
    refurbishmentCost: 0,
    berUpgradeCost: 12000,
    annualMaintenance: 1200,
    annualInsurance: 400,
    annualAccountingCompliance: 600,
    annualLettingFeeAmortised: 500,
    annualCapexReserve: 900,
    annualBerAllowance: 800,
    omcRiskNotes: "Low service charge must be reconciled with sinking fund adequacy.",
    riskNotes: "D1 energy rating may reduce achievable market rent and requires a funded upgrade plan.",
    comps: [],
    qualitative: { ...baseQualitative, berRisk: 3, legalRentConfidence: 6, maintenanceRisk: 5 },
  },
];

function euro(value: number): string {
  return `EUR ${Math.round(value).toLocaleString("en-IE")}`;
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function stampDuty(price: number): number {
  return price <= 1000000 ? price * 0.01 : 1000000 * 0.01 + (price - 1000000) * 0.02;
}

function toFinancialInput(property: PropertyRecord): PropertyFinancialInput {
  return {
    purchasePrice: property.askingPrice,
    monthlyRent: property.expectedRent,
    stampDuty: stampDuty(property.askingPrice),
    legalSetupCost: property.legalSetupCost,
    furnishingSetupCost: property.furnishingSetupCost,
    refurbishmentCost: property.refurbishmentCost,
    berUpgradeCost: property.berUpgradeCost,
    annualServiceCharge: property.annualServiceCharge,
    annualMaintenance: property.annualMaintenance,
    annualInsurance: property.annualInsurance,
    annualAccountingCompliance: property.annualAccountingCompliance,
    annualLettingFeeAmortised: property.annualLettingFeeAmortised,
    annualCapexReserve: property.annualCapexReserve,
    annualBerAllowance: property.annualBerAllowance,
  };
}

function rentConfidence(comps: RentComp[]): "High" | "Medium" | "Low" {
  if (comps.some(comp => comp.tier === "A" || comp.tier === "B")) return "High";
  if (comps.filter(comp => comp.tier === "C").length >= 2) return "Medium";
  return "Low";
}

function weakestCompTier(comps: RentComp[]): "A" | "B" | "C" | "D" | "None" {
  if (comps.length === 0) return "None";
  if (comps.some(comp => comp.tier === "A")) return "A";
  if (comps.some(comp => comp.tier === "B")) return "B";
  if (comps.some(comp => comp.tier === "C")) return "C";
  return "D";
}

function compTierLabel(tier: RentComp["tier"] | "None"): string {
  const labels = {
    A: "Located in the exact same building",
    B: "Located in the same development",
    C: "Located in the same local street or neighborhood",
    D: "Located in the broader surrounding area",
    None: "No matching rental proof added yet",
  };

  return labels[tier];
}

function readableRisk(risk: string): string {
  const labels: Record<string, string> = {
    OMC: "Unconfirmed building management company records",
    RTB: "Unconfirmed tenancy history and legal rent caps",
    BER: "Poor energy efficiency or heating upgrade risks",
    "Service charge": "Unverified building maintenance fees",
    "Rent evidence": "Lack of similar nearby rental proof",
    Tenancy: "Unconfirmed current tenant status",
  };

  return labels[risk] ?? risk;
}

function readableRisks(risks: string[]): string {
  return risks.map(readableRisk).join(", ");
}

function verdictLabel(verdict: string): string {
  const labels: Record<string, string> = {
    Buy: "Ready to Offer (Safe)",
    "Conditional Buy": "Caution (Verify First)",
    Avoid: "High Risk (Avoid)",
  };
  return labels[verdict] ?? verdict;
}

function analyseProperty(property: PropertyRecord, assumptions: InvestorAssumptions, overrideRate?: number) {
  const modelAssumptions = overrideRate ? { ...assumptions, mortgageRate: overrideRate } : assumptions;
  const financial = calculateFinancials(toFinancialInput(property), modelAssumptions);
  const stress = runStressTests(toFinancialInput(property), modelAssumptions);
  const centralKey = (modelAssumptions.centralTaxRate * 100).toString();
  const combined = stress.find(result => result.scenarioId === 9)!;
  const severe = stress.find(result => result.scenarioId === 10)!;
  const baseCashFlow = financial.monthlyCashFlowByTaxRate[centralKey];
  const scores = calculateScores({
    dataStatus: {
      isSizeUnknown: property.sizeStatus === "Unknown",
      isServiceChargeEstimated: property.serviceChargeStatus === "Estimated",
      isServiceChargeUnknown: property.serviceChargeStatus === "Unknown",
      isBerUnknown: property.berStatus === "Unknown",
      isTenancyUnknown: property.tenancyStatusConfidence === "Unknown",
      isMicroLocationUncertain: property.microLocationStatus !== "Confirmed",
      isPreviousRentUnknown: property.tenancyStatus !== "Vacant" && property.previousRent <= 0,
      rentCompTier: weakestCompTier(property.comps),
    },
    qualitativeInputs: property.qualitative,
    combinedStressCashFlow: combined.monthlyCashFlow,
    severeStressCashFlow: severe.monthlyCashFlow,
    baseCashFlow,
  });

  const unresolvedRisks: Array<"OMC" | "RTB" | "BER" | "Service charge" | "Rent evidence" | "Tenancy"> = [];
  if (property.qualitative.omcRisk < 6) unresolvedRisks.push("OMC");
  if (property.qualitative.legalRentConfidence < 7 || property.tenancyStatus !== "Vacant") unresolvedRisks.push("RTB");
  if (property.qualitative.berRisk < 6) unresolvedRisks.push("BER");
  if (property.serviceChargeStatus !== "Confirmed") unresolvedRisks.push("Service charge");
  if (rentConfidence(property.comps) === "Low") unresolvedRisks.push("Rent evidence");
  if (property.tenancyStatus === "Unknown") unresolvedRisks.push("Tenancy");

  const verdict =
    scores.dataQualityScore < 6 || property.qualitative.omcRisk <= 4 || property.qualitative.berRisk <= 2
      ? "Avoid"
      : unresolvedRisks.length > 0 || scores.dataQualityScore < 8 || combined.monthlyCashFlow < 0
        ? "Conditional Buy"
        : "Buy";

  const negotiation = calculateNegotiationStrategy({
    askingPrice: property.askingPrice,
    daysOnMarket: property.daysOnMarket,
    dataQualityScore: scores.dataQualityScore,
    verdict,
    priceForTargetReturns: property.askingPrice * 0.975,
    priceForBreakEven: property.askingPrice,
    combinedStressCashFlow: combined.monthlyCashFlow,
    unresolvedRisks,
  });

  return {
    financial,
    stress,
    combined,
    severe,
    scores,
    negotiation,
    verdict,
    unresolvedRisks,
    baseCashFlow,
    centralKey,
    rentConfidence: rentConfidence(property.comps),
  };
}

function breakEvenVacancyMonths(property: PropertyRecord, assumptions: InvestorAssumptions): number {
  let low = 0;
  let high = 12;

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const result = calculateFinancials(toFinancialInput(property), { ...assumptions, vacancyMonthsBase: mid });
    const key = (assumptions.centralTaxRate * 100).toString();

    if (result.monthlyCashFlowByTaxRate[key] >= 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low;
}

function riskColor(value: number): string {
  if (value > 300) return "text-emerald-700";
  if (value >= 0) return "text-amber-700";
  return "text-red-700";
}

function verdictBorderColor(verdict: string): string {
  if (verdict === "Buy") return "border-l-emerald-600";
  if (verdict === "Avoid") return "border-l-red-500";
  return "border-l-amber-500";
}

function verdictBadgeClasses(verdict: string): string {
  if (verdict === "Buy") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (verdict === "Avoid") return "bg-red-100 text-red-800 border-red-200";
  return "bg-amber-100 text-amber-800 border-amber-200";
}

function resilienceLabel(category: string): string {
  const labels: Record<string, string> = {
    Robust: "Strong safety margin",
    Good: "Comfortable safety margin",
    "Thin but positive": "Narrow safety margin",
    Weak: "Loses money under stress",
    Fragile: "Severe losses under stress",
  };
  return labels[category] ?? category;
}

function reportMarkdown(property: PropertyRecord, analysis: ReturnType<typeof analyseProperty>, vacancyLimit: number): string {
  const riskBullets = analysis.unresolvedRisks.length > 0
    ? analysis.unresolvedRisks.map(r => `- ${readableRisk(r)}`).join("\n")
    : "- All crucial facts have been verified";

  const narrativeOpening = `${property.name || "This property"} earns an expected ${euro(analysis.baseCashFlow)} per month after tax. Under worst-case stress conditions (higher interest rates, vacancy, and rising costs), this drops to ${euro(analysis.combined.monthlyCashFlow)} per month \u2014 a ${resilienceLabel(analysis.combined.resilienceCategory).toLowerCase()}. ${
    analysis.unresolvedRisks.length > 0
      ? `Before making an offer, the following items need to be independently verified: ${analysis.unresolvedRisks.map(readableRisk).join(", ")}.`
      : "All critical facts are verified and the property is ready for an offer."
  }`;

  const today = new Date().toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" });

  return `# Property Underwriting Report: ${property.name}

> Generated on ${today}. Model assumes: ${(analysis.financial.ltv * 100).toFixed(0)}% mortgage at ${((analysis.financial.yearOneInterest / analysis.financial.mortgageRequired) * 100).toFixed(2) || "5.65"}% interest, ${vacancyLimit > 0 ? `${vacancyLimit.toFixed(1)} months` : "standard"} vacancy tolerance.${property.listingUrl ? ` Listing: ${property.listingUrl}` : ""}

---

## The Bottom Line

**Decision:** ${verdictLabel(analysis.verdict)}

${narrativeOpening}

| Metric | Value |
|:---|:---|
| Asking price | ${euro(property.askingPrice)} |
| Expected monthly profit | ${euro(analysis.baseCashFlow)} |
| Worst-case monthly profit | ${euro(analysis.combined.monthlyCashFlow)} (${resilienceLabel(analysis.combined.resilienceCategory)}) |
| Data completeness | ${analysis.scores.dataQualityScore}/10 (${analysis.scores.rankingConfidence}) |

**Items to verify before making an offer:**

${riskBullets}

> This is screening and scenario analysis, not investment advice. Verify assumptions with a solicitor, tax advisor, broker, surveyor, and management company documentation before making an offer.

---

## About This Property

| Detail | Value |
|:---|:---|
| Address | ${property.address} |
| Bedrooms / Bathrooms | ${property.beds} / ${property.baths} |
| Size | ${property.sizeSqm || "Unknown"} square meters |
| Energy rating | ${property.ber} (on a scale of A to G, where A is most efficient) |
| Yearly building upkeep fee | ${property.serviceChargeStatus === "Confirmed" ? "Confirmed" : `${property.serviceChargeStatus} (not yet verified)`} |
| Current occupancy | ${property.tenancyStatus} |

---

## The Numbers

| Metric | Value |
|:---|:---|
| Total upfront cash needed to buy | ${euro(analysis.financial.totalAcquisitionCost)} |
| Mortgage loan amount | ${euro(analysis.financial.mortgageRequired)} |
| Monthly mortgage payment | ${euro(analysis.financial.monthlyMortgagePayment)} |
| Minimum rent needed to avoid losing money | ${euro(analysis.financial.breakEvenRent)} per month |
| Empty-month safety cushion | ${vacancyLimit.toFixed(1)} months (how long it can sit empty before you lose money) |
| Estimated annual return at 30% tax | ${pct(analysis.financial.economicRoiByTaxRate[analysis.centralKey])} |

---

## How Confident Is the Rent?

Confidence in the rent estimate is **${analysis.rentConfidence}**.

${analysis.rentConfidence === "Low"
    ? "Weak rental evidence reduces confidence in the projection. To strengthen this, add same-building, same-development, or multiple same-area rental examples."
    : analysis.rentConfidence === "Medium"
      ? "Moderate rental evidence supports the estimate. Adding same-building comparables would increase confidence further."
      : "Strong rental evidence supports the estimate, backed by nearby verified rental data."}

---

## What If Things Go Wrong?

This section tests whether the property survives realistic adversity.

| Stress Scenario | Monthly Result | Safety Rating |
|:---|:---|:---|
| Combined downside (10% lower rent, 25% higher costs, 2 months empty, 7% interest rate) | ${euro(analysis.combined.monthlyCashFlow)} | ${resilienceLabel(analysis.combined.resilienceCategory)} |
| Severe downside (15% lower rent, 25% higher costs, 3 months empty, 8% interest rate) | ${euro(analysis.severe.monthlyCashFlow)} | ${resilienceLabel(analysis.severe.resilienceCategory)} |

${analysis.combined.monthlyCashFlow > 0
    ? `Under the worst realistic scenario, this property still earns ${euro(analysis.combined.monthlyCashFlow)} per month \u2014 meaning it survives significant adversity.`
    : `Under the worst realistic scenario, this property loses ${euro(Math.abs(analysis.combined.monthlyCashFlow))} per month \u2014 meaning it does not survive a major downturn without additional cash from the investor.`}

${analysis.severe.monthlyCashFlow > 0
    ? `Even under the most extreme scenario tested, the property remains profitable at ${euro(analysis.severe.monthlyCashFlow)} per month.`
    : `Under the most extreme scenario tested, the property loses ${euro(Math.abs(analysis.severe.monthlyCashFlow))} per month.`}

---

## Risk Profile

Overall risk score: **${analysis.scores.overallRiskAdjustedScore}/10** (higher is safer).

**Specific risk flags detected:**

${analysis.scores.riskFlags.map(flag => `- ${flag}`).join("\n") || "- No automatic safety flags detected."}

---

## Making an Offer

| Step | Price | Notes |
|:---|:---|:---|
| Starting offer | ${euro(analysis.negotiation.openingPrice)} | Your opening price to the seller |
| Fair price | ${euro(analysis.negotiation.targetPrice)} | Fair price based on building quality |
| Maximum (if all documents check out) | ${euro(analysis.negotiation.stretchPrice)} | Highest price if management company files, rent history, and energy rating are all clean |
| Do not pay more than | ${euro(analysis.negotiation.walkAwayPrice)} | Absolute walk-away limit |

Estimated seller acceptance chance: **${analysis.negotiation.acceptanceProbability}**

---

### Draft email to the estate agent

> ${analysis.negotiation.agentScript.replace(/\n/g, "\n> ")}

---

## Your Checklist

**Before making any offer:**

- Request management company accounts, meeting notes, repair reserve balance, insurance schedule, and levy history
- Verify rent history and confirm that the expected rent is legally chargeable under current rules
- Confirm the yearly building upkeep fee and check for any planned increases

**During the buying process:**

- Obtain the energy-rating certificate and confirm any required heating or insulation upgrades
- Commission a building survey and confirm findings align with the modelled repair budget
- Confirm mortgage lender comfort with the property, building, and management company

**After completing all checks:**

- Re-run this model with any updated numbers (rent, upkeep fees, energy rating, price changes) to verify the investment still works

---

*Generated by Irish Rental Property Underwriter on ${today}. This is scenario analysis, not investment advice.*`;
}

export default function Home() {
  const [step, setStep] = useState<Step>("dashboard");
  const [sortBy, setSortBy] = useState<SortMode>("resilience");
  const [savedProperties, setSavedProperties] = useState<PropertyRecord[]>(starterProperties);
  const [selectedId, setSelectedId] = useState(starterProperties[0].id);
  const [assumptions, setAssumptions] = useState<InvestorAssumptions>(defaultAssumptions);
  const [property, setProperty] = useState<PropertyRecord>(starterProperties[0]);
  const [newComp, setNewComp] = useState<Partial<RentComp>>({ tier: "C", beds: 2, baths: 1 });
  const [quickTriage, setQuickTriage] = useState<QuickTriageInput>({
    askingPrice: 425000,
    expectedRent: 2350,
    annualServiceCharge: 2200,
  });
  const [isCopied, setIsCopied] = useState(false);
  const [sliderRate, setSliderRate] = useState(defaultAssumptions.mortgageRate);
  const rentalMatchId = useId();
  const mortgageStressSliderId = useId();

  const selectedProperty = savedProperties.find(item => item.id === selectedId) ?? savedProperties[0];
  const currentAnalysis = analyseProperty(property, assumptions, sliderRate);
  const selectedAnalysis = analyseProperty(selectedProperty, assumptions);
  const vacancyLimit = breakEvenVacancyMonths(property, assumptions);

  const quickFinancialInput = toFinancialInput({
    ...starterProperties[0],
    askingPrice: quickTriage.askingPrice,
    expectedRent: quickTriage.expectedRent,
    annualServiceCharge: quickTriage.annualServiceCharge,
  });
  const quickResult = calculateFinancials(quickFinancialInput, assumptions);
  const quickKey = (assumptions.centralTaxRate * 100).toString();

  const dashboardRows = useMemo(() => {
    const rows = savedProperties.map(item => ({
      property: item,
      analysis: analyseProperty(item, assumptions),
      vacancyLimit: breakEvenVacancyMonths(item, assumptions),
    }));

    return rows.sort((a, b) => {
      if (sortBy === "cashflow") return b.analysis.baseCashFlow - a.analysis.baseCashFlow;
      if (sortBy === "yield") {
        return b.analysis.financial.economicRoiByTaxRate[b.analysis.centralKey] - a.analysis.financial.economicRoiByTaxRate[a.analysis.centralKey];
      }
      if (sortBy === "clean") {
        return Number(b.analysis.verdict === "Buy") - Number(a.analysis.verdict === "Buy") || b.analysis.scores.dataQualityScore - a.analysis.scores.dataQualityScore;
      }
      if (sortBy === "overall") return b.analysis.scores.overallRiskAdjustedScore - a.analysis.scores.overallRiskAdjustedScore;
      return b.analysis.combined.monthlyCashFlow - a.analysis.combined.monthlyCashFlow;
    });
  }, [assumptions, savedProperties, sortBy]);

  const radarData = [
    { dimension: "Location", score: property.qualitative.locationQuality },
    { dimension: "Safety", score: property.qualitative.safetyPerception },
    { dimension: "Downside strength", score: property.qualitative.recessionResilience },
    { dimension: "Demand", score: property.qualitative.tenantDemand },
    { dimension: "Rent estimate", score: property.qualitative.rentAchievability },
    { dimension: "Legal rent", score: property.qualitative.legalRentConfidence },
    { dimension: "Building", score: property.qualitative.buildingQuality },
    { dimension: "Management company", score: property.qualitative.omcRisk },
    { dimension: "Energy rating", score: property.qualitative.berRisk },
    { dimension: "Service charge", score: property.qualitative.serviceChargeReasonableness },
    { dimension: "Repair risk", score: property.qualitative.maintenanceRisk },
    { dimension: "Layout", score: property.qualitative.layoutQuality },
    { dimension: "Parking", score: property.qualitative.parkingValue },
    { dimension: "Resale liquidity", score: property.qualitative.resaleLiquidity },
    { dimension: "Operational ease", score: property.qualitative.operationalHassle },
    { dimension: "Overall", score: currentAnalysis.scores.overallRiskAdjustedScore },
  ];

  function updateProperty<K extends keyof PropertyRecord>(key: K, value: PropertyRecord[K]) {
    setProperty(previous => ({ ...previous, [key]: value }));
  }

  function saveProperty() {
    const id = property.id || `property-${Date.now()}`;
    const nextProperty = { ...property, id, name: property.name || "Untitled property" };
    setSavedProperties(previous => {
      const exists = previous.some(item => item.id === id);
      return exists ? previous.map(item => (item.id === id ? nextProperty : item)) : [nextProperty, ...previous];
    });
    setSelectedId(id);
    setStep("dashboard");
  }

  function loadProperty(id: string) {
    const next = savedProperties.find(item => item.id === id);
    if (next) {
      setProperty(next);
      setSelectedId(id);
      setSliderRate(assumptions.mortgageRate);
      setStep("analysis");
    }
  }

  function addComp() {
    if (!newComp.address || !newComp.rent) return;
    const comp: RentComp = {
      id: `comp-${Date.now()}`,
      source: newComp.source || "Manual",
      address: newComp.address,
      rent: Number(newComp.rent),
      beds: Number(newComp.beds || property.beds),
      baths: Number(newComp.baths || property.baths),
      sizeSqm: Number(newComp.sizeSqm || property.sizeSqm),
      ber: newComp.ber || property.ber,
      parking: newComp.parking || "Unknown",
      sameBuilding: Boolean(newComp.sameBuilding),
      tier: newComp.tier || "C",
      notes: newComp.notes || "",
    };
    updateProperty("comps", [...property.comps, comp]);
    setNewComp({ tier: "C", beds: property.beds, baths: property.baths });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-3 border-b border-border/60 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase" style={{letterSpacing: '0.08em'}}>Check the risks before chasing returns</p>
            <h1 className="mt-1 text-4xl tracking-tight" style={{fontFamily: 'var(--font-serif)'}}>Irish Rental Property Underwriter</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("dashboard")}>Dashboard</Button>
            <Button onClick={() => {
              setProperty({ ...starterProperties[0], id: `property-${Date.now()}`, name: "" });
              setStep("setup");
            }}>Add Property</Button>
          </div>
        </header>

        {step !== "dashboard" && (() => {
          const steps: [Step, string][] = [
            ["setup", "1. Your buying setup"],
            ["entry", "2. Property details"],
            ["comps", "3. Similar rentals"],
            ["confirm", "4. Check facts"],
            ["analysis", "5. Analysis"],
          ];
          const stepOrder: Step[] = steps.map(s => s[0]);
          const currentIdx = stepOrder.indexOf(step);
          return (
            <div className="flex flex-nowrap overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-2 rounded-xl border border-border/50 bg-card p-3 text-sm md:text-xs text-muted-foreground md:grid md:grid-cols-5">
              {steps.map(([id, label], idx) => {
                const isCompleted = idx < currentIdx;
                const isCurrent = id === step;
                return (
                  <button
                    key={id}
                    onClick={() => setStep(id)}
                    className={`shrink-0 snap-center min-w-[140px] md:min-w-0 rounded-md px-4 py-2.5 md:px-3 md:py-2 text-left transition-colors ${
                      isCurrent
                        ? "bg-foreground text-background font-medium"
                        : isCompleted
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "bg-background hover:bg-muted"
                    }`}
                  >
                    {isCompleted ? "\u2713 " : ""}{label}
                  </button>
                );
              })}
            </div>
          );
        })()}

        {step === "dashboard" && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Onboarding card */}
            <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This tool checks whether a rental property will make or lose money under realistic and worst-case conditions. Explore the sample properties below, use the quick calculator on the right, or click <strong>Add Property</strong> to analyse your own.
              </p>
            </div>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle style={{fontFamily: 'var(--font-serif)'}} className="text-xl">Comparison Dashboard</CardTitle>
                    <CardDescription className="mt-1">Properties ranked by downside protection before upside.</CardDescription>
                  </div>
                </div>
                {/* Sort pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {([
                    ["resilience", "Worst-case safety"],
                    ["overall", "Overall score"],
                    ["cashflow", "Monthly profit"],
                    ["yield", "Annual return"],
                    ["clean", "Low-risk"],
                  ] as [SortMode, string][]).map(([id, label]) => (
                    <button
                      key={id}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        sortBy === id
                          ? "bg-foreground text-background"
                          : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                      onClick={() => setSortBy(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {dashboardRows.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No properties yet.</p>
                    <Button className="mt-3" onClick={() => { setProperty({ ...starterProperties[0], id: `property-${Date.now()}`, name: "" }); setStep("setup"); }}>Add your first property</Button>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-8">#</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Asking price</TableHead>
                            <TableHead>Expected profit</TableHead>
                            <TableHead>Worst-case result</TableHead>
                            <TableHead>Verdict</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dashboardRows.map((row, index) => (
                            <TableRow
                              key={row.property.id}
                              className={`cursor-pointer border-l-4 ${verdictBorderColor(row.analysis.verdict)} hover:bg-muted/40 transition-colors`}
                              onClick={() => loadProperty(row.property.id)}
                            >
                              <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                              <TableCell>
                                <div className="font-medium">{row.property.name}</div>
                                <div className="text-xs text-muted-foreground">{row.property.microLocation}</div>
                              </TableCell>
                              <TableCell>{euro(row.property.askingPrice)}</TableCell>
                              <TableCell className={riskColor(row.analysis.baseCashFlow)}>
                                {euro(row.analysis.baseCashFlow)}/mo
                              </TableCell>
                              <TableCell>
                                <span className={riskColor(row.analysis.combined.monthlyCashFlow)}>
                                  {euro(row.analysis.combined.monthlyCashFlow)}/mo
                                </span>
                                <div className="mt-0.5 text-xs text-muted-foreground">{resilienceLabel(row.analysis.combined.resilienceCategory)}</div>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${verdictBadgeClasses(row.analysis.verdict)}`}>
                                  {verdictLabel(row.analysis.verdict)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card Stack */}
                    <div className="flex flex-col gap-4 md:hidden">
                      {dashboardRows.map((row, index) => (
                        <div 
                          key={row.property.id}
                          className={`flex flex-col gap-3 rounded-lg border-l-4 border-y border-r border-border/50 bg-card p-4 shadow-sm active:bg-muted/50 transition-colors ${verdictBorderColor(row.analysis.verdict)}`}
                          onClick={() => loadProperty(row.property.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
                                <span className="font-semibold text-foreground">{row.property.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">{row.property.microLocation}</div>
                            </div>
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 ml-2 ${verdictBadgeClasses(row.analysis.verdict)}`}>
                              {verdictLabel(row.analysis.verdict)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-1 border-t pt-3">
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Asking Price</div>
                              <div className="font-medium text-sm mt-0.5">{euro(row.property.askingPrice)}</div>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Expected Profit</div>
                              <div className={`font-medium text-sm mt-0.5 ${riskColor(row.analysis.baseCashFlow)}`}>{euro(row.analysis.baseCashFlow)}/mo</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Worst-Case Result</div>
                              <div className={`font-medium text-sm mt-0.5 flex items-baseline gap-2 ${riskColor(row.analysis.combined.monthlyCashFlow)}`}>
                                {euro(row.analysis.combined.monthlyCashFlow)}/mo 
                                <span className="text-muted-foreground font-normal text-xs">{resilienceLabel(row.analysis.combined.resilienceCategory)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle style={{fontFamily: 'var(--font-serif)'}} className="text-xl">Quick cash flow calculator</CardTitle>
                <CardDescription className="mt-1">Enter three simple numbers to see a quick estimate of your monthly profit before doing full research.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <NumberField label="Asking price" value={quickTriage.askingPrice} onChange={value => setQuickTriage({ ...quickTriage, askingPrice: value })} />
                <NumberField label="Expected monthly rent" value={quickTriage.expectedRent} onChange={value => setQuickTriage({ ...quickTriage, expectedRent: value })} />
                <NumberField label="Yearly building upkeep fees (service charge)" value={quickTriage.annualServiceCharge} onChange={value => setQuickTriage({ ...quickTriage, annualServiceCharge: value })} />
                <div className="rounded-xl border border-border/50 bg-accent/40 p-4">
                  <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Estimated monthly profit after income tax</div>
                  <div className={`mt-2 text-3xl font-semibold tracking-tight ${riskColor(quickResult.monthlyCashFlowByTaxRate[quickKey])}`}>
                    {euro(quickResult.monthlyCashFlowByTaxRate[quickKey])}/mo
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Uses typical default expenses. This is just a quick estimate until you verify the building details, tenancy laws, and actual rental proof.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "setup" && (
          <Card>
            <CardHeader>
              <CardTitle>Your buying budget and loan details</CardTitle>
              <CardDescription>Set the shared numbers used across every property model. Defaults are safe to leave in place for a first pass.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4">
                <NumberField label="Your budget (cash upfront)" value={assumptions.cashDeployed} onChange={value => setAssumptions({ ...assumptions, cashDeployed: value })} />
                <NumberField label="Bank interest rate (%)" value={assumptions.mortgageRate * 100} step={0.05} onChange={value => setAssumptions({ ...assumptions, mortgageRate: value / 100 })} />
                <NumberField label="Length of mortgage loan (years)" value={assumptions.mortgageTermYears} onChange={value => setAssumptions({ ...assumptions, mortgageTermYears: value })} />
                <NumberField label="Your income tax bracket (%)" value={assumptions.centralTaxRate * 100} onChange={value => setAssumptions({ ...assumptions, centralTaxRate: value / 100 })} />
              </div>
              <details className="rounded-lg border bg-background p-4">
                <summary className="cursor-pointer text-sm font-medium">Advanced assumptions</summary>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <NumberField label="Expected empty months per year" value={assumptions.vacancyMonthsBase} step={0.5} onChange={value => setAssumptions({ ...assumptions, vacancyMonthsBase: value })} />
                  <NumberField label="Yearly rental agency fee (%)" value={(assumptions.managementFeePct || 0) * 100} step={0.5} onChange={value => setAssumptions({ ...assumptions, managementFeePct: value / 100 })} />
                  <NumberField label="Stress test interest rate reference (%)" value={7} disabled onChange={() => undefined} />
                </div>
              </details>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("dashboard")}>Back</Button>
                <Button onClick={() => setStep("entry")}>Next: Enter Property Information</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "entry" && (
          <Card>
            <CardHeader>
              <CardTitle>Enter property information</CardTitle>
              <CardDescription>Capture the facts, how certain they are, and any risks that should change the decision.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <TextField label="Property name" value={property.name} onChange={value => updateProperty("name", value)} />
                <TextField label="Property website link" value={property.listingUrl} onChange={value => updateProperty("listingUrl", value)} />
                <NumberField label="Days listed online" value={property.daysOnMarket} onChange={value => updateProperty("daysOnMarket", value)} />
                <TextField label="Address" value={property.address} onChange={value => updateProperty("address", value)} />
                <TextField label="Specific street or block" value={property.microLocation} onChange={value => updateProperty("microLocation", value)} />
                <StatusField label="Street desirability confidence" value={property.microLocationStatus} onChange={value => updateProperty("microLocationStatus", value)} />
                <NumberField label="Asking price" value={property.askingPrice} onChange={value => updateProperty("askingPrice", value)} />
                <NumberField label="Expected monthly rent" value={property.expectedRent} onChange={value => updateProperty("expectedRent", value)} />
                <NumberField label="Yearly building upkeep fees (service charge)" value={property.annualServiceCharge} onChange={value => updateProperty("annualServiceCharge", value)} />
                <StatusField label="Upkeep fee confidence" value={property.serviceChargeStatus} onChange={value => updateProperty("serviceChargeStatus", value)} />
                <NumberField label="Bedrooms" value={property.beds} onChange={value => updateProperty("beds", value)} />
                <NumberField label="Bathrooms" value={property.baths} onChange={value => updateProperty("baths", value)} />
                <NumberField label="Property size (square meters)" value={property.sizeSqm} onChange={value => updateProperty("sizeSqm", value)} />
                <StatusField label="Size confidence" value={property.sizeStatus} onChange={value => updateProperty("sizeStatus", value)} />
                <TextField label="Building energy rating (BER)" value={property.ber} onChange={value => updateProperty("ber", value)} />
                <StatusField label="Energy rating confidence" value={property.berStatus} onChange={value => updateProperty("berStatus", value)} />
                <SelectField label="Occupancy status (tenancy)" value={property.tenancyStatus} options={["Vacant", "Tenanted", "Unknown"]} onChange={value => updateProperty("tenancyStatus", value as PropertyRecord["tenancyStatus"])} />
                <StatusField label="Occupancy confidence" value={property.tenancyStatusConfidence} onChange={value => updateProperty("tenancyStatusConfidence", value)} />
                <NumberField label="Previous rent (for legal limit checks)" value={property.previousRent} onChange={value => updateProperty("previousRent", value)} />
                <TextField label="Parking spaces" value={property.parking} onChange={value => updateProperty("parking", value)} />
                <TextField label="Floor level" value={property.floor} onChange={value => updateProperty("floor", value)} />
                <TextField label="Balcony or outdoor space" value={property.balcony} onChange={value => updateProperty("balcony", value)} />
              </div>
              <details className="rounded-lg border bg-background p-4">
                <summary className="cursor-pointer text-sm font-medium">Extra buying and yearly running costs</summary>
                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <NumberField label="Legal fees and setup" value={property.legalSetupCost} onChange={value => updateProperty("legalSetupCost", value)} />
                  <NumberField label="Furniture and staging" value={property.furnishingSetupCost} onChange={value => updateProperty("furnishingSetupCost", value)} />
                  <NumberField label="Refurbishment and repairs" value={property.refurbishmentCost} onChange={value => updateProperty("refurbishmentCost", value)} />
                  <NumberField label="Energy upgrade budget" value={property.berUpgradeCost} onChange={value => updateProperty("berUpgradeCost", value)} />
                  <NumberField label="Yearly basic maintenance" value={property.annualMaintenance} onChange={value => updateProperty("annualMaintenance", value)} />
                  <NumberField label="Yearly property insurance" value={property.annualInsurance} onChange={value => updateProperty("annualInsurance", value)} />
                  <NumberField label="Yearly accounting fees" value={property.annualAccountingCompliance} onChange={value => updateProperty("annualAccountingCompliance", value)} />
                  <NumberField label="Yearly agent tenant-finder fee" value={property.annualLettingFeeAmortised} onChange={value => updateProperty("annualLettingFeeAmortised", value)} />
                </div>
              </details>
              <TextField label="Building management company or safety issues" value={property.omcRiskNotes} onChange={value => updateProperty("omcRiskNotes", value)} />
              <TextField label="Other potential issues" value={property.riskNotes} onChange={value => updateProperty("riskNotes", value)} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("setup")}>Back</Button>
                <Button onClick={() => setStep("comps")}>Next: Rental Proof (Nearby Matches)</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "comps" && (
          <Card>
            <CardHeader>
              <CardTitle>Rental proof (nearby matches)</CardTitle>
              <CardDescription>Adding similar nearby rentals helps prove your expected rent is realistic and legal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-4">
                <TextField label="Proof source (link or note)" value={newComp.source || ""} onChange={value => setNewComp({ ...newComp, source: value })} />
                <TextField label="Comparable address or development" value={newComp.address || ""} onChange={value => setNewComp({ ...newComp, address: value })} />
                <NumberField label="Actual monthly rent" value={Number(newComp.rent || 0)} onChange={value => setNewComp({ ...newComp, rent: value })} />
                <div className="space-y-2">
                  <Label htmlFor={rentalMatchId}>Match similarity tier</Label>
                  <select
                    id={rentalMatchId}
                    className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                    value={newComp.tier || "C"}
                    onChange={event => setNewComp({ ...newComp, tier: event.target.value as RentComp["tier"] })}
                  >
                    <option value="A">Located in the exact same building</option>
                    <option value="B">Located in the same housing development</option>
                    <option value="C">Located in the same local street or neighborhood</option>
                    <option value="D">Located in the broader surrounding area</option>
                  </select>
                </div>
                <NumberField label="Bedrooms" value={Number(newComp.beds || property.beds)} onChange={value => setNewComp({ ...newComp, beds: value })} />
                <NumberField label="Bathrooms" value={Number(newComp.baths || property.baths)} onChange={value => setNewComp({ ...newComp, baths: value })} />
                <NumberField label="Property size (square meters)" value={Number(newComp.sizeSqm || property.sizeSqm)} onChange={value => setNewComp({ ...newComp, sizeSqm: value })} />
                <TextField label="Building energy rating (BER)" value={newComp.ber || property.ber} onChange={value => setNewComp({ ...newComp, ber: value })} />
                <TextField label="Parking spaces" value={newComp.parking || ""} onChange={value => setNewComp({ ...newComp, parking: value })} />
                <SelectField label="Located in the exact same building" value={newComp.sameBuilding ? "Yes" : "No"} options={["No", "Yes"]} onChange={value => setNewComp({ ...newComp, sameBuilding: value === "Yes" })} />
                <TextField label="Notes on differences" value={newComp.notes || ""} onChange={value => setNewComp({ ...newComp, notes: value })} />
                <div className="flex items-end">
                  <Button className="w-full" onClick={addComp}>Add Comparable Proof</Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comparable Address</TableHead>
                    <TableHead>Match Quality</TableHead>
                    <TableHead>Actual Rent</TableHead>
                    <TableHead>Property Facts</TableHead>
                    <TableHead>Adjustments / Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.comps.map(comp => (
                    <TableRow key={comp.id}>
                      <TableCell>{comp.address}</TableCell>
                      <TableCell><Badge variant="outline">{compTierLabel(comp.tier)}</Badge></TableCell>
                      <TableCell>{euro(comp.rent)}</TableCell>
                      <TableCell>{comp.beds} bed / {comp.baths} bath, {comp.sizeSqm} sqm, BER {comp.ber}</TableCell>
                      <TableCell>{comp.notes || "No adjustment noted"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="rounded-lg border bg-background p-4 text-sm">
                Reliability of your rent estimate: <Badge>{currentAnalysis.rentConfidence}</Badge>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("entry")}>Back</Button>
                <Button onClick={() => setStep("confirm")}>Next: Review and Confirm Your Data</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "confirm" && (
          <Card>
            <CardHeader>
              <CardTitle>Review and confirm your data</CardTitle>
              <CardDescription>Verify the status of each crucial fact to ensure your profit calculation is safe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Information</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Trust Level</TableHead>
                    <TableHead>Why it Matters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell><Badge>Confirmed</Badge></TableCell>
                    <TableCell>Needed to correctly compare this property with others.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Specific street or block</TableCell>
                    <TableCell>{property.microLocation}</TableCell>
                    <TableCell><InlineStatusSelect value={property.microLocationStatus} onChange={value => updateProperty("microLocationStatus", value)} /></TableCell>
                    <TableCell>Uncertain neighborhood details lower our trust in the market rent.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Property size</TableCell>
                    <TableCell>{property.sizeSqm} sqm</TableCell>
                    <TableCell><InlineStatusSelect value={property.sizeStatus} onChange={value => updateProperty("sizeStatus", value)} /></TableCell>
                    <TableCell>Not knowing size makes comparing prices less accurate.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Building energy rating (BER)</TableCell>
                    <TableCell>{property.ber}</TableCell>
                    <TableCell><InlineStatusSelect value={property.berStatus} onChange={value => updateProperty("berStatus", value)} /></TableCell>
                    <TableCell>Poor heating efficiency requires setting aside upgrade cash.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Yearly building upkeep fees (service charge)</TableCell>
                    <TableCell>{euro(property.annualServiceCharge)}</TableCell>
                    <TableCell><InlineStatusSelect value={property.serviceChargeStatus} onChange={value => updateProperty("serviceChargeStatus", value)} /></TableCell>
                    <TableCell>Unconfirmed building fees can eat into your monthly profits.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Occupancy status</TableCell>
                    <TableCell>{property.tenancyStatus}</TableCell>
                    <TableCell><InlineStatusSelect value={property.tenancyStatusConfidence} onChange={value => updateProperty("tenancyStatusConfidence", value)} /></TableCell>
                    <TableCell>Unconfirmed tenancy history could mean legal rent caps are hidden.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rental evidence</TableCell>
                    <TableCell>{currentAnalysis.rentConfidence}</TableCell>
                    <TableCell><Badge variant={currentAnalysis.rentConfidence === "High" ? "default" : "secondary"}>{compTierLabel(weakestCompTier(property.comps))}</Badge></TableCell>
                    <TableCell>Having strong proof nearby makes your rent projection highly trustworthy.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard title="Data completeness" value={`${currentAnalysis.scores.dataQualityScore}/10`} description={currentAnalysis.scores.rankingConfidence} />
                <SummaryCard title="Underwriter rules" value={verdictLabel(currentAnalysis.verdict)} description="We require confirmed facts and building documentation for a top recommendation" />
                <SummaryCard title="Unconfirmed items to verify" value={`${currentAnalysis.unresolvedRisks.length}`} description={readableRisks(currentAnalysis.unresolvedRisks) || "All crucial facts are verified"} />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("comps")}>Back</Button>
                <Button onClick={() => setStep("analysis")}>Run Analysis</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "analysis" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl tracking-tight" style={{fontFamily: 'var(--font-serif)'}}>{property.name || "Proposed property"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{property.address}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep("entry")}>Edit Details</Button>
                <Button variant="outline" onClick={() => setStep("confirm")}>Back</Button>
                <Button onClick={saveProperty}>Save to Dashboard</Button>
              </div>
            </div>

            {/* Hero metric: worst-case */}
            <Card className={`border-l-4 ${currentAnalysis.combined.monthlyCashFlow > 0 ? 'border-l-emerald-600' : currentAnalysis.combined.monthlyCashFlow >= -100 ? 'border-l-amber-500' : 'border-l-red-500'}`}>
              <CardContent className="flex flex-col gap-6 py-5 md:grid md:grid-cols-[1fr_1fr_1fr]">
                <div>
                  <div className="text-base font-medium">Worst-case monthly profit</div>
                  <div className={`mt-1 text-4xl font-semibold tracking-tight ${riskColor(currentAnalysis.combined.monthlyCashFlow)}`}>
                    {euro(currentAnalysis.combined.monthlyCashFlow)}/mo
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">If interest rates spike, the property sits empty, and upkeep costs rise all at once</p>
                </div>
                <div>
                  <div className="text-base font-medium">Expected monthly profit</div>
                  <div className={`mt-1 text-4xl font-semibold tracking-tight ${riskColor(currentAnalysis.baseCashFlow)}`}>
                    {euro(currentAnalysis.baseCashFlow)}/mo
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Cash left over after your estimated income tax</p>
                </div>
                <div>
                  <div className="text-base font-medium">Verdict</div>
                  <div className="mt-1">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${verdictBadgeClasses(currentAnalysis.verdict)}`}>
                      {verdictLabel(currentAnalysis.verdict)}
                    </span>
                  </div>
                  {currentAnalysis.unresolvedRisks.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                      {currentAnalysis.unresolvedRisks.map(risk => (
                        <li key={risk} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                          {readableRisk(risk)}
                        </li>
                      ))}
                    </ul>
                  )}
                  {currentAnalysis.unresolvedRisks.length === 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">All crucial facts are verified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Secondary metric cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <MetricCard title="Empty-month safety cushion" value={`${vacancyLimit.toFixed(1)} months`} description="How many months empty per year before you lose money" />
              <MetricCard title="Data completeness" value={`${currentAnalysis.scores.dataQualityScore}/10`} description={`${currentAnalysis.scores.rankingConfidence}. ${currentAnalysis.unresolvedRisks.length > 0 ? 'Missing: ' + currentAnalysis.unresolvedRisks.map(readableRisk).slice(0, 2).join(', ') : 'All key facts confirmed'}`} />
              <MetricCard title="Estimated annual return" value={pct(currentAnalysis.financial.economicRoiByTaxRate[currentAnalysis.centralKey])} description="Cash profit percentage return before any property price growth" />
              <MetricCard title="Mortgage loan amount" value={euro(currentAnalysis.financial.mortgageRequired)} description={`Mortgage size compared to price ${pct(currentAnalysis.financial.ltv)}`} />
              <MetricCard title="Opening offer guideline" value={euro(currentAnalysis.negotiation.openingPrice)} description={`${currentAnalysis.negotiation.acceptanceProbability} seller acceptance chance`} />
            </div>

            {/* Bottom Line synthesis */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <div className="text-base font-medium" style={{fontFamily: 'var(--font-serif)'}}>Bottom line</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {property.name || "This property"} earns an expected {euro(currentAnalysis.baseCashFlow)}/mo after tax, but under worst-case stress conditions (rate hikes, vacancy, rising costs) this drops to {euro(currentAnalysis.combined.monthlyCashFlow)}/mo — a {resilienceLabel(currentAnalysis.combined.resilienceCategory).toLowerCase()}.
                {currentAnalysis.unresolvedRisks.length > 0
                  ? ` Before making an offer, verify: ${currentAnalysis.unresolvedRisks.map(readableRisk).join(", ")}.`
                  : " All critical facts are verified and the property is ready for an offer."}
              </p>
              <p className="mt-2 text-xs text-muted-foreground italic">
                This is scenario analysis, not investment advice. Always verify with a solicitor, tax advisor, broker, and surveyor before making an offer.
              </p>
            </div>

            {/* Assumptions bar */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span>Interest rate: {(assumptions.mortgageRate * 100).toFixed(2)}%</span>
              <span>Tax bracket: {(assumptions.centralTaxRate * 100).toFixed(0)}%</span>
              <span>Vacancy: {assumptions.vacancyMonthsBase} months/year</span>
              <span>Loan term: {assumptions.mortgageTermYears} years</span>
              <button className="underline hover:text-foreground" onClick={() => setStep("setup")}>Change assumptions</button>
            </div>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle style={{fontFamily: 'var(--font-serif)'}} className="text-xl">Test a higher interest rate</CardTitle>
                <CardDescription className="mt-1">Drag the slider to see how rising bank interest rates instantly change your monthly profits.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-5 md:grid md:grid-cols-[1fr_240px]">
                <div>
                  <Label htmlFor={mortgageStressSliderId} className="text-sm font-medium">Bank interest rate: <span className="text-primary font-semibold">{(sliderRate * 100).toFixed(2)}%</span></Label>
                  <input
                    id={mortgageStressSliderId}
                    aria-label="Mortgage rate stress slider"
                    className="mt-3 w-full"
                    style={{accentColor: 'var(--palette-forestGreen600)'}}
                    type="range"
                    min="3"
                    max="8"
                    step="0.05"
                    value={sliderRate * 100}
                    onChange={event => setSliderRate(Number(event.target.value) / 100)}
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>3%</span>
                    <span>5.65% base</span>
                    <span>8%</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-accent/40 p-4">
                  <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Expected monthly profit at this rate</div>
                  <div className={`mt-2 text-3xl font-semibold tracking-tight ${riskColor(currentAnalysis.baseCashFlow)}`}>
                    {euro(currentAnalysis.baseCashFlow)}/mo
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="financials">
              <TabsList className="flex flex-wrap h-auto gap-2 max-w-full overflow-x-auto justify-start hide-scrollbar bg-transparent">
                <TabsTrigger value="financials">Profit Breakdown</TabsTrigger>
                <TabsTrigger value="stress">Worst-Case Stress Tests</TabsTrigger>
                <TabsTrigger value="scoring">Risk Footprint</TabsTrigger>
                <TabsTrigger value="negotiation">Negotiation Strategy</TabsTrigger>
                <TabsTrigger value="report">Final Summary Report</TabsTrigger>
              </TabsList>
              <TabsContent value="financials" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>Profit Breakdown Details</CardTitle></CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    <Fact label="Total upfront cash needed to buy" value={euro(currentAnalysis.financial.totalAcquisitionCost)} />
                    <Fact label="Government buying tax (Stamp Duty)" value={euro(stampDuty(property.askingPrice))} />
                    <Fact label="Expected yearly rent (if fully occupied)" value={euro(currentAnalysis.financial.annualHeadlineRent)} />
                    <Fact label="Yearly rent (minus normal empty weeks)" value={euro(currentAnalysis.financial.vacancyAdjustedRent)} />
                    <Fact label="Year one mortgage interest paid" value={euro(currentAnalysis.financial.yearOneInterest)} />
                    <Fact label="Year one mortgage debt paid down" value={euro(currentAnalysis.financial.yearOnePrincipal)} />
                    <Fact label="Minimum rent needed to avoid losing money" value={`${euro(currentAnalysis.financial.breakEvenRent)}/mo`} />
                    <Fact label="Rent-to-mortgage safety ratio" value={`${currentAnalysis.financial.dscr.toFixed(2)} (above 1.2 is safe, above 2.0 is strong)`} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="stress" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>Safety Stress Test Matrix</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Stress Scenario</TableHead>
                          <TableHead>Monthly profit/loss</TableHead>
                          <TableHead>Rent-to-mortgage safety ratio</TableHead>
                          <TableHead>Safety Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentAnalysis.stress.map(item => (
                          <TableRow key={item.scenarioId}>
                            <TableCell>{item.scenarioId}. {item.name}</TableCell>
                            <TableCell className={riskColor(item.monthlyCashFlow)}>{euro(item.monthlyCashFlow)}</TableCell>
                            <TableCell>{item.dscr.toFixed(2)}</TableCell>
                            <TableCell>{resilienceLabel(item.resilienceCategory)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="scoring" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Footprint Details</CardTitle>
                    <CardDescription>Scores across key risk categories. Higher scores mean safer investments.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="h-[360px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} outerRadius="78%">
                          <PolarGrid />
                          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} />
                          <Radar dataKey="score" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.18} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      <Fact label="Basic risk score" value={`${currentAnalysis.scores.rawQualitativeScore}/10`} />
                      <Fact label="Worst-case safety score" value={`${currentAnalysis.scores.resilienceWeightedScore}/10`} />
                      <Fact label="Overall underwriter score" value={`${currentAnalysis.scores.overallRiskAdjustedScore}/10`} />
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium">Specific risk flags detected</div>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                          {(currentAnalysis.scores.riskFlags.length ? currentAnalysis.scores.riskFlags : ["No automatic safety flags detected."]).map(flag => (
                            <li key={flag}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="negotiation" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>Negotiation Strategy</CardTitle></CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-4">
                      <SummaryCard title="Starting Offer" value={euro(currentAnalysis.negotiation.openingPrice)} description="Your opening price to the seller" />
                      <SummaryCard title="Fair Price" value={euro(currentAnalysis.negotiation.targetPrice)} description="Fair price based on building quality" />
                      <SummaryCard title="Maximum (if docs are clean)" value={euro(currentAnalysis.negotiation.stretchPrice)} description="Highest price if all documents check out" />
                      <SummaryCard title="Walk-Away Limit" value={euro(currentAnalysis.negotiation.walkAwayPrice)} description="Do not pay more than this" />
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Offer scenario</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Discount off asking price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentAnalysis.negotiation.priceSensitivity.map(row => (
                          <TableRow key={row.label}>
                            <TableCell>{row.label}</TableCell>
                            <TableCell>{euro(row.price)}</TableCell>
                            <TableCell>{pct(row.discountToAsking)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <pre className="whitespace-pre-wrap rounded-xl p-5 text-sm leading-relaxed" style={{background: 'var(--palette-forestGreen600)', color: 'var(--palette-brightIvory50)' }}>
                      {currentAnalysis.negotiation.agentScript}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="report" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Property Underwriting Report</CardTitle>
                      <CardDescription>Clear property report generated directly from verified facts and financial formulas.</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText(reportMarkdown(property, currentAnalysis, vacancyLimit));
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                    >
                      {isCopied ? "Copied to Clipboard" : "Copy Report"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <article className="prose prose-neutral max-w-none dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{reportMarkdown(property, currentAnalysis, vacancyLimit)}</ReactMarkdown>
                    </article>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === "dashboard" && selectedProperty && (
          <Card>
            <CardHeader>
              <CardTitle>Selected property review: {selectedProperty.name}</CardTitle>
              <CardDescription>{selectedProperty.riskNotes}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <SummaryCard title="Worst-case profit" value={euro(selectedAnalysis.combined.monthlyCashFlow)} description={resilienceLabel(selectedAnalysis.combined.resilienceCategory)} />
              <SummaryCard title="Overall safety score" value={`${selectedAnalysis.scores.overallRiskAdjustedScore}/10`} description="Focused heavily on capital safety" />
              <SummaryCard title="Rent proof trust level" value={selectedAnalysis.rentConfidence} description="Based on local verified proof" />
              <SummaryCard title="Next safety step" value="Verify documents" description={readableRisks(selectedAnalysis.unresolvedRisks) || "Collect standard management documents"} />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  disabled?: boolean;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        disabled={disabled}
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={event => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={event => onChange(event.target.value)} />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm" value={value} onChange={event => onChange(event.target.value)}>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function StatusField({ label, value, onChange }: { label: string; value: DataStatus; onChange: (value: DataStatus) => void }) {
  return <SelectField label={label} value={value} options={["Confirmed", "Estimated", "Unknown"]} onChange={value => onChange(value as DataStatus)} />;
}

function InlineStatusSelect({ value, onChange }: { value: DataStatus; onChange: (value: DataStatus) => void }) {
  const id = useId();

  return (
    <select
      id={id}
      aria-label="Fact confidence"
      className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
      value={value}
      onChange={event => onChange(event.target.value as DataStatus)}
    >
      <option value="Confirmed">Confirmed</option>
      <option value="Estimated">Estimated</option>
      <option value="Unknown">Unknown</option>
    </select>
  );
}

function MetricCard({ title, value, description, className = "" }: { title: string; value: string; description: string; className?: string }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${className}`}>{value}</div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{description}</div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
