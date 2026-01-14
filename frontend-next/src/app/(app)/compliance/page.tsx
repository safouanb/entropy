"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { saveDataCenter, checkCompliance } from "@/lib/compliance";
import type { ComplianceRequest, ComplianceResult, Jurisdiction } from "@/lib/compliance";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowPathIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function CompliancePage() {
    const [result, setResult] = useState<ComplianceResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("");
    const [saving, setSaving] = useState(false);
    const [openSaveDialog, setOpenSaveDialog] = useState(false);

    const { register, handleSubmit, setValue, watch, getValues } = useForm<ComplianceRequest>({
        defaultValues: {
            jurisdiction: "EU",
            totalItLoadKw: 0,
            heatRecoveryReady: false,
            planDate: new Date().toISOString().split("T")[0],
        },
    });

    const onSubmit = async (data: ComplianceRequest) => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            // Ensure number conversion
            const payload = {
                ...data,
                totalItLoadKw: Number(data.totalItLoadKw),
                planDate: new Date(data.planDate).toISOString(),
            };
            const res = await checkCompliance(payload);
            setResult(res);
        } catch (err) {
            setError("Failed to check compliance. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!projectName) return;
        setSaving(true);
        try {
            const data = getValues();
            // Ensure number conversion
            const payload = {
                ...data,
                totalItLoadKw: Number(data.totalItLoadKw),
                planDate: new Date(data.planDate).toISOString(),
            };
            await saveDataCenter(payload, projectName);
            toast.success("Project saved successfully!");
            setOpenSaveDialog(false);
            // Optional: Redirect to dashboard or cba
        } catch (err) {
            toast.error("Failed to save project.");
        } finally {
            setSaving(false);
        }
    };

    const jurisdiction = watch("jurisdiction");

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Regulatory Compliance Checker</h1>
                <p className="text-muted-foreground">
                    Determine your obligations under EED, EnEfG, and other heat reuse regulations.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Input Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>Enter technical parameters of your Data Center.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="compliance-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                                <Select onValueChange={(v) => setValue("jurisdiction", v as Jurisdiction)} defaultValue="EU">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Jurisdiction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EU">European Union (EED)</SelectItem>
                                        <SelectItem value="DE">Germany (EnEfG)</SelectItem>
                                        <SelectItem value="NL">Netherlands (Wcw)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="totalItLoadKw">Rated IT Load (kW)</Label>
                                <Input type="number" step="10" {...register("totalItLoadKw", { required: true, min: 0 })} placeholder="e.g. 2500" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="planDate">Commissioning Date (Planned)</Label>
                                <Input type="date" {...register("planDate")} />
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="heatRecoveryReady"
                                    onCheckedChange={(c) => setValue("heatRecoveryReady", c as boolean)}
                                />
                                <Label htmlFor="heatRecoveryReady">Technical Heat Recovery Readiness?</Label>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button form="compliance-form" type="submit" className="w-full" disabled={loading}>
                            {loading && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
                            Check Compliance
                        </Button>
                    </CardFooter>
                </Card>

                {/* Results Display */}
                <div className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!result && !loading && !error && (
                        <div className="flex h-full flex-col justify-center items-center text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                            <InformationCircleIcon className="h-10 w-10 mb-4 opacity-50" />
                            <p>Enter your project details to see regulatory impact.</p>
                        </div>
                    )}

                    {result && (
                        <Card className={`border-l-4 ${result.status === "MANDATORY" ? "border-l-red-500" : result.status === "VOLUNTARY" ? "border-l-green-500" : "border-l-yellow-500"}`}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {result.status}
                                    {result.status === "MANDATORY" && <ExclamationTriangleIcon className="text-red-500 h-5 w-5" />}
                                    {result.status === "VOLUNTARY" && <CheckCircleIcon className="text-green-500 h-5 w-5" />}
                                </CardTitle>
                                <CardDescription>Under {result.applicableLaw}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {result.complianceDeadline && (
                                    <div className="bg-secondary/50 p-3 rounded-md text-sm">
                                        <span className="font-semibold">Deadline:</span> {new Date(result.complianceDeadline).toLocaleDateString()}
                                    </div>
                                )}

                                <div>
                                    <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Reasoning</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {result.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                </div>

                                {result.remediationSteps.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Recommended Next Steps</h4>
                                        <div className="bg-muted p-4 rounded-md space-y-2">
                                            {result.remediationSteps.map((step, i) => (
                                                <div key={i} className="flex gap-2 text-sm">
                                                    <CheckCircleIcon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                                    <span>{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Dialog open={openSaveDialog} onOpenChange={setOpenSaveDialog}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" variant="outline">
                                            Save to Dashboard
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Save Project</DialogTitle>
                                            <DialogDescription>
                                                Save this data center profile to your dashboard to reuse it for Cost-Benefit Analysis (CBA) and Marketplace matching.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <Label htmlFor="projectName" className="mb-2 block">Project Name</Label>
                                            <Input
                                                id="projectName"
                                                placeholder="e.g. Frankfurt DC 1"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setOpenSaveDialog(false)}>Cancel</Button>
                                            <Button onClick={handleSave} disabled={saving || !projectName}>
                                                {saving && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
                                                Save Project
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
