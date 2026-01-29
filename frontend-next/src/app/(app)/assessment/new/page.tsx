"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2, Building2, Thermometer, Scale, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentIntake {
    projectName: string;
    dcLocationLat: number;
    dcLocationLng: number;
    thermalLoadMinKw: number;
    thermalLoadMaxKw: number;
    availabilityProfile: "base" | "peak";
    uptimeConstraint: "99" | "99.9" | "99.99" | "99.999";
    existingCooling: boolean;
    investmentWillingness: "low" | "medium" | "high";
    distanceToOfftakerKm: number;
    heatDemandProfile: "constant" | "seasonal_winter" | "seasonal_summer";
    supplyTempRequiredC: number;
    existingDHInfra: boolean;
    jurisdiction: "EU" | "DE" | "NL" | "BE" | "FR" | "UK" | "OTHER";
    applicableRegulation: "EED" | "EnEfG" | "local" | "none";
    timeHorizonYears: number;
}

const THERMAL_LOAD_PRESETS = [
    { label: "Small", sub: "100-500 kW", min: 100, max: 500 },
    { label: "Medium", sub: "500-2 MW", min: 500, max: 2000 },
    { label: "Large", sub: "2-10 MW", min: 2000, max: 10000 },
    { label: "Hyperscale", sub: "10+ MW", min: 10000, max: 100000 },
];

const steps = [
    { n: 1, label: "Heat Source", description: "Data Center Specs", icon: Building2 },
    { n: 2, label: "Heat Demand", description: "Off-taker Profile", icon: Thermometer },
    { n: 3, label: "Regulatory", description: "Jurisdiction & Compliance", icon: Scale },
];

export default function NewAssessmentPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const [form, setForm] = useState<AssessmentIntake>({
        projectName: "",
        dcLocationLat: 52.37,
        dcLocationLng: 4.90,
        thermalLoadMinKw: 2000,
        thermalLoadMaxKw: 10000,
        availabilityProfile: "base",
        uptimeConstraint: "99.9",
        existingCooling: true,
        investmentWillingness: "medium",
        distanceToOfftakerKm: 2,
        heatDemandProfile: "constant",
        supplyTempRequiredC: 60,
        existingDHInfra: false,
        jurisdiction: "DE",
        applicableRegulation: "EnEfG",
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
        <div className="max-w-5xl mx-auto space-y-8 pb-32">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Link href="/assessment" className="hover:text-white transition-colors">Assessments</Link>
                        <span>/</span>
                        <span>New Project</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">New Assessment</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                {/* Main Form Area */}
                <div className="space-y-6">
                    {/* Stepper */}
                    <nav aria-label="Progress" className="mb-8">
                        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                            {steps.map((s) => (
                                <li key={s.label} className="md:flex-1">
                                    <button
                                        onClick={() => s.n < step ? setStep(s.n) : null}
                                        disabled={s.n > step}
                                        className={cn(
                                            "group flex flex-col w-full border-t-4 py-2 hover:border-emerald-500/50 transition-all text-left",
                                            step >= s.n ? "border-emerald-500" : "border-white/10",
                                        )}
                                    >
                                        <span className={cn(
                                            "text-xs font-semibold tracking-wide uppercase group-hover:text-emerald-400 transition-colors",
                                            step >= s.n ? "text-emerald-500" : "text-muted-foreground"
                                        )}>
                                            Step {s.n}
                                        </span>
                                        <span className="text-sm font-medium text-white mt-0.5">{s.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <Card className="border-sidebar-border bg-sidebar/50 shadow-sm backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>{steps[step - 1].label}</CardTitle>
                            <CardDescription>{steps[step - 1].description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Step 1: Data Center / Heat Source */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                                    <div className="space-y-2">
                                        <Label>Project Name</Label>
                                        <Input
                                            value={form.projectName}
                                            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                                            placeholder="e.g., Frankfurt Hyperscale DC 01"
                                            className="bg-zinc-900/50 border-white/10"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Latitude</Label>
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                value={form.dcLocationLat}
                                                onChange={(e) => setForm({ ...form, dcLocationLat: parseFloat(e.target.value) })}
                                                className="bg-zinc-900/50 border-white/10 font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Longitude</Label>
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                value={form.dcLocationLng}
                                                onChange={(e) => setForm({ ...form, dcLocationLng: parseFloat(e.target.value) })}
                                                className="bg-zinc-900/50 border-white/10 font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Thermal Load Range</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {THERMAL_LOAD_PRESETS.map((preset) => (
                                                <button
                                                    key={preset.label}
                                                    onClick={() => setForm({ ...form, thermalLoadMinKw: preset.min, thermalLoadMaxKw: preset.max })}
                                                    className={cn(
                                                        "flex flex-col items-start p-3 rounded-md border text-left transition-all hover:bg-white/5",
                                                        form.thermalLoadMinKw === preset.min
                                                            ? "border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/10 ring-1 ring-emerald-500/50"
                                                            : "border-white/10 bg-zinc-900/30"
                                                    )}
                                                >
                                                    <span className="font-medium text-sm text-white">{preset.label}</span>
                                                    <span className="text-xs text-muted-foreground">{preset.sub}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Investment Willingness</Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { value: "low", label: "Low", sub: "Min CAPEX" },
                                                { value: "medium", label: "Medium", sub: "Balanced" },
                                                { value: "high", label: "High", sub: "Efficiency" },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setForm({ ...form, investmentWillingness: opt.value as any })}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all hover:bg-white/5",
                                                        form.investmentWillingness === opt.value
                                                            ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50"
                                                            : "border-white/10 bg-zinc-900/30"
                                                    )}
                                                >
                                                    <span className="font-medium text-sm text-white">{opt.label}</span>
                                                    <span className="text-xs text-muted-foreground">{opt.sub}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Heat Demand */}
                            {step === 2 && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 fade-in">
                                    <div className="bg-zinc-900/30 rounded-lg p-5 border border-white/5 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <Label>Distance to Off-taker</Label>
                                                <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm">
                                                    {form.distanceToOfftakerKm} km
                                                </div>
                                            </div>
                                            <Slider
                                                value={[form.distanceToOfftakerKm]}
                                                onValueChange={([v]) => setForm({ ...form, distanceToOfftakerKm: v })}
                                                min={0.1}
                                                max={20}
                                                step={0.1}
                                                className="py-2"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                                                <span>0km</span>
                                                <span>10km</span>
                                                <span>20km</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <Label>Supply Temperature Required</Label>
                                                <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-sm">
                                                    {form.supplyTempRequiredC}°C
                                                </div>
                                            </div>
                                            <Slider
                                                value={[form.supplyTempRequiredC]}
                                                onValueChange={([v]) => setForm({ ...form, supplyTempRequiredC: v })}
                                                min={30}
                                                max={120}
                                                step={5}
                                                className="py-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors cursor-pointer" onClick={() => setForm({ ...form, existingDHInfra: !form.existingDHInfra })}>
                                        <Checkbox
                                            id="existingDHInfra"
                                            checked={form.existingDHInfra}
                                            onCheckedChange={(v) => setForm({ ...form, existingDHInfra: v === true })}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="existingDHInfra"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-white"
                                            >
                                                Existing District Heating Infrastructure
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                Is there a network within 500m of the site?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Regulatory Context */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                                    <div className="space-y-3">
                                        <Label>Jurisdiction</Label>
                                        <Select
                                            value={form.jurisdiction}
                                            onValueChange={(v) => setForm({ ...form, jurisdiction: v as any })}
                                        >
                                            <SelectTrigger className="bg-zinc-900/50 border-white/10 h-11">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DE">Germany (EnEfG)</SelectItem>
                                                <SelectItem value="NL">Netherlands</SelectItem>
                                                <SelectItem value="EU">European Union (General)</SelectItem>
                                                <SelectItem value="BE">Belgium</SelectItem>
                                                <SelectItem value="FR">France</SelectItem>
                                                <SelectItem value="UK">United Kingdom</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Applicable Regulation</Label>
                                        <div className="space-y-2">
                                            {[
                                                { value: "EnEfG", label: "German Energy Efficiency Act (EnEfG)", desc: "Mandatory heat reuse for DCs >1MW" },
                                                { value: "EED", label: "EU Energy Efficiency Directive", desc: "Art. 26 cost-benefit analysis" },
                                                { value: "local", label: "Local Regulation", desc: "Municipal requirements" },
                                                { value: "none", label: "Voluntary", desc: "No regulation, business case only" },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setForm({ ...form, applicableRegulation: opt.value as any })}
                                                    className={cn(
                                                        "flex items-center w-full p-3 rounded-md border text-left transition-all hover:bg-white/5",
                                                        form.applicableRegulation === opt.value
                                                            ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50"
                                                            : "border-white/10 bg-zinc-900/30"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full border flex items-center justify-center mr-3 transition-colors",
                                                        form.applicableRegulation === opt.value ? "border-emerald-500" : "border-white/30"
                                                    )}>
                                                        {form.applicableRegulation === opt.value && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm text-white">{opt.label}</div>
                                                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <Label>Time Horizon</Label>
                                            <span className="font-mono text-emerald-400">{form.timeHorizonYears} years</span>
                                        </div>
                                        <Slider
                                            value={[form.timeHorizonYears]}
                                            onValueChange={([v]) => setForm({ ...form, timeHorizonYears: v })}
                                            min={5}
                                            max={30}
                                            step={1}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between pt-6 border-t border-white/5 bg-white/[0.01]">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(step - 1)}
                                disabled={step === 1}
                                className="text-muted-foreground hover:text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>

                            {step < 3 ? (
                                <Button
                                    onClick={() => setStep(step + 1)}
                                    className="bg-white text-black hover:bg-zinc-200"
                                >
                                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitting || !form.projectName}
                                    className="bg-emerald-500 text-black hover:bg-emerald-400 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    Generate Record
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                {/* Sidebar Preview */}
                <div className="hidden lg:block space-y-6">
                    <div className="sticky top-24">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Live Preview</h3>
                        <Card className="bg-zinc-900/50 border-white/10 overflow-hidden">
                            <div className="h-2 w-full bg-zinc-800">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                                    style={{ width: `${(step / 3) * 100}%` }}
                                />
                            </div>
                            <div className="p-5 space-y-6">
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Project</div>
                                    <div className="font-medium text-white text-lg leading-tight">
                                        {form.projectName || <span className="text-zinc-600 italic">Untitled Project</span>}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                        <span className="text-muted-foreground">Coordinates</span>
                                        <span className="font-mono text-white/80">{form.dcLocationLat.toFixed(3)}, {form.dcLocationLng.toFixed(3)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                        <span className="text-muted-foreground">Load</span>
                                        <span className="font-mono text-white/80">{form.thermalLoadMinKw / 1000}-{form.thermalLoadMaxKw / 1000} MW</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                        <span className="text-muted-foreground">Distance</span>
                                        <span className="font-mono text-white/80">{form.distanceToOfftakerKm} km</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pb-2">
                                        <span className="text-muted-foreground">Regulation</span>
                                        <span className="font-mono text-emerald-400">{form.applicableRegulation}</span>
                                    </div>
                                </div>

                                <div className="bg-emerald-500/10 rounded border border-emerald-500/20 p-3 flex gap-3 items-start">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                    <div className="text-xs text-emerald-300/80">
                                        Ready to generate compliance scenario analysis for {form.jurisdiction}.
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
