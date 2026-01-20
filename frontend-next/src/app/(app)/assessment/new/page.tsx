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
import { ArrowLeft, ArrowRight, Loader2, Shield, Building2, Thermometer, Scale } from "lucide-react";

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
    { n: 1, label: "Heat Source", icon: Building2 },
    { n: 2, label: "Heat Demand", icon: Thermometer },
    { n: 3, label: "Regulatory", icon: Scale },
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
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold">NEW DECISION RECORD</span>
                    </div>
                    <div className="w-16" />
                </div>
            </header>

            {/* Progress Steps */}
            <div className="border-b border-white/10 bg-white/5">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {steps.map((s, i) => (
                            <div key={s.n} className="flex items-center flex-1">
                                <button
                                    onClick={() => setStep(s.n)}
                                    className={`flex items-center gap-3 transition ${step === s.n
                                            ? 'text-white'
                                            : step > s.n
                                                ? 'text-emerald-400'
                                                : 'text-gray-500'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${step === s.n
                                            ? 'bg-white text-black'
                                            : step > s.n
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-white/10 text-gray-500'
                                        }`}>
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-xs text-gray-500">Step {s.n}</div>
                                        <div className="font-medium">{s.label}</div>
                                    </div>
                                </button>
                                {i < steps.length - 1 && (
                                    <div className={`flex-1 h-px mx-4 ${step > s.n ? 'bg-emerald-500' : 'bg-white/10'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Step 1: Data Center / Heat Source */}
                {step === 1 && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Data Center (Heat Source)</h2>
                            <p className="text-gray-400">Define the thermal characteristics of your facility.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-white">Project Name</Label>
                                <Input
                                    value={form.projectName}
                                    onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                                    placeholder="e.g., Frankfurt Hyperscale DC"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-white">Latitude</Label>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        value={form.dcLocationLat}
                                        onChange={(e) => setForm({ ...form, dcLocationLat: parseFloat(e.target.value) })}
                                        className="bg-white/5 border-white/10 text-white font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Longitude</Label>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        value={form.dcLocationLng}
                                        onChange={(e) => setForm({ ...form, dcLocationLng: parseFloat(e.target.value) })}
                                        className="bg-white/5 border-white/10 text-white font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-white">Thermal Load Range</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {THERMAL_LOAD_PRESETS.map((preset) => (
                                        <button
                                            key={preset.label}
                                            onClick={() => setForm({ ...form, thermalLoadMinKw: preset.min, thermalLoadMaxKw: preset.max })}
                                            className={`p-4 rounded-lg border transition text-left ${form.thermalLoadMinKw === preset.min && form.thermalLoadMaxKw === preset.max
                                                    ? 'border-emerald-500 bg-emerald-500/10'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-semibold">{preset.label}</div>
                                            <div className="text-sm text-gray-400">{preset.sub}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-white">Investment Willingness</Label>
                                <RadioGroup
                                    value={form.investmentWillingness}
                                    onValueChange={(v) => setForm({ ...form, investmentWillingness: v as any })}
                                    className="grid grid-cols-3 gap-3"
                                >
                                    {[
                                        { value: "low", label: "Low", sub: "Min CAPEX" },
                                        { value: "medium", label: "Medium", sub: "Balanced" },
                                        { value: "high", label: "High", sub: "Max efficiency" },
                                    ].map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={`p-4 rounded-lg border cursor-pointer transition ${form.investmentWillingness === opt.value
                                                    ? 'border-emerald-500 bg-emerald-500/10'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <RadioGroupItem value={opt.value} className="sr-only" />
                                            <div className="font-semibold">{opt.label}</div>
                                            <div className="text-sm text-gray-400">{opt.sub}</div>
                                        </label>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-white/10">
                            <Button
                                onClick={() => setStep(2)}
                                className="bg-white text-black hover:bg-gray-100 gap-2"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Heat Demand */}
                {step === 2 && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Utility / Off-taker (Heat Demand)</h2>
                            <p className="text-gray-400">Define the heat demand characteristics.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-white">Distance to Off-taker</Label>
                                    <span className="font-mono text-emerald-400">{form.distanceToOfftakerKm} km</span>
                                </div>
                                <Slider
                                    value={[form.distanceToOfftakerKm]}
                                    onValueChange={([v]) => setForm({ ...form, distanceToOfftakerKm: v })}
                                    min={0.1}
                                    max={20}
                                    step={0.1}
                                    className="py-4"
                                />
                                <p className="text-sm text-gray-500">
                                    0-2km optimal • 2-5km feasible • 5-10km challenging
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-white">Supply Temperature Required</Label>
                                    <span className="font-mono text-emerald-400">{form.supplyTempRequiredC}°C</span>
                                </div>
                                <Slider
                                    value={[form.supplyTempRequiredC]}
                                    onValueChange={([v]) => setForm({ ...form, supplyTempRequiredC: v })}
                                    min={30}
                                    max={120}
                                    step={5}
                                    className="py-4"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
                                <Checkbox
                                    id="existingDHInfra"
                                    checked={form.existingDHInfra}
                                    onCheckedChange={(v) => setForm({ ...form, existingDHInfra: v === true })}
                                />
                                <Label htmlFor="existingDHInfra" className="cursor-pointer">
                                    Existing district heating infrastructure nearby
                                </Label>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-white/10">
                            <Button variant="outline" onClick={() => setStep(1)} className="gap-2 border-white/20 text-white hover:bg-white/10">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Button>
                            <Button onClick={() => setStep(3)} className="bg-white text-black hover:bg-gray-100 gap-2">
                                Continue <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Regulatory Context */}
                {step === 3 && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Regulatory Context</h2>
                            <p className="text-gray-400">Define jurisdiction and applicable regulations.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-white">Jurisdiction</Label>
                                <Select
                                    value={form.jurisdiction}
                                    onValueChange={(v) => setForm({ ...form, jurisdiction: v as any })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
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
                                <Label className="text-white">Applicable Regulation</Label>
                                <RadioGroup
                                    value={form.applicableRegulation}
                                    onValueChange={(v) => setForm({ ...form, applicableRegulation: v as any })}
                                    className="space-y-3"
                                >
                                    {[
                                        { value: "EnEfG", label: "German Energy Efficiency Act (EnEfG)", desc: "Mandatory heat reuse for DCs >1MW from 2025" },
                                        { value: "EED", label: "EU Energy Efficiency Directive", desc: "Art. 26 cost-benefit analysis for new DCs >100kW" },
                                        { value: "local", label: "Local Regulation", desc: "Municipal or regional requirements" },
                                        { value: "none", label: "Voluntary", desc: "No regulation, business case only" },
                                    ].map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition ${form.applicableRegulation === opt.value
                                                    ? 'border-emerald-500 bg-emerald-500/10'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <RadioGroupItem value={opt.value} className="mt-1" />
                                            <div>
                                                <div className="font-semibold">{opt.label}</div>
                                                <div className="text-sm text-gray-400">{opt.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-white">Time Horizon</Label>
                                    <span className="font-mono text-emerald-400">{form.timeHorizonYears} years</span>
                                </div>
                                <Slider
                                    value={[form.timeHorizonYears]}
                                    onValueChange={([v]) => setForm({ ...form, timeHorizonYears: v })}
                                    min={5}
                                    max={30}
                                    step={1}
                                    className="py-4"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-white/10">
                            <Button variant="outline" onClick={() => setStep(2)} className="gap-2 border-white/20 text-white hover:bg-white/10">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting || !form.projectName}
                                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-2"
                            >
                                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Generate Decision Record
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Footer */}
            {form.projectName && (
                <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur border-t border-white/10">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-6">
                                <div><span className="text-gray-500">Project:</span> <span className="font-medium">{form.projectName}</span></div>
                                <div><span className="text-gray-500">Load:</span> <span className="font-mono">{form.thermalLoadMinKw.toLocaleString()}–{form.thermalLoadMaxKw.toLocaleString()} kW</span></div>
                                <div><span className="text-gray-500">Distance:</span> <span className="font-mono">{form.distanceToOfftakerKm} km</span></div>
                            </div>
                            <div className="text-gray-500 font-mono">{form.jurisdiction} • {form.applicableRegulation}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
