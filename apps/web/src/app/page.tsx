"use client";

import { useState } from "react";
import { InvestorAssumptions, PropertyFinancialInput, calculateFinancials, runStressTests } from "@property-underwriter/financial-engine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type RentComp = {
  id: string;
  source: string;
  address: string;
  rent: number;
  tier: "A" | "B" | "C" | "D";
  notes: string;
};

export type SavedProperty = {
  id: string;
  name: string;
  input: PropertyFinancialInput;
  comps: RentComp[];
  dqScore: number;
  omcRisk: number;
};

const mockProperties: SavedProperty[] = [
  {
    id: "1",
    name: "Apt 4, D2",
    input: {
      purchasePrice: 400000, monthlyRent: 2500, stampDuty: 4000, legalSetupCost: 3500, furnishingSetupCost: 5000,
      refurbishmentCost: 0, berUpgradeCost: 0, annualServiceCharge: 2000, annualMaintenance: 1200, annualInsurance: 400,
      annualAccountingCompliance: 600, annualLettingFeeAmortised: 500, annualCapexReserve: 800
    },
    comps: [], dqScore: 9, omcRisk: 8
  },
  {
    id: "2",
    name: "House in D8",
    input: {
      purchasePrice: 350000, monthlyRent: 2200, stampDuty: 3500, legalSetupCost: 3500, furnishingSetupCost: 0,
      refurbishmentCost: 15000, berUpgradeCost: 5000, annualServiceCharge: 0, annualMaintenance: 2000, annualInsurance: 600,
      annualAccountingCompliance: 600, annualLettingFeeAmortised: 500, annualCapexReserve: 1500
    },
    comps: [], dqScore: 6, omcRisk: 10
  },
  {
    id: "3",
    name: "Apt 12, D4",
    input: {
      purchasePrice: 550000, monthlyRent: 3200, stampDuty: 5500, legalSetupCost: 3500, furnishingSetupCost: 2000,
      refurbishmentCost: 0, berUpgradeCost: 0, annualServiceCharge: 3500, annualMaintenance: 1500, annualInsurance: 500,
      annualAccountingCompliance: 600, annualLettingFeeAmortised: 800, annualCapexReserve: 1000
    },
    comps: [], dqScore: 10, omcRisk: 4
  }
];

export default function Home() {
  const [step, setStep] = useState<"dashboard" | "setup" | "entry" | "comps" | "confirm" | "analysis">("dashboard");
  const [sortBy, setSortBy] = useState<"cashflow" | "resilience" | "clean" | "yield">("cashflow");

  const [assumptions, setAssumptions] = useState<InvestorAssumptions>({
    cashDeployed: 300000,
    mortgageRate: 0.0565,
    mortgageTermYears: 25,
    vacancyMonthsBase: 1,
    taxRates: [0.2, 0.3, 0.4],
    centralTaxRate: 0.3,
  });

  const [property, setProperty] = useState<PropertyFinancialInput>({
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
  });

  const [comps, setComps] = useState<RentComp[]>([]);
  const [newComp, setNewComp] = useState<Partial<RentComp>>({ tier: "C" });

  let rentConfidence: "High" | "Medium" | "Low" = "Low";
  if (comps.some(c => c.tier === "A" || c.tier === "B")) rentConfidence = "High";
  else if (comps.filter(c => c.tier === "C").length >= 2) rentConfidence = "Medium";

  const handleNext = () => {
    if (step === "setup") setStep("entry");
    else if (step === "entry") setStep("comps");
    else if (step === "comps") setStep("confirm");
    else if (step === "confirm") setStep("analysis");
  };

  const handleBack = () => {
    if (step === "setup") setStep("dashboard");
    else if (step === "entry") setStep("setup");
    else if (step === "comps") setStep("entry");
    else if (step === "confirm") setStep("comps");
    else if (step === "analysis") setStep("confirm");
  };

  const startNewProperty = () => setStep("setup");

  const centralKey = (assumptions.centralTaxRate * 100).toString();
  const dashboardData = mockProperties.map(p => {
    const fin = calculateFinancials(p.input, assumptions);
    const stress = runStressTests(p.input, assumptions);
    const combinedStress = stress.find(s => s.scenarioId === 9)!;
    
    return {
      ...p,
      fin,
      combinedStress,
      isClean: p.dqScore >= 8 && p.omcRisk >= 6 && fin.monthlyCashFlowByTaxRate[centralKey] > 0
    };
  });

  let sortedData = [...dashboardData];
  if (sortBy === "cashflow") {
    sortedData.sort((a, b) => b.fin.monthlyCashFlowByTaxRate[centralKey] - a.fin.monthlyCashFlowByTaxRate[centralKey]);
  } else if (sortBy === "resilience") {
    sortedData.sort((a, b) => b.combinedStress.monthlyCashFlow - a.combinedStress.monthlyCashFlow);
  } else if (sortBy === "yield") {
    sortedData.sort((a, b) => b.fin.economicRoiByTaxRate[centralKey] - a.fin.economicRoiByTaxRate[centralKey]);
  } else if (sortBy === "clean") {
    sortedData = sortedData.filter(p => p.isClean).sort((a, b) => b.fin.monthlyCashFlowByTaxRate[centralKey] - a.fin.monthlyCashFlowByTaxRate[centralKey]);
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Irish Buy-to-Let Underwriter</h1>
        {step === "dashboard" && <Button onClick={startNewProperty}>+ Add Property</Button>}
      </div>

      {step === "dashboard" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Comparison Dashboard</CardTitle>
                <CardDescription>Evaluate multiple properties side-by-side.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Rank by:</span>
                <select className="border rounded px-2 py-1 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                  <option value="cashflow">Highest Cash Flow</option>
                  <option value="resilience">Best Resilience (Stress #9)</option>
                  <option value="yield">Best Yield (ROI)</option>
                  <option value="clean">Best Clean Candidates</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Asking Price</TableHead>
                  <TableHead>Base CF (30%)</TableHead>
                  <TableHead>Stress #9 CF</TableHead>
                  <TableHead>Eco ROI</TableHead>
                  <TableHead>DQ Score</TableHead>
                  <TableHead>Verdict</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>€{p.input.purchasePrice.toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-green-600">€{p.fin.monthlyCashFlowByTaxRate[centralKey].toFixed(0)}</TableCell>
                    <TableCell className={p.combinedStress.monthlyCashFlow < 0 ? "text-red-500 font-medium" : ""}>
                      €{p.combinedStress.monthlyCashFlow.toFixed(0)} <Badge variant="outline" className="ml-1 scale-75">{p.combinedStress.resilienceCategory}</Badge>
                    </TableCell>
                    <TableCell>{(p.fin.economicRoiByTaxRate[centralKey] * 100).toFixed(1)}%</TableCell>
                    <TableCell>{p.dqScore}/10</TableCell>
                    <TableCell>
                      {p.isClean ? <Badge>Buy</Badge> : (p.dqScore < 7 || p.omcRisk < 6) ? <Badge variant="destructive">Avoid / Hold</Badge> : <Badge variant="secondary">Marginal</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {step === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle>1. Investor Setup</CardTitle>
            <CardDescription>Configure your baseline investment assumptions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cash Deployed (€)</Label>
                <Input type="number" value={assumptions.cashDeployed} onChange={e => setAssumptions({...assumptions, cashDeployed: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Mortgage Rate (%)</Label>
                <Input type="number" step="0.01" value={assumptions.mortgageRate * 100} onChange={e => setAssumptions({...assumptions, mortgageRate: Number(e.target.value) / 100})} />
              </div>
              <div className="space-y-2">
                <Label>Mortgage Term (Years)</Label>
                <Input type="number" value={assumptions.mortgageTermYears} onChange={e => setAssumptions({...assumptions, mortgageTermYears: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Central Tax Rate (%)</Label>
                <Input type="number" value={assumptions.centralTaxRate * 100} onChange={e => setAssumptions({...assumptions, centralTaxRate: Number(e.target.value) / 100})} />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>Back to Dashboard</Button>
              <Button onClick={handleNext}>Next: Enter Property</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "entry" && (
        <Card>
          <CardHeader>
            <CardTitle>2. Add Property Manually</CardTitle>
            <CardDescription>Enter the key financial metrics of the property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Purchase Price (€)</Label>
                <Input type="number" value={property.purchasePrice} onChange={e => setProperty({...property, purchasePrice: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent (€)</Label>
                <Input type="number" value={property.monthlyRent} onChange={e => setProperty({...property, monthlyRent: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Annual Service Charge (€)</Label>
                <Input type="number" value={property.annualServiceCharge} onChange={e => setProperty({...property, annualServiceCharge: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>BER Upgrade Cost (€)</Label>
                <Input type="number" value={property.berUpgradeCost} onChange={e => setProperty({...property, berUpgradeCost: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Next: Rent Comparables</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "comps" && (
        <Card>
          <CardHeader>
            <CardTitle>3. Rent Comparables</CardTitle>
            <CardDescription>Enter comparables to establish rent confidence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-md border">
              <div className="space-y-2 col-span-2">
                <Label>Address / Source</Label>
                <Input value={newComp.address || ''} onChange={e => setNewComp({...newComp, address: e.target.value})} placeholder="e.g. Apt 12, Same Block" />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent (€)</Label>
                <Input type="number" value={newComp.rent || ''} onChange={e => setNewComp({...newComp, rent: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Tier</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={newComp.tier} onChange={e => setNewComp({...newComp, tier: e.target.value as any})}>
                  <option value="A">A: Same Block</option>
                  <option value="B">B: Same Dev</option>
                  <option value="C">C: Micro-Area</option>
                  <option value="D">D: Broad Area</option>
                </select>
              </div>
              <div className="col-span-4 flex justify-end">
                <Button variant="secondary" onClick={() => {
                  if (newComp.address && newComp.rent) {
                    setComps([...comps, { ...newComp, id: Date.now().toString() } as RentComp]);
                    setNewComp({ tier: "C", address: '', rent: 0 });
                  }
                }}>Add Comparable</Button>
              </div>
            </div>

            {comps.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="font-medium text-sm">Saved Comparables</h3>
                {comps.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-2 border rounded-md text-sm">
                    <span>{c.address} (Tier {c.tier})</span>
                    <span className="font-bold">€{c.rent}</span>
                  </div>
                ))}
                <div className="mt-2 text-sm text-slate-500">
                  Computed Rent Confidence: <Badge variant={rentConfidence === "High" ? "default" : "secondary"}>{rentConfidence}</Badge>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Next: Fact Confirmation</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle>4. Fact Confirmation</CardTitle>
            <CardDescription>Review and verify all inputs before running the deterministic model.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4 space-y-2 bg-slate-50">
              <div className="flex justify-between"><span className="text-slate-500">Purchase Price</span><span className="font-medium">€{property.purchasePrice} <Badge variant="secondary">Confirmed</Badge></span></div>
              <div className="flex justify-between"><span className="text-slate-500">Monthly Rent</span><span className="font-medium">€{property.monthlyRent} <Badge variant="secondary">Estimated</Badge></span></div>
              <div className="flex justify-between"><span className="text-slate-500">Service Charge</span><span className="font-medium">€{property.annualServiceCharge} <Badge variant="secondary">Estimated</Badge></span></div>
              <div className="flex justify-between"><span className="text-slate-500">Rent Confidence</span><span className="font-medium">{rentConfidence}</span></div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Run Analysis</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "analysis" && (
        <AnalysisView property={property} assumptions={assumptions} onBack={handleBack} onDashboard={() => setStep("dashboard")} />
      )}
    </div>
  );
}

function AnalysisView({ property, assumptions, onBack, onDashboard }: { property: PropertyFinancialInput, assumptions: InvestorAssumptions, onBack: () => void, onDashboard: () => void }) {
  const fin = calculateFinancials(property, assumptions);
  const stress = runStressTests(property, assumptions);
  const combinedStress = stress.find(s => s.scenarioId === 9)!;
  const centralKey = (assumptions.centralTaxRate * 100).toString();

  // Mock Report Generation content
  const mockReportContent = `
# Underwriting Report: Proposed Property

## 1. Executive Summary
**Verdict:** CONDITIONAL BUY
**Asking Price:** €${property.purchasePrice.toLocaleString()}
**Monthly Cash Flow (30% Tax):** €${fin.monthlyCashFlowByTaxRate[centralKey].toFixed(0)}
**Economic ROI:** ${(fin.economicRoiByTaxRate[centralKey] * 100).toFixed(2)}%

## 3. Financial Model
- **Total Acquisition Cost:** €${fin.totalAcquisitionCost.toLocaleString()}
- **Mortgage Required:** €${fin.mortgageRequired.toLocaleString()}
- **Annual Headline Rent:** €${fin.annualHeadlineRent.toLocaleString()}

## 5. Stress Tests & Sensitivity
- **Combined Downside (Scenario #9):** €${combinedStress.monthlyCashFlow.toFixed(0)} / mo
- **Resilience Category:** ${combinedStress.resilienceCategory}

## 7. Negotiation Strategy
**Target Price:** €${(property.purchasePrice * 0.95).toLocaleString()}
**Opening Price:** €${(property.purchasePrice * 0.90).toLocaleString()}
`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>← Back</Button>
          <h2 className="text-2xl font-bold">Analysis Result</h2>
        </div>
        <Button variant="secondary" onClick={onDashboard}>Return to Dashboard</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Asking Price</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">€{property.purchasePrice.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Monthly CF (30% Tax)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">€{fin.monthlyCashFlowByTaxRate[centralKey].toFixed(0)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Economic ROI (30%)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{(fin.economicRoiByTaxRate[centralKey] * 100).toFixed(2)}%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Combined Stress (#9)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{combinedStress.monthlyCashFlow.toFixed(0)}/mo</div>
            <Badge className="mt-1">{combinedStress.resilienceCategory}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Mortgage Required</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">€{fin.mortgageRequired.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Data Quality Score</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">8 / 10</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financials" className="mt-8">
        <TabsList>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
          <TabsTrigger value="report">Final Report</TabsTrigger>
        </TabsList>
        <TabsContent value="financials" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Financial Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Total Acquisition Cost</span><span className="font-medium">€{fin.totalAcquisitionCost.toLocaleString()}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Annual Headline Rent</span><span className="font-medium">€{fin.annualHeadlineRent.toLocaleString()}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Vacancy Adjusted Rent</span><span className="font-medium">€{fin.vacancyAdjustedRent.toLocaleString()}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Annual Mortgage Payment</span><span className="font-medium">€{fin.annualMortgagePayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Year 1 Interest</span><span className="font-medium">€{fin.yearOneInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Year 1 Principal</span><span className="font-medium">€{fin.yearOnePrincipal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
                <div className="flex justify-between pt-2"><span className="font-bold">Annual After-Tax CF (30%)</span><span className="font-bold text-green-600">€{fin.annualAfterTaxCashFlowByTaxRate[centralKey].toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stress" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Stress Testing Scenarios</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stress.map(s => (
                  <div key={s.scenarioId} className="flex justify-between border-b py-2 items-center">
                    <span className="text-slate-500">{s.scenarioId}. {s.name}</span>
                    <span className={`font-medium ${s.monthlyCashFlow < 0 ? 'text-red-500' : ''}`}>
                      €{s.monthlyCashFlow.toFixed(0)}/mo
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="report" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Final Underwriting Report</CardTitle>
                <CardDescription>AI-generated Markdown report based on deterministic data.</CardDescription>
              </div>
              <Button variant="default">Export PDF / Markdown</Button>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-50 p-6 rounded-md font-mono text-sm whitespace-pre-wrap">
                {mockReportContent}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
