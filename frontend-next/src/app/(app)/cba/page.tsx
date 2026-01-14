"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { predictionService } from "@/lib/backend-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowPathIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CBAReportDocument } from "@/components/cba/report-pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function CBAPage() {
    const [activeTab, setActiveTab] = useState("select-project");
    const [selectedDcId, setSelectedDcId] = useState<string | null>(null);

    // Fetch Data Centers
    const { data: dcData, isLoading: dcLoading } = useQuery({
        queryKey: ["data-centers"],
        queryFn: () => predictionService.listDataCenters({ page_size: 100 }),
    });

    // Nearby Sinks Logic
    const { data: sinksData, isLoading: sinksLoading } = useQuery({
        queryKey: ["nearby-sinks", selectedDcId],
        queryFn: () => predictionService.listNearbyHeatSinks(Number(selectedDcId), 10, 5), // 10km radius, top 5
        enabled: !!selectedDcId,
    });

    const [selectedSinkId, setSelectedSinkId] = useState<string | null>(null);

    // Custom Sink State
    const [openSinkDialog, setOpenSinkDialog] = useState(false);
    const [newSink, setNewSink] = useState({ name: "", capacityMw: "1.0", type: "district_heating" });
    const [creatingSink, setCreatingSink] = useState(false);

    // Financials State
    const [prediction, setPrediction] = useState<any>(null);
    const [calculating, setCalculating] = useState(false);

    // Sensitivity Analysis State
    const [params, setParams] = useState({
        analysisYears: 15,
        discountRate: 0.05,
        electricityPrice: 0.15,
        heatPrice: 0.08
    });

    const handleProjectSelect = (id: string) => {
        setSelectedDcId(id);
        setActiveTab("select-sink");
    };

    const handleSinkSelect = (id: string) => {
        setSelectedSinkId(id);
        setActiveTab("financials");
    };

    const handleCreateSink = async () => {
        setCreatingSink(true);
        try {
            // Approximate location near the selected DC for MVP (or 0,0)
            // @ts-ignore
            const selectedDC = dcData?.dataCenters?.find((d: any) => d.id === selectedDcId);
            const lat = selectedDC?.location?.latitude || 52.3676;
            const lng = selectedDC?.location?.longitude || 4.9041;

            const payload = {
                name: newSink.name,
                capacityMw: Number(newSink.capacityMw),
                sinkType: newSink.type,
                location: { latitude: lat + 0.01, longitude: lng + 0.01 } // Offset slightly
            };
            const res = await predictionService.createHeatSink(payload);
            // @ts-ignore
            handleSinkSelect(res.heatSink.id);
            setOpenSinkDialog(false);
        } catch (e) {
            console.error(e);
        } finally {
            setCreatingSink(false);
        }
    };

    const handleCalculate = async () => {
        if (!selectedDcId || !selectedSinkId) return;
        setCalculating(true);
        try {
            const res = await predictionService.calculatePrediction({
                dataCenterId: Number(selectedDcId),
                heatSinkIds: [Number(selectedSinkId)],
                scenarioName: "CBA Draft " + new Date().toLocaleDateString(),
                analysisYears: params.analysisYears,
                discountRate: Number(params.discountRate),
                customElectricityRate: Number(params.electricityPrice),
                // We could also pass customPue, customEfficiency etc. if we added inputs
            });
            setPrediction(res);
        } catch (e) {
            console.error(e);
        } finally {
            setCalculating(false);
        }
    };


    return (
        <div className="container mx-auto py-10 max-w-6xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Cost-Benefit Analysis (CBA)</h1>
                <p className="text-muted-foreground">
                    Match your waste heat with demand to create a compliant business case.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="select-project">1. Select Project</TabsTrigger>
                    <TabsTrigger value="select-sink" disabled={!selectedDcId}>2. Match Demand</TabsTrigger>
                    <TabsTrigger value="financials" disabled={!selectedSinkId}>3. Financials</TabsTrigger>
                    <TabsTrigger value="report" disabled={!prediction}>4. Report</TabsTrigger>
                </TabsList>

                <TabsContent value="select-project" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select a Heat Source</CardTitle>
                            <CardDescription>Choose one of your saved Data Center projects.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {dcLoading ? (
                                <div className="flex justify-center p-8"><ArrowPathIcon className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* @ts-ignore - prototyping */}
                                    {dcData?.dataCenters?.map((dc: any) => (
                                        <Card
                                            key={dc.id}
                                            className={`cursor-pointer hover:border-primary transition-colors ${selectedDcId === dc.id ? "border-primary bg-secondary/10" : ""}`}
                                            onClick={() => handleProjectSelect(dc.id)}
                                        >
                                            <CardHeader className="p-4">
                                                <CardTitle className="text-lg">{dc.name}</CardTitle>
                                                <CardDescription>{dc.totalItLoadKw} kW | {dc.location?.city || "Unknown City"}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                    {/* @ts-ignore */}
                                    {!dcData?.dataCenters?.length && (
                                        <div className="col-span-3 text-center p-8 text-muted-foreground">
                                            No projects found. Go to Compliance Checker to create one.
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="select-sink" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={openSinkDialog} onOpenChange={setOpenSinkDialog}>
                            <DialogTrigger asChild>
                                <Button variant="outline"> + Add Custom Sink</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Custom Heat Sink</DialogTitle>
                                    <DialogDescription>Define a demand node to simulate a connection.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={newSink.name} onChange={e => setNewSink({ ...newSink, name: e.target.value })} placeholder="e.g. Municipal Pool" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Capacity (MW)</Label>
                                        <Input value={newSink.capacityMw} onChange={e => setNewSink({ ...newSink, capacityMw: e.target.value })} type="number" step="0.1" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={newSink.type} onValueChange={v => setNewSink({ ...newSink, type: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="district_heating">District Heating Network</SelectItem>
                                                <SelectItem value="greenhouse">Greenhouse</SelectItem>
                                                <SelectItem value="swimming_pool">Swimming Pool</SelectItem>
                                                <SelectItem value="industrial">Industrial Process</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateSink} disabled={creatingSink}>
                                        {creatingSink && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
                                        Add & Select
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Nearby Heat Demand</CardTitle>
                            <CardDescription>We found these potential heat sinks within 10km of your Data Center.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sinksLoading ? (
                                <div className="flex justify-center p-8"><ArrowPathIcon className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                            ) : (
                                <div className="space-y-4">
                                    {/* @ts-ignore - prototyping */}
                                    {sinksData?.heatSinks?.map((sink: any) => (
                                        <div key={sink.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                                            <div>
                                                <h4 className="font-semibold">{sink.name}</h4>
                                                <p className="text-sm text-muted-foreground">{sink.sinkType} • {sink.capacityMw} MW Capacity</p>
                                            </div>
                                            <Button size="sm" onClick={() => handleSinkSelect(sink.id)}>Select</Button>
                                        </div>
                                    ))}
                                    {/* @ts-ignore */}
                                    {!sinksData?.heatSinks?.length && (
                                        <div className="text-center p-8 text-muted-foreground">
                                            No matching heat sinks found nearby.
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="financials">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="col-span-1 border-blue-100">
                            <CardHeader>
                                <CardTitle>Sensitivity Analysis</CardTitle>
                                <CardDescription>Adjust economic parameters to stress-test your business case.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Analysis Period (Years)</Label>
                                    <Input
                                        type="number"
                                        value={params.analysisYears}
                                        onChange={e => setParams({ ...params, analysisYears: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Discount Rate (WACC)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={params.discountRate}
                                            onChange={e => setParams({ ...params, discountRate: parseFloat(e.target.value) })}
                                        />
                                        <span className="text-xs text-muted-foreground">{(params.discountRate * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Electricity Price (€/kWh)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={params.electricityPrice}
                                        onChange={e => setParams({ ...params, electricityPrice: parseFloat(e.target.value) })}
                                    />
                                </div>
                                {/* 
                            Note: Heat Price is not directly an input to predictionService yet in frontend client, but typically key for revenue.
                            Assuming backend uses electricity cost for savings or fixed heat price params.
                        */}
                                <Button onClick={handleCalculate} className="w-full mt-4">
                                    {calculating && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
                                    Recalculate
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Economic Feasibility</CardTitle>
                                <CardDescription>Estimate CAPEX, OPEX, and Return on Investment for this connection.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {!prediction && !calculating && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground mb-4">Select parameters and run analysis.</p>
                                        <Button size="lg" onClick={handleCalculate}>Run Initial Analysis</Button>
                                    </div>
                                )}

                                {calculating && (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-muted-foreground">Running CBA Engine...</p>
                                    </div>
                                )}

                                {prediction && (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* KPIs */}
                                        <div className="grid grid-cols-2 gap-4 col-span-2">
                                            <div className="p-4 bg-secondary/20 rounded-lg border">
                                                <div className="text-sm text-muted-foreground">Net Present Value (NPV)</div>
                                                <div className="text-2xl font-bold">€ {
                                                    // @ts-ignore
                                                    prediction.predictionResult?.netPresentValue?.toLocaleString() || "N/A"
                                                }</div>
                                            </div>
                                            <div className="p-4 bg-secondary/20 rounded-lg border">
                                                <div className="text-sm text-muted-foreground">IRR</div>
                                                {/* @ts-ignore */}
                                                <div className="text-2xl font-bold">{prediction.predictionResult?.internalRateReturn?.toFixed(1) || "0"}%</div>
                                            </div>
                                            <div className="p-4 bg-secondary/20 rounded-lg border">
                                                <div className="text-sm text-muted-foreground">Payback Period</div>
                                                {/* @ts-ignore */}
                                                <div className="text-2xl font-bold">{prediction.predictionResult?.paybackPeriodYears?.toFixed(1) || "0"} Years</div>
                                            </div>
                                            <div className="p-4 bg-secondary/20 rounded-lg border">
                                                <div className="text-sm text-muted-foreground">CO2 Savings</div>
                                                {/* @ts-ignore */}
                                                <div className="text-2xl font-bold">{prediction.predictionResult?.annualCo2ReductionKg?.toLocaleString() || "0"} kg/yr</div>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Investment</h4>
                                            <div className="flex justify-between text-sm border-b py-2">
                                                <span>Total CAPEX</span>
                                                {/* @ts-ignore */}
                                                <span>€ {prediction.predictionResult?.totalCapex?.toLocaleString() || "0"}</span>
                                            </div>
                                            <div className="flex justify-between text-sm border-b py-2">
                                                <span>Annual OPEX</span>
                                                {/* @ts-ignore */}
                                                <span>€ {prediction.predictionResult?.annualOpex?.toLocaleString() || "0"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Returns</h4>
                                            <div className="flex justify-between text-sm border-b py-2">
                                                <span>Annual Savings</span>
                                                {/* @ts-ignore */}
                                                <span>€ {prediction.predictionResult?.annualSavings?.toLocaleString() || "0"}</span>
                                            </div>
                                            <div className="flex justify-between text-sm border-b py-2">
                                                <span>Heat Sales</span>
                                                {/* @ts-ignore */}
                                                <span>{prediction.predictionResult?.annualHeatRecoveryKwh?.toLocaleString() || "0"} kWh</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            {prediction && (
                                <CardHeader className="border-t pt-6 mt-4">
                                    {/* Only show Report button here if desired, or relying on Tab 4 */}
                                    <Button className="w-full" variant="secondary" onClick={() => setActiveTab("report")}>Proceed to Report Generation</Button>
                                </CardHeader>
                            )}
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="report">
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg space-y-4">
                        <h3 className="text-xl font-semibold">CBA Report Generation</h3>
                        <p className="text-center text-muted-foreground max-w-md">
                            Generate a PDF report compliant with DIN EN 17463 / Energy Efficiency Act (EnEfG).
                        </p>

                        {prediction && (
                            <div className="w-full max-w-sm">

                                {/* @ts-ignore */}
                                <PDFDownloadLink
                                    document={<CBAReportDocument data={{ ...prediction, scenarioName: "CBA Draft " + new Date().toISOString() }} />}
                                    fileName="cba_report.pdf"
                                >
                                    {/* @ts-ignore */}
                                    {({ blob, url, loading, error }) => (
                                        <Button disabled={loading} className="w-full" variant="default">
                                            <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                                            {loading ? 'Generating Document...' : 'Download Compliant PDF Report'}
                                        </Button>
                                    )}
                                </PDFDownloadLink>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
