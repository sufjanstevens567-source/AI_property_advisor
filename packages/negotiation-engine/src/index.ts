export type NegotiationInputs = {
  askingPrice: number;
  daysOnMarket: number;
  dataQualityScore: number;
  verdict: "Buy" | "Marginal" | "Avoid";
  // The price at which Base Cash Flow is ~€300 and Stress #9 CF is > €0
  priceForTargetReturns: number; 
  // The price at which Base Cash Flow is exactly €0
  priceForBreakEven: number;
};

export type NegotiationOutputs = {
  openingPrice: number;
  targetPrice: number;
  walkAwayPrice: number;
  discountToAsking: number;
  agentScript: string;
};

export function calculateNegotiationStrategy(inputs: NegotiationInputs): NegotiationOutputs {
  // If we should avoid, walk away is 0.
  if (inputs.verdict === "Avoid") {
    return {
      openingPrice: 0,
      targetPrice: 0,
      walkAwayPrice: 0,
      discountToAsking: 0,
      agentScript: "This property does not meet investment criteria. Do not engage."
    };
  }

  // 1. Target Price Calculation
  // Start with the price that yields our target returns
  let targetPrice = inputs.priceForTargetReturns;

  // If the property has been on the market for > 60 days, we can target a 3% lower price
  if (inputs.daysOnMarket > 60) {
    targetPrice = targetPrice * 0.97;
  }
  
  // Cap target price at asking price (we don't target paying over asking unless specifically required, 
  // but for a strict BTL model we assume we want a deal)
  targetPrice = Math.min(targetPrice, inputs.askingPrice);

  // Round target price to nearest €5,000 for realistic negotiation
  targetPrice = Math.round(targetPrice / 5000) * 5000;

  // 2. Opening Price
  // Start 5% below target
  let openingPrice = targetPrice * 0.95;
  openingPrice = Math.round(openingPrice / 5000) * 5000;

  // 3. Walk Away Price
  // The absolute maximum we can pay before the property bleeds cash on a base level
  let walkAwayPrice = Math.min(inputs.priceForBreakEven, inputs.askingPrice * 1.05); // Never pay more than 5% over asking
  walkAwayPrice = Math.floor(walkAwayPrice / 1000) * 1000; // Round to nearest €1,000

  // Ensure logical ordering
  if (openingPrice > targetPrice) openingPrice = targetPrice;
  if (targetPrice > walkAwayPrice) walkAwayPrice = targetPrice;

  const discountToAsking = (inputs.askingPrice - targetPrice) / inputs.askingPrice;

  // 4. Agent Script Generation
  let script = "";
  if (inputs.dataQualityScore < 7) {
    script = `Hi [Agent],\n\nWe are interested in ${inputs.askingPrice ? 'the property' : 'this unit'}, but our initial underwriting requires more clarity. Specifically, we have several estimated/unknown variables (such as exact Service Charge or BER upgrade costs) that prevent us from making a firm unconditional offer.\n\nSubject to clarifying those, our initial analysis suggests a value around €${openingPrice.toLocaleString()}.\n\nCould you provide the exact OMC figures and current tenancy status? Once we have those, we can formalize an offer.`;
  } else {
    script = `Hi [Agent],\n\nWe have completed our underwriting on the property. We are a cash-ready/pre-approved buyer capable of moving quickly.\n\nBased on the current rental yields, service charges, and required capital expenditure, we would like to submit an opening offer of €${openingPrice.toLocaleString()}.\n\nPlease let us know the vendor's thoughts.`;
  }

  return {
    openingPrice,
    targetPrice,
    walkAwayPrice,
    discountToAsking,
    agentScript: script
  };
}
