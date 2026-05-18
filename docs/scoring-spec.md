# Scoring Specification

This specification defines the qualitative and data quality scoring logic for `packages/scoring-engine`.

## 1. 16 Qualitative Dimensions
Each dimension is scored from 1 to 10 based on specific anchors:
1. **Location Quality** (1-2 Problematic, 9-10 Premium D2/D4)
2. **Safety / Tenant Perception** (High Weight)
3. **Recession Resilience** (High Weight)
4. **Tenant Demand**
5. **Likelihood of Achieving Base Rent**
6. **Rent-Control / Legal Rent Confidence** (High Weight)
7. **Building Quality**
8. **OMC / Service-Charge / Remediation Risk (Current)** (High Weight)
9. **BER / Energy Efficiency Risk** (High Weight)
10. **Service-Charge Reasonableness**
11. **Maintenance / Capex Risk**
12. **Layout and Size Quality**
13. **Parking Value**
14. **Resale Liquidity** (High Weight)
15. **Operational Hassle**
16. **Overall Risk-Adjusted Attractiveness**

## 2. Resilience Overlay
For resilience-focused users (default), double-weight the following dimensions when calculating the Overall Risk-Adjusted Attractiveness (Dimension 16):
- 2: Safety/Tenant Perception
- 3: Recession Resilience
- 6: Rent-Control Confidence
- 8: OMC Risk (Current)
- 9: BER Risk
- 14: Resale Liquidity

**Penalty Triggers:** Deduct 1-2 points from Overall Score if:
- Combined Downside CF (Scenario #9) is negative.
- Any High Weight score (2, 6, 8) is < 6.
- BER is D or below without funded upgrade plan.

## 3. Data Quality Score
Starts at 10. Deduct points for estimated or unknown fields:
- Size unknown: -1.5 (estimated -0.5)
- Service Charge unknown: -1.5 (estimated -1.0)
- BER unknown: -1.0 (estimated -0.5)
- Tenancy unknown: -1.0 (estimated -0.5)
- Micro-location uncertain: -1.5 (estimated -0.5)
- Previous rent unknown (if relevant): -1.0 (estimated -0.5)

*A DQ score < 7 prevents unconditional "Buy" recommendations.*

## 4. Stress Resilience Categories
Based on CF results from Stress Scenarios #9 (Combined) and #10 (Severe):
- **Robust:** #9 > +€300/mo AND #10 >= €0.
- **Good:** #9 +€100 to +€300/mo.
- **Thin but positive:** #9 €0 to +€100/mo.
- **Weak:** #9 negative, base case positive.
- **Fragile:** Base case weak or multiple scenarios negative.

## 5. Objective-Based Rankings
Sort properties dynamically based on:
- Best Clean Confirmed Candidate (DQ >= 8, clean OMC, positive CF).
- Highest Cash Flow (Base case CF).
- Best Stress Resilience (Scenario #9 CF).
- Best Yield (Economic ROI).
- Best Negotiation Opportunity (Delta between Target and Asking Price CF).
- Best 1-Bed / 2-Bed.
