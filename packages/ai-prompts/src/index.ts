import { z } from "zod";

export const propertyExtractionSchema = z.object({
  purchasePrice: z.number().nullable().describe("The asking price of the property in Euros. Null if POA."),
  beds: z.number().nullable().describe("Number of bedrooms."),
  baths: z.number().nullable().describe("Number of bathrooms."),
  sizeSqm: z.number().nullable().describe("Size of the property in square meters. Convert from sqft if necessary (1 sqm = 10.764 sqft)."),
  berRating: z.enum(["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "E1", "E2", "F", "G", "Exempt", "Unknown"]).describe("The BER energy rating."),
  serviceCharge: z.number().nullable().describe("The annual service charge/management fee in Euros."),
  serviceChargeStatus: z.enum(["Confirmed", "Estimated", "Unknown"]).describe("Whether the service charge was explicitly stated (Confirmed) or not (Unknown)."),
  parkingSpaces: z.number().nullable().describe("Number of designated parking spaces."),
  tenancyStatus: z.enum(["Vacant Possession", "Tenanted", "Unknown"]).describe("Current occupancy status of the property."),
  previousRent: z.number().nullable().describe("The previous monthly rent if the property was rented before."),
  omcRiskNotes: z.string().describe("Any notes regarding the Owner Management Company, sinking fund, or upcoming levies mentioned in the listing."),
});

export type PropertyExtraction = z.infer<typeof propertyExtractionSchema>;

export const EXTRACTION_SYSTEM_PROMPT = `
You are an expert Irish real estate data extractor. Your job is to read the raw text of a Daft.ie or MyHome.ie property listing and extract the factual data perfectly into the required JSON schema.

RULES:
1. ONLY extract information that is explicitly stated or can be safely mathematically derived (like converting sqft to sqm).
2. If a value is not stated, return null or "Unknown" as defined by the schema. Do not guess.
3. Pay special attention to the service charge (management fee). If it is not in the text, set serviceChargeStatus to "Unknown" and serviceCharge to null.
4. Pay special attention to "Vacant Possession". If stated, set tenancyStatus to "Vacant Possession".
5. Never hallucinate data.

Output ONLY valid JSON matching the schema.
`;

export const REPORT_GENERATION_PROMPT = `
You are a senior real estate underwriter analyzing an Irish residential property.
You will be provided with a JSON object containing the exact deterministic outputs from our financial, scoring, and negotiation engines. 

YOUR TASK: Write a highly professional, 8-section Markdown Underwriting Report based EXACTLY on the provided data.

RULES:
1. DO NOT change any numbers or do any math. Use the exact figures provided in the JSON payload.
2. Structure the report exactly as follows:
   # 1. Executive Summary
   # 2. Property & Listing Facts
   # 3. Financial Model
   # 4. Rent Evidence & Confidence
   # 5. Stress Tests & Sensitivity
   # 6. Qualitative Risk Scoring
   # 7. Negotiation Strategy
   # 8. Due Diligence Action Plan
3. Keep the tone analytical, institutional, and objective.
4. Highlight major risks (e.g. low Data Quality score, negative stress test cash flows, high OMC risks) using bold text.
5. In the Negotiation Strategy section, insert the provided agent script exactly as it appears in the JSON.
`;
