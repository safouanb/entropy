"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowPathIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

// Structured intake schema - capturing ASSUMPTIONS, not data
interface AssessmentIntake {
    projectName: string;
    // Data Center Side
    dcLocationLat: number;
    dcLocationLng: number;
    thermalLoadMinKw: number;
    thermalLoadMaxKw: number;
    availabilityProfile: "base" | "peak";
    uptimeConstraint: "99" | "99.9" | "99.99" | "99.999";
    existingCooling: boolean;
    investmentWillingness: "low" | "medium" | "high";
    // Utility Side
    distanceToOfftakerKm: number;
    heatDemandProfile: "constant" | "seasonal_winter" | "seasonal_summer";
    supplyTempRequiredC: number;
    existingDHInfra: boolean;
    // Context
    jurisdiction: "EU" | "DE" | "NL" | "BE" | "FR" | "UK" | "OTHER";
    applicableRegulation: "EED" | "EnEfG" | "local" | "none";
    timeHorizonYears: number;
}

const THERMAL_LOAD_PRESETS = [
    { label: "Small (100-500 kW)", min: 100, max: 500 },
    { label: "Medium (500-2000 kW)", min: 500, max: 2000 },
    { label: "Large (2-10 MW)", min: 2000, max: 10000 },
    { label: "Hyperscale (10+ MW)", min: 10000, max: 100000 },
];

export default function NewAssessmentPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const [form, setForm] = useState<AssessmentIntake>({
        projectName: "",
        dcLocationLat: 52.37,
        dcLocationLng: 4.90,
        thermalLoadMinKw: 500,
        thermalLoadMaxKw: 2000,
        availabilityProfile: "base",
        uptimeConstraint: "99.9",
        existingCooling: true,
        investmentWillingness: "medium",
        distanceToOfftakerKm: 2,
        heatDemandProfile: "constant",
        supplyTempRequiredC: 60,
        existingDHInfra: false,
        jurisdiction: "EU",
        applicableRegulation: "EED",
        timeHorizonYears: 15,
    });

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/assessments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to create assessment");
            const data = await res.json();
            router.push(`/assessment/${data.id}`);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <DocumentTextIcon className="h-8 w-8" />
                    New Feasibility Assessment
                </h1>
                <p className="text-muted-foreground">
                    Capture assumptions to generate a regulator-acceptable feasibility record.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 text-sm">
                {[
                    { n: 1, label: "Heat Source" },
                    { n: 2, label: "Heat Demand" },
                    { n: 3, label: "Regulatory Context" },
                ].map((s, i) => (
                    <div key={s.n} className="flex items-center">
                        <button
                            onClick={() => setStep(s.n)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${step === s.n
                                    ? "bg-primary text-primary-foreground"
                                    : step > s.n
                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        : "bg-muted text-muted-foreground"
                                }`}
                        >
                            <span className="font-semibold">{s.n}</span>
                            <span>{s.label}</span>
                        </button>
                        {i < 2 && <div className="w-8 h-px bg-border mx-2" />}
                    </div>
                ))}
            </div>

            {/* Step 1: Data Center / Heat Source */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Data Center (Heat Source)</CardTitle>
                        <CardDescription>
                            Define the thermal characteristics and constraints of your data center.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input
                                id="projectName"
                                value={form.projectName}
                                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                                placeholder="e.g., Amsterdam DC1 Heat Reuse Assessment"
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Latitude</Label>
                                <Input
                                    type="number"
                                    step="0.0001"
                                    value={form.dcLocationLat}
                                    onChange={(e) => setForm({ ...form, dcLocationLat: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Longitude</Label>
                                <Input
                                    type="number"
                                    step="0.0001"
                                    value={form.dcLocationLng}
                                    onChange={(e) => setForm({ ...form, dcLocationLng: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label>Thermal Load Range (kW)</Label>
                            <div className="flex gap-2 flex-wrap">
                                {THERMAL_LOAD_PRESETS.map((preset) => (
                                    <Button
                                        key={preset.label}
                                        variant={form.thermalLoadMinKw === preset.min && form.thermalLoadMaxKw === preset.max ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setForm({ ...form, thermalLoadMinKw: preset.min, thermalLoadMaxKw: preset.max })}
                                    >
                                        {preset.label}
                                    </Button>
                                ))}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Minimum: {form.thermalLoadMinKw.toLocaleString()} kW</span>
                                    <Slider
                                        value={[form.thermalLoadMinKw]}
                                        onValueChange={([v]) => setForm({ ...form, thermalLoadMinKw: Math.min(v, form.thermalLoadMaxKw) })}
                                        min={50}
                                        max={100000}
                                        step={50}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Maximum: {form.thermalLoadMaxKw.toLocaleString()} kW</span>
                                    <Slider
                                        value={[form.thermalLoadMaxKw]}
                                        onValueChange={([v]) => setForm({ ...form, thermalLoadMaxKw: Math.max(v, form.thermalLoadMinKw) })}
                                        min={50}
                                        max={100000}
                                        step={50}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Availability Profile</Label>
                            <RadioGroup
                                value={form.availabilityProfile}
                                onValueChange={(v) => setForm({ ...form, availabilityProfile: v as "base" | "peak" })}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="base" id="base" />
                                    <Label htmlFor="base" className="font-normal">Base Load (24/7)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="peak" id="peak" />
                                    <Label htmlFor="peak" className="font-normal">Peak Load (Variable)</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label>Uptime Requirement</Label>
                            <RadioGroup
                                value={form.uptimeConstraint}
                                onValueChange={(v) => setForm({ ...form, uptimeConstraint: v as any })}
                                className="flex flex-wrap gap-4"
                            >
                                {["99", "99.9", "99.99", "99.999"].map((u) => (
                                    <div key={u} className="flex items-center space-x-2">
                                        <RadioGroupItem value={u} id={`uptime-${u}`} />
                                        <Label htmlFor={`uptime-${u}`} className="font-normal">{u}%</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="existingCooling"
                                checked={form.existingCooling}
                                onCheckedChange={(v) => setForm({ ...form, existingCooling: v === true })}
                            />
                            <Label htmlFor="existingCooling" className="font-normal">Existing cooling infrastructure in place</Label>
                        </div>

                        <div className="space-y-3">
                            <Label>Investment Willingness</Label>
                            <RadioGroup
                                value={form.investmentWillingness}
                                onValueChange={(v) => setForm({ ...form, investmentWillingness: v as any })}
                                className="flex gap-4"
                            >
                                {[
                                    { value: "low", label: "Low (min CAPEX)" },
                                    { value: "medium", label: "Medium" },
                                    { value: "high", label: "High (max efficiency)" },
                                ].map((opt) => (
                                    <div key={opt.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={opt.value} id={`invest-${opt.value}`} />
                                        <Label htmlFor={`invest-${opt.value}`} className="font-normal">{opt.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setStep(2)}>Continue to Heat Demand →</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Utility / Off-taker Side */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Utility / Off-taker (Heat Demand)</CardTitle>
                        <CardDescription>
                            Define the heat demand characteristics and existing infrastructure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <Label>Distance to Off-taker: {form.distanceToOfftakerKm} km</Label>
                            <Slider
                                value={[form.distanceToOfftakerKm]}
                                onValueChange={([v]) => setForm({ ...form, distanceToOfftakerKm: v })}
                                min={0.1}
                                max={20}
                                step={0.1}
                            />
                            <p className="text-sm text-muted-foreground">
                                Typical: 0-2km (optimal), 2-5km (feasible), 5-10km (challenging), 10+ km (costly)
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Label>Heat Demand Profile</Label>
                            <RadioGroup
                                value={form.heatDemandProfile}
                                onValueChange={(v) => setForm({ ...form, heatDemandProfile: v as any })}
                                className="flex flex-wrap gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="constant" id="constant" />
                                    <Label htmlFor="constant" className="font-normal">Constant (Industrial)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="seasonal_winter" id="seasonal_winter" />
                                    <Label htmlFor="seasonal_winter" className="font-normal">Seasonal - Winter Peak</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="seasonal_summer" id="seasonal_summer" />
                                    <Label htmlFor="seasonal_summer" className="font-normal">Seasonal - Summer Peak</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <Label>Supply Temperature Requirement: {form.supplyTempRequiredC}°C</Label>
                            <Slider
                                value={[form.supplyTempRequiredC]}
                                onValueChange={([v]) => setForm({ ...form, supplyTempRequiredC: v })}
                                min={30}
                                max={120}
                                step={5}
                            />
                            <p className="text-sm text-muted-foreground">
                                30-50°C (low-temp DH), 50-70°C (standard DH), 70-90°C (industrial), 90°C+ (high-grade)
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="existingDHInfra"
                                checked={form.existingDHInfra}
                                onCheckedChange={(v) => setForm({ ...form, existingDHInfra: v === true })}
                            />
                            <Label htmlFor="existingDHInfra" className="font-normal">Existing district heating infrastructure nearby</Label>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                            <Button onClick={() => setStep(3)}>Continue to Regulatory Context →</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Context */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Regulatory Context</CardTitle>
                        <CardDescription>
                            Define the jurisdiction and applicable regulations for compliance assessment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Jurisdiction</Label>
                            <Select
                                value={form.jurisdiction}
                                onValueChange={(v) => setForm({ ...form, jurisdiction: v as any })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EU">European Union (General)</SelectItem>
                                    <SelectItem value="DE">Germany (EnEfG)</SelectItem>
                                    <SelectItem value="NL">Netherlands</SelectItem>
                                    <SelectItem value="BE">Belgium</SelectItem>
                                    <SelectItem value="FR">France</SelectItem>
                                    <SelectItem value="UK">United Kingdom</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label>Applicable Regulation</Label>
                            <RadioGroup
                                value={form.applicableRegulation}
                                onValueChange={(v) => setForm({ ...form, applicableRegulation: v as any })}
                                className="grid gap-2"
                            >
                                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="EED" id="eed" />
                                    <Label htmlFor="eed" className="flex-1 cursor-pointer">
                                        <span className="font-semibold">EU Energy Efficiency Directive (EED)</span>
                                        <p className="text-sm text-muted-foreground">Art. 26 requires cost-benefit analysis for new DCs &gt;100kW</p>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="EnEfG" id="enefg" />
                                    <Label htmlFor="enefg" className="flex-1 cursor-pointer">
                                        <span className="font-semibold">German Energy Efficiency Act (EnEfG)</span>
                                        <p className="text-sm text-muted-foreground">Mandatory heat reuse for DCs &gt;1MW from 2025</p>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="local" id="local" />
                                    <Label htmlFor="local" className="flex-1 cursor-pointer">
                                        <span className="font-semibold">Local Regulation</span>
                                        <p className="text-sm text-muted-foreground">Municipal or regional requirements</p>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="none" id="none" />
                                    <Label htmlFor="none" className="flex-1 cursor-pointer">
                                        <span className="font-semibold">No Specific Regulation</span>
                                        <p className="text-sm text-muted-foreground">Voluntary assessment for business case</p>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <Label>Assessment Time Horizon: {form.timeHorizonYears} years</Label>
                            <Slider
                                value={[form.timeHorizonYears]}
                                onValueChange={([v]) => setForm({ ...form, timeHorizonYears: v })}
                                min={5}
                                max={30}
                                step={1}
                            />
                            <p className="text-sm text-muted-foreground">
                                Typical: 10 years (conservative), 15 years (standard), 20+ years (long-term infrastructure)
                            </p>
                        </div>

                        <div className="flex justify-between pt-6 border-t">
                            <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
                            <Button onClick={handleSubmit} disabled={submitting || !form.projectName}>
                                {submitting && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Feasibility Assessment
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary Preview */}
            {form.projectName && (
                <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Assessment Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="grid gap-x-6 gap-y-1 md:grid-cols-3">
                            <div><span className="text-muted-foreground">Project:</span> {form.projectName || "—"}</div>
                            <div><span className="text-muted-foreground">Thermal Load:</span> {form.thermalLoadMinKw.toLocaleString()}–{form.thermalLoadMaxKw.toLocaleString()} kW</div>
                            <div><span className="text-muted-foreground">Distance:</span> {form.distanceToOfftakerKm} km</div>
                            <div><span className="text-muted-foreground">Jurisdiction:</span> {form.jurisdiction}</div>
                            <div><span className="text-muted-foreground">Regulation:</span> {form.applicableRegulation}</div>
                            <div><span className="text-muted-foreground">Time Horizon:</span> {form.timeHorizonYears} years</div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
