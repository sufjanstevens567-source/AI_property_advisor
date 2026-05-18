export type NegotiationVerdict = "Buy" | "Conditional Buy" | "Marginal" | "Avoid";

export type NegotiationInputs = {
  askingPrice: number;
  daysOnMarket: number;
  dataQualityScore: number;
  verdict: NegotiationVerdict;
  priceForTargetReturns: number;
  priceForBreakEven: number;
  combinedStressCashFlow: number;
  unresolvedRisks?: Array<"OMC" | "RTB" | "BER" | "Service charge" | "Rent evidence" | "Tenancy">;
};

export type PriceSensitivityRow = {
  label: string;
  price: number;
  discountToAsking: number;
};

export type NegotiationOutputs = {
  openingPrice: number;
  targetPrice: number;
  stretchPrice: number;
  walkAwayPrice: number;
  discountToAsking: number;
  acceptanceProbability: "Low" | "Medium" | "High" | "n/a";
  priceSensitivity: PriceSensitivityRow[];
  ddFindingsThatDecreaseOffer: string[];
  ddFindingsThatIncreaseOffer: string[];
  agentScript: string;
};

function roundToNearest(amount: number, increment = 1000): number {
  return Math.round(amount / increment) * increment;
}

function roundDown(amount: number, increment = 1000): number {
  return Math.floor(amount / increment) * increment;
}

function riskDiscount(inputs: NegotiationInputs): number {
  const risks = inputs.unresolvedRisks ?? [];
  let discount = 0;

  if (inputs.dataQualityScore < 7) discount += 0.025;
  if (inputs.daysOnMarket > 90) discount += 0.03;
  else if (inputs.daysOnMarket > 60) discount += 0.015;
  if (inputs.combinedStressCashFlow < 0) discount += 0.025;
  if (risks.includes("OMC")) discount += 0.025;
  if (risks.includes("RTB")) discount += 0.025;
  if (risks.includes("BER")) discount += 0.015;
  if (risks.includes("Service charge")) discount += 0.01;
  if (risks.includes("Rent evidence")) discount += 0.01;

  return Math.min(discount, 0.12);
}

function probability(discountToAsking: number, daysOnMarket: number, hasMajorRisk: boolean): "Low" | "Medium" | "High" {
  if (discountToAsking <= 0.03) return "High";
  if (discountToAsking <= 0.07 || daysOnMarket > 60 || hasMajorRisk) return "Medium";
  return "Low";
}

export function calculateNegotiationStrategy(inputs: NegotiationInputs): NegotiationOutputs {
  const baseRows = [0, 0.025, 0.05, 0.075, 0.1];
  const priceSensitivity = baseRows.map(discount => ({
    label: discount === 0 ? "Asking" : `-${(discount * 100).toFixed(1)}%`,
    price: roundToNearest(inputs.askingPrice * (1 - discount), 500),
    discountToAsking: discount,
  }));

  if (inputs.verdict === "Avoid") {
    return {
      openingPrice: 0,
      targetPrice: 0,
      stretchPrice: 0,
      walkAwayPrice: 0,
      discountToAsking: 0,
      acceptanceProbability: "n/a",
      priceSensitivity,
      ddFindingsThatDecreaseOffer: ["Property does not meet minimum underwriting criteria."],
      ddFindingsThatIncreaseOffer: [],
      agentScript: "This property does not meet the screening criteria. Do not engage unless the facts materially change.",
    };
  }

  const risks = inputs.unresolvedRisks ?? [];
  const hasMajorRisk = risks.includes("OMC") || risks.includes("RTB");
  const discount = riskDiscount(inputs);
  const modelTarget = Math.min(inputs.priceForTargetReturns, inputs.askingPrice * (1 - discount));
  const targetPrice = roundToNearest(modelTarget, 500);
  const openingPrice = roundDown(targetPrice * 0.975, 500);
  const stretchPrice = roundToNearest(Math.min(inputs.askingPrice, Math.max(targetPrice, inputs.priceForBreakEven)), 500);
  const walkAwayPrice = roundDown(Math.min(inputs.askingPrice, Math.max(stretchPrice, inputs.priceForBreakEven)), 1000);
  const discountToAsking = (inputs.askingPrice - targetPrice) / inputs.askingPrice;

  const ddFindingsThatDecreaseOffer = [
    risks.includes("OMC") ? "Owners' management company documents show an outstanding levy, insurance gap, weak repair reserve, or unresolved remediation." : "",
    risks.includes("RTB") ? "Rent history confirms a previous rent materially below the modelled rent." : "",
    risks.includes("BER") ? "Energy-upgrade estimate exceeds the budget included in acquisition costs." : "",
    risks.includes("Service charge") ? "Service charge is confirmed above the base estimate or rising quickly." : "",
    risks.includes("Rent evidence") ? "Same-building or micro-area comps support a lower achievable rent." : "",
  ].filter(Boolean);

  const ddFindingsThatIncreaseOffer = [
    "Owners' management company accounts, meeting notes, insurance, and repair reserve review show no current liability.",
    "Rent history confirms the modelled rent is legally chargeable.",
    "Same-building or same-development rent examples confirm the base rent.",
    "Survey confirms no material capex beyond the modeled budget.",
  ];

  const acceptanceProbability = probability(discountToAsking, inputs.daysOnMarket, hasMajorRisk);
  const riskLabels: Record<string, string> = {
    OMC: "management-company documents",
    RTB: "rent history / legal rent",
    BER: "energy rating upgrade",
    "Service charge": "annual management charge",
    "Rent evidence": "similar rental evidence",
    Tenancy: "tenancy status",
  };
  const riskLine = risks.length > 0 ? ` The open items are ${risks.map(risk => riskLabels[risk] ?? risk).join(", ")}.` : "";

  return {
    openingPrice,
    targetPrice,
    stretchPrice,
    walkAwayPrice,
    discountToAsking,
    acceptanceProbability,
    priceSensitivity,
    ddFindingsThatDecreaseOffer,
    ddFindingsThatIncreaseOffer,
    agentScript: `Hi [Agent],\n\nI am interested in the property and have screened it as a rental investment using current rent, service-charge, tax, and mortgage assumptions.${riskLine}\n\nSubject to the documents checking out, I would like to open around EUR ${openingPrice.toLocaleString("en-IE")}. The offer can move toward EUR ${targetPrice.toLocaleString("en-IE")} if the missing evidence supports the assumptions.\n\nBefore finalising, could you please share the owners' management company pack, current service charge, tenancy status, and any available rent history?`,
  };
}
