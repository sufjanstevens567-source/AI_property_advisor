"use client";

import { useId, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
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
    A: "Same building",
    B: "Same development",
    C: "Same local area",
    D: "Broader area",
    None: "No rental evidence yet",
  };

  return labels[tier];
}

function readableRisk(risk: string): string {
  const labels: Record<string, string> = {
    OMC: "Management company documents",
    RTB: "Rent history / legal rent",
    BER: "Energy rating upgrade",
    "Service charge": "Annual management charge",
    "Rent evidence": "Similar rental evidence",
    Tenancy: "Tenancy status",
  };

  return labels[risk] ?? risk;
}

function readableRisks(risks: string[]): string {
  return risks.map(readableRisk).join(", ");
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

function reportMarkdown(property: PropertyRecord, analysis: ReturnType<typeof analyseProperty>, vacancyLimit: number): string {
  return `# Underwriting Report: ${property.name}

## 1. Decision Summary

**Decision:** ${analysis.verdict === "Buy" ? "Strong candidate" : analysis.verdict === "Conditional Buy" ? "Conditional candidate" : analysis.verdict}

**Asking price:** ${euro(property.askingPrice)}

**Monthly cash flow after 30% tax:** ${euro(analysis.baseCashFlow)}

**Combined downside cash flow:** ${euro(analysis.combined.monthlyCashFlow)} per month (${analysis.combined.resilienceCategory})

**Data confidence:** ${analysis.scores.dataQualityScore}/10 (${analysis.scores.rankingConfidence})

**Main items to verify:** ${readableRisks(analysis.unresolvedRisks) || "Standard property documents"}

This is screening and scenario analysis, not investment advice. Verify assumptions with a solicitor, tax advisor, broker, surveyor, and owners' management company documentation before making an offer.

## 2. Property & Listing Facts

${property.address}. ${property.beds} bed / ${property.baths} bath, ${property.sizeSqm || "unknown"} sqm, energy rating (BER) ${property.ber}. Annual management/service charge status: ${property.serviceChargeStatus}. Tenancy status: ${property.tenancyStatus}.

## 3. Financial Model

- Total acquisition cost: ${euro(analysis.financial.totalAcquisitionCost)}
- Mortgage required: ${euro(analysis.financial.mortgageRequired)}
- Monthly mortgage: ${euro(analysis.financial.monthlyMortgagePayment)}
- Minimum rent needed to avoid losing cash: ${euro(analysis.financial.breakEvenRent)} per month
- Empty-month cushion before cash flow turns negative: ${vacancyLimit.toFixed(1)} months
- Estimated annual return at 30% tax: ${pct(analysis.financial.economicRoiByTaxRate[analysis.centralKey])}

## 4. Rent Evidence & Confidence

Confidence in the rent estimate is **${analysis.rentConfidence}**. Weak rental evidence reduces ranking confidence until same-building, same-development, or multiple same-area rental examples are entered.

## 5. Stress Tests & Sensitivity

The combined downside test applies rent -10%, costs +25%, two months empty, and a 7% mortgage rate. The severe downside test applies rent -15%, costs +25%, three months empty, and an 8% rate.

## 6. Qualitative Risk Scoring

Overall risk score: **${analysis.scores.overallRiskAdjustedScore}/10**.

Risk flags:
${analysis.scores.riskFlags.map(flag => `- ${flag}`).join("\n") || "- No automatic scoring flags."}

## 7. Negotiation Strategy

- Opening offer: ${euro(analysis.negotiation.openingPrice)}
- Target price: ${euro(analysis.negotiation.targetPrice)}
- Highest acceptable price: ${euro(analysis.negotiation.stretchPrice)}
- Maximum price: ${euro(analysis.negotiation.walkAwayPrice)}
- Estimated chance the seller accepts: ${analysis.negotiation.acceptanceProbability}

${analysis.negotiation.agentScript}

## 8. Documents To Verify

- Request owners' management company accounts, meeting notes, repair reserve balance, insurance schedule, and levy history.
- Verify rent history and that the modelled rent is legally chargeable.
- Confirm service charge, energy-rating certificate, survey findings, and lender comfort.
- Re-run the model after any rent, service-charge, management-company, energy-rating, or price changes.`;
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
    <main className="min-h-screen bg-muted/30 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Check the risks before chasing returns</p>
            <h1 className="text-3xl font-semibold tracking-normal">Irish Rental Property Underwriter</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("dashboard")}>Dashboard</Button>
            <Button onClick={() => {
              setProperty({ ...starterProperties[0], id: `property-${Date.now()}`, name: "" });
              setStep("setup");
            }}>Add Property</Button>
          </div>
        </header>

        {step !== "dashboard" && (
          <div className="grid gap-2 rounded-lg border bg-card p-3 text-xs text-muted-foreground md:grid-cols-5">
            {[
              ["setup", "1. Your buying assumptions"],
              ["entry", "2. Property details"],
              ["comps", "3. Similar rentals"],
              ["confirm", "4. Check facts"],
              ["analysis", "5. Analysis"],
            ].map(([id, label]) => (
              <div
                key={id}
                className={`rounded-md px-3 py-2 ${step === id ? "bg-foreground text-background" : "bg-background"}`}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        {step === "dashboard" && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Comparison Dashboard</CardTitle>
                    <CardDescription>Confirmed properties rank by downside protection before upside.</CardDescription>
                  </div>
                  <select
                    className="h-9 rounded-lg border bg-background px-3 text-sm"
                    value={sortBy}
                    onChange={event => setSortBy(event.target.value as SortMode)}
                  >
                    <option value="resilience">Combined downside resilience</option>
                    <option value="overall">Overall score</option>
                    <option value="cashflow">Monthly cash flow</option>
                    <option value="yield">Estimated annual return</option>
                    <option value="clean">Clean candidates</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Cash flow after tax</TableHead>
                      <TableHead>Combined downside</TableHead>
                      <TableHead>Empty-month cushion</TableHead>
                      <TableHead>Data confidence</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardRows.map(row => (
                      <TableRow key={row.property.id}>
                        <TableCell>
                          <div className="font-medium">{row.property.name}</div>
                          <div className="text-xs text-muted-foreground">{row.property.microLocation}</div>
                        </TableCell>
                        <TableCell>{euro(row.property.askingPrice)}</TableCell>
                        <TableCell className={riskColor(row.analysis.baseCashFlow)}>{euro(row.analysis.baseCashFlow)}</TableCell>
                        <TableCell>
                          <span className={riskColor(row.analysis.combined.monthlyCashFlow)}>
                            {euro(row.analysis.combined.monthlyCashFlow)}
                          </span>
                          <Badge variant="outline" className="ml-2">{row.analysis.combined.resilienceCategory}</Badge>
                        </TableCell>
                        <TableCell>{row.vacancyLimit.toFixed(1)} months</TableCell>
                        <TableCell>{row.analysis.scores.dataQualityScore}/10</TableCell>
                        <TableCell>
                          <Badge variant={row.analysis.verdict === "Buy" ? "default" : row.analysis.verdict === "Avoid" ? "destructive" : "secondary"}>
                            {row.analysis.verdict}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => loadProperty(row.property.id)}>View analysis</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>First-pass estimate</CardTitle>
                <CardDescription>Enter three numbers to get a rough cash-flow read before full underwriting.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NumberField label="Asking price" value={quickTriage.askingPrice} onChange={value => setQuickTriage({ ...quickTriage, askingPrice: value })} />
                <NumberField label="Expected rent per month" value={quickTriage.expectedRent} onChange={value => setQuickTriage({ ...quickTriage, expectedRent: value })} />
                <NumberField label="Annual management/service charge" value={quickTriage.annualServiceCharge} onChange={value => setQuickTriage({ ...quickTriage, annualServiceCharge: value })} />
                <div className="rounded-lg border bg-background p-4">
                  <div className="text-sm text-muted-foreground">Rough monthly cash flow after 30% tax</div>
                  <div className={`mt-1 text-3xl font-semibold ${riskColor(quickResult.monthlyCashFlowByTaxRate[quickKey])}`}>
                    {euro(quickResult.monthlyCashFlowByTaxRate[quickKey])}/mo
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Uses default costs. Treat this as a screening estimate until the property facts, rent evidence, and documents are checked.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "setup" && (
          <Card>
            <CardHeader>
              <CardTitle>Your buying assumptions</CardTitle>
              <CardDescription>Set the shared numbers used across every property model. Defaults are safe to leave in place for a first pass.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4">
                <NumberField label="Cash available for this purchase" value={assumptions.cashDeployed} onChange={value => setAssumptions({ ...assumptions, cashDeployed: value })} />
                <NumberField label="Mortgage rate (%)" value={assumptions.mortgageRate * 100} step={0.05} onChange={value => setAssumptions({ ...assumptions, mortgageRate: value / 100 })} />
                <NumberField label="Mortgage term in years" value={assumptions.mortgageTermYears} onChange={value => setAssumptions({ ...assumptions, mortgageTermYears: value })} />
                <NumberField label="Main tax assumption (%)" value={assumptions.centralTaxRate * 100} onChange={value => setAssumptions({ ...assumptions, centralTaxRate: value / 100 })} />
              </div>
              <details className="rounded-lg border bg-background p-4">
                <summary className="cursor-pointer text-sm font-medium">Advanced assumptions</summary>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <NumberField label="Expected empty months per year" value={assumptions.vacancyMonthsBase} step={0.5} onChange={value => setAssumptions({ ...assumptions, vacancyMonthsBase: value })} />
                  <NumberField label="Management fee (%)" value={(assumptions.managementFeePct || 0) * 100} step={0.5} onChange={value => setAssumptions({ ...assumptions, managementFeePct: value / 100 })} />
                  <NumberField label="Downside mortgage-rate reference (%)" value={7} disabled onChange={() => undefined} />
                </div>
              </details>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("dashboard")}>Back</Button>
                <Button onClick={() => setStep("entry")}>Next: Property Details</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "entry" && (
          <Card>
            <CardHeader>
              <CardTitle>Add property details</CardTitle>
              <CardDescription>Capture the facts, how certain they are, and any risks that should change the decision.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <TextField label="Property name" value={property.name} onChange={value => updateProperty("name", value)} />
                <TextField label="Listing URL" value={property.listingUrl} onChange={value => updateProperty("listingUrl", value)} />
                <NumberField label="Days on market" value={property.daysOnMarket} onChange={value => updateProperty("daysOnMarket", value)} />
                <TextField label="Address" value={property.address} onChange={value => updateProperty("address", value)} />
                <TextField label="Exact local area" value={property.microLocation} onChange={value => updateProperty("microLocation", value)} />
                <StatusField label="Local-area confidence" value={property.microLocationStatus} onChange={value => updateProperty("microLocationStatus", value)} />
                <NumberField label="Asking price" value={property.askingPrice} onChange={value => updateProperty("askingPrice", value)} />
                <NumberField label="Expected rent per month" value={property.expectedRent} onChange={value => updateProperty("expectedRent", value)} />
                <NumberField label="Annual management/service charge" value={property.annualServiceCharge} onChange={value => updateProperty("annualServiceCharge", value)} />
                <StatusField label="Service-charge confidence" value={property.serviceChargeStatus} onChange={value => updateProperty("serviceChargeStatus", value)} />
                <NumberField label="Beds" value={property.beds} onChange={value => updateProperty("beds", value)} />
                <NumberField label="Baths" value={property.baths} onChange={value => updateProperty("baths", value)} />
                <NumberField label="Size sqm" value={property.sizeSqm} onChange={value => updateProperty("sizeSqm", value)} />
                <StatusField label="Size status" value={property.sizeStatus} onChange={value => updateProperty("sizeStatus", value)} />
                <TextField label="Energy rating (BER)" value={property.ber} onChange={value => updateProperty("ber", value)} />
                <StatusField label="Energy-rating confidence" value={property.berStatus} onChange={value => updateProperty("berStatus", value)} />
                <SelectField label="Tenancy" value={property.tenancyStatus} options={["Vacant", "Tenanted", "Unknown"]} onChange={value => updateProperty("tenancyStatus", value as PropertyRecord["tenancyStatus"])} />
                <StatusField label="Tenancy-status confidence" value={property.tenancyStatusConfidence} onChange={value => updateProperty("tenancyStatusConfidence", value)} />
                <NumberField label="Previous rent" value={property.previousRent} onChange={value => updateProperty("previousRent", value)} />
                <TextField label="Parking" value={property.parking} onChange={value => updateProperty("parking", value)} />
                <TextField label="Floor" value={property.floor} onChange={value => updateProperty("floor", value)} />
                <TextField label="Balcony / terrace" value={property.balcony} onChange={value => updateProperty("balcony", value)} />
              </div>
              <details className="rounded-lg border bg-background p-4">
                <summary className="cursor-pointer text-sm font-medium">Advanced acquisition and operating costs</summary>
                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <NumberField label="Legal/setup" value={property.legalSetupCost} onChange={value => updateProperty("legalSetupCost", value)} />
                  <NumberField label="Furnishing/setup" value={property.furnishingSetupCost} onChange={value => updateProperty("furnishingSetupCost", value)} />
                  <NumberField label="Refurbishment" value={property.refurbishmentCost} onChange={value => updateProperty("refurbishmentCost", value)} />
                  <NumberField label="Energy-upgrade budget" value={property.berUpgradeCost} onChange={value => updateProperty("berUpgradeCost", value)} />
                  <NumberField label="Maintenance" value={property.annualMaintenance} onChange={value => updateProperty("annualMaintenance", value)} />
                  <NumberField label="Insurance" value={property.annualInsurance} onChange={value => updateProperty("annualInsurance", value)} />
                  <NumberField label="Accounting" value={property.annualAccountingCompliance} onChange={value => updateProperty("annualAccountingCompliance", value)} />
                  <NumberField label="Letting fee amortised" value={property.annualLettingFeeAmortised} onChange={value => updateProperty("annualLettingFeeAmortised", value)} />
                </div>
              </details>
              <TextField label="Management company and building risks" value={property.omcRiskNotes} onChange={value => updateProperty("omcRiskNotes", value)} />
              <TextField label="Other risk notes" value={property.riskNotes} onChange={value => updateProperty("riskNotes", value)} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("setup")}>Back</Button>
                <Button onClick={() => setStep("comps")}>Next: Similar Rentals</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "comps" && (
          <Card>
            <CardHeader>
              <CardTitle>Similar rental listings</CardTitle>
              <CardDescription>Better rental matches increase confidence in the rent estimate and ranking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-4">
                <TextField label="Source URL / note" value={newComp.source || ""} onChange={value => setNewComp({ ...newComp, source: value })} />
                <TextField label="Address / development" value={newComp.address || ""} onChange={value => setNewComp({ ...newComp, address: value })} />
                <NumberField label="Rent per month" value={Number(newComp.rent || 0)} onChange={value => setNewComp({ ...newComp, rent: value })} />
                <div className="space-y-2">
                  <Label htmlFor={rentalMatchId}>Rental match quality</Label>
                  <select
                    id={rentalMatchId}
                    className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                    value={newComp.tier || "C"}
                    onChange={event => setNewComp({ ...newComp, tier: event.target.value as RentComp["tier"] })}
                  >
                    <option value="A">Same building</option>
                    <option value="B">Same development</option>
                    <option value="C">Same local area</option>
                    <option value="D">Broader area only</option>
                  </select>
                </div>
                <NumberField label="Beds" value={Number(newComp.beds || property.beds)} onChange={value => setNewComp({ ...newComp, beds: value })} />
                <NumberField label="Baths" value={Number(newComp.baths || property.baths)} onChange={value => setNewComp({ ...newComp, baths: value })} />
                <NumberField label="Size sqm" value={Number(newComp.sizeSqm || property.sizeSqm)} onChange={value => setNewComp({ ...newComp, sizeSqm: value })} />
                <TextField label="Energy rating (BER)" value={newComp.ber || property.ber} onChange={value => setNewComp({ ...newComp, ber: value })} />
                <TextField label="Parking" value={newComp.parking || ""} onChange={value => setNewComp({ ...newComp, parking: value })} />
                <SelectField label="Same building" value={newComp.sameBuilding ? "Yes" : "No"} options={["No", "Yes"]} onChange={value => setNewComp({ ...newComp, sameBuilding: value === "Yes" })} />
                <TextField label="Adjustment notes" value={newComp.notes || ""} onChange={value => setNewComp({ ...newComp, notes: value })} />
                <div className="flex items-end">
                  <Button className="w-full" onClick={addComp}>Add Comparable</Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comp</TableHead>
                    <TableHead>Similarity</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Facts</TableHead>
                    <TableHead>Notes</TableHead>
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
                Confidence in rent estimate: <Badge>{currentAnalysis.rentConfidence}</Badge>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("entry")}>Back</Button>
                <Button onClick={() => setStep("confirm")}>Next: Check Facts</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "confirm" && (
          <Card>
            <CardHeader>
              <CardTitle>Check and confirm facts</CardTitle>
              <CardDescription>Mark each important fact as confirmed, estimated, or unknown before analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell><Badge>Confirmed</Badge></TableCell>
                    <TableCell>Needed before a property enters the main ranking.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Exact local area</TableCell>
                    <TableCell>{property.microLocation}</TableCell>
                    <TableCell><InlineStatusSelect value={property.microLocationStatus} onChange={value => updateProperty("microLocationStatus", value)} /></TableCell>
                    <TableCell>Uncertain location makes the score more conservative.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Size</TableCell>
                    <TableCell>{property.sizeSqm} sqm</TableCell>
                    <TableCell><InlineStatusSelect value={property.sizeStatus} onChange={value => updateProperty("sizeStatus", value)} /></TableCell>
                    <TableCell>Unknown size lowers data confidence.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Energy rating (BER)</TableCell>
                    <TableCell>{property.ber}</TableCell>
                    <TableCell><InlineStatusSelect value={property.berStatus} onChange={value => updateProperty("berStatus", value)} /></TableCell>
                    <TableCell>D/E ratings need an upgrade budget and rent-risk check.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annual management/service charge</TableCell>
                    <TableCell>{euro(property.annualServiceCharge)}</TableCell>
                    <TableCell><InlineStatusSelect value={property.serviceChargeStatus} onChange={value => updateProperty("serviceChargeStatus", value)} /></TableCell>
                    <TableCell>Estimated or unknown charges trigger conservative sensitivity.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tenancy status</TableCell>
                    <TableCell>{property.tenancyStatus}</TableCell>
                    <TableCell><InlineStatusSelect value={property.tenancyStatusConfidence} onChange={value => updateProperty("tenancyStatusConfidence", value)} /></TableCell>
                    <TableCell>Unknown tenancy raises rent-history and legal-rent risk.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rental evidence</TableCell>
                    <TableCell>{currentAnalysis.rentConfidence}</TableCell>
                    <TableCell><Badge variant={currentAnalysis.rentConfidence === "High" ? "default" : "secondary"}>{compTierLabel(weakestCompTier(property.comps))}</Badge></TableCell>
                    <TableCell>Same-building, same-development, or multiple same-area rentals improve confidence.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard title="Data confidence" value={`${currentAnalysis.scores.dataQualityScore}/10`} description={currentAnalysis.scores.rankingConfidence} />
                <SummaryCard title="Decision rule" value={currentAnalysis.verdict} description="No strong candidate with unresolved rent, management-company, or data gaps" />
                <SummaryCard title="Items to verify" value={`${currentAnalysis.unresolvedRisks.length}`} description={readableRisks(currentAnalysis.unresolvedRisks) || "No automatic risk gates"} />
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
                <h2 className="text-2xl font-semibold">{property.name || "Proposed property"}</h2>
                <p className="text-sm text-muted-foreground">{property.address}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("confirm")}>Back</Button>
                <Button onClick={saveProperty}>Save Property</Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard title="Combined downside cash flow" value={`${euro(currentAnalysis.combined.monthlyCashFlow)}/mo`} description="Rent down, costs up, two months empty, 7% rate" className={riskColor(currentAnalysis.combined.monthlyCashFlow)} />
              <MetricCard title="Empty-month cushion" value={`${vacancyLimit.toFixed(1)} months`} description="Months empty before cash flow turns negative" />
              <MetricCard title="Monthly cash flow after tax" value={`${euro(currentAnalysis.baseCashFlow)}/mo`} description="After the main 30% tax assumption" className={riskColor(currentAnalysis.baseCashFlow)} />
              <MetricCard title="Data confidence" value={`${currentAnalysis.scores.dataQualityScore}/10`} description={currentAnalysis.scores.rankingConfidence} />
              <MetricCard title="Estimated annual return" value={pct(currentAnalysis.financial.economicRoiByTaxRate[currentAnalysis.centralKey])} description="Before property-price growth" />
              <MetricCard title="Mortgage required" value={euro(currentAnalysis.financial.mortgageRequired)} description={`Loan-to-value ${pct(currentAnalysis.financial.ltv)}`} />
              <MetricCard title="Opening offer" value={euro(currentAnalysis.negotiation.openingPrice)} description={`${currentAnalysis.negotiation.acceptanceProbability} acceptance probability`} />
              <MetricCard title="Decision" value={currentAnalysis.verdict} description={readableRisks(currentAnalysis.unresolvedRisks) || "No automatic gates"} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Test a higher mortgage rate</CardTitle>
                <CardDescription>Move the rate and watch formula-based cash flow update immediately. No AI changes these numbers.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-[1fr_240px]">
                <div>
                  <Label htmlFor={mortgageStressSliderId}>Mortgage rate: {(sliderRate * 100).toFixed(2)}%</Label>
                  <input
                    id={mortgageStressSliderId}
                    aria-label="Mortgage rate stress slider"
                    className="mt-3 w-full accent-foreground"
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
                <div className="rounded-lg border bg-background p-4">
                  <div className="text-sm text-muted-foreground">Cash flow at selected rate</div>
                  <div className={`mt-1 text-3xl font-semibold ${riskColor(currentAnalysis.baseCashFlow)}`}>
                    {euro(currentAnalysis.baseCashFlow)}/mo
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="financials">
              <TabsList className="flex-wrap">
                <TabsTrigger value="financials">Numbers</TabsTrigger>
                <TabsTrigger value="stress">Downside Tests</TabsTrigger>
                <TabsTrigger value="scoring">Risk Profile</TabsTrigger>
                <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
                <TabsTrigger value="report">Report</TabsTrigger>
              </TabsList>
              <TabsContent value="financials" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>Financial Breakdown</CardTitle></CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    <Fact label="Total acquisition cost" value={euro(currentAnalysis.financial.totalAcquisitionCost)} />
                    <Fact label="Stamp duty" value={euro(stampDuty(property.askingPrice))} />
                    <Fact label="Full annual rent before vacancy" value={euro(currentAnalysis.financial.annualHeadlineRent)} />
                    <Fact label="Rent after expected empty period" value={euro(currentAnalysis.financial.vacancyAdjustedRent)} />
                    <Fact label="Year-one interest" value={euro(currentAnalysis.financial.yearOneInterest)} />
                    <Fact label="Year-one principal" value={euro(currentAnalysis.financial.yearOnePrincipal)} />
                    <Fact label="Minimum rent needed to avoid losing cash" value={`${euro(currentAnalysis.financial.breakEvenRent)}/mo`} />
                    <Fact label="Rent cover ratio" value={currentAnalysis.financial.dscr.toFixed(2)} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="stress" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>Downside Test Matrix</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Scenario</TableHead>
                          <TableHead>Monthly cash flow</TableHead>
                          <TableHead>Rent cover ratio</TableHead>
                          <TableHead>Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentAnalysis.stress.map(item => (
                          <TableRow key={item.scenarioId}>
                            <TableCell>{item.scenarioId}. {item.name}</TableCell>
                            <TableCell className={riskColor(item.monthlyCashFlow)}>{euro(item.monthlyCashFlow)}</TableCell>
                            <TableCell>{item.dscr.toFixed(2)}</TableCell>
                            <TableCell>{item.resilienceCategory}</TableCell>
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
                    <CardTitle>Risk Profile</CardTitle>
                    <CardDescription>Plain-English scores across the main risk areas. Higher is better.</CardDescription>
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
                      <Fact label="Raw risk score" value={`${currentAnalysis.scores.rawQualitativeScore}/10`} />
                      <Fact label="Downside-protection score" value={`${currentAnalysis.scores.resilienceWeightedScore}/10`} />
                      <Fact label="Overall score" value={`${currentAnalysis.scores.overallRiskAdjustedScore}/10`} />
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium">Risk flags</div>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                          {(currentAnalysis.scores.riskFlags.length ? currentAnalysis.scores.riskFlags : ["No automatic scoring flags."]).map(flag => (
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
                      <SummaryCard title="Opening" value={euro(currentAnalysis.negotiation.openingPrice)} description="Rounded buyer anchor" />
                      <SummaryCard title="Target" value={euro(currentAnalysis.negotiation.targetPrice)} description="Risk-adjusted model price" />
                      <SummaryCard title="Highest acceptable" value={euro(currentAnalysis.negotiation.stretchPrice)} description="Only after documents check out" />
                      <SummaryCard title="Maximum price" value={euro(currentAnalysis.negotiation.walkAwayPrice)} description="Do not exceed" />
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Price point</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Discount</TableHead>
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
                    <pre className="whitespace-pre-wrap rounded-lg bg-foreground p-4 text-sm text-background">
                      {currentAnalysis.negotiation.agentScript}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="report" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Underwriting Report</CardTitle>
                    <CardDescription>Readable report built from formula-based numbers and confirmed facts.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <article className="prose prose-neutral max-w-none dark:prose-invert">
                      <ReactMarkdown>{reportMarkdown(property, currentAnalysis, vacancyLimit)}</ReactMarkdown>
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
              <CardTitle>Selected property summary: {selectedProperty.name}</CardTitle>
              <CardDescription>{selectedProperty.riskNotes}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <SummaryCard title="Combined downside" value={euro(selectedAnalysis.combined.monthlyCashFlow)} description={selectedAnalysis.combined.resilienceCategory} />
              <SummaryCard title="Overall score" value={`${selectedAnalysis.scores.overallRiskAdjustedScore}/10`} description="Weighted toward downside protection" />
              <SummaryCard title="Rent confidence" value={selectedAnalysis.rentConfidence} description="Based on similar rental evidence" />
              <SummaryCard title="Next action" value="Verify documents" description={readableRisks(selectedAnalysis.unresolvedRisks) || "Standard management-company pack"} />
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${className}`}>{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
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
