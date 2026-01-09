"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowPathIcon,
  GlobeEuropeAfricaIcon,
  CurrencyEuroIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCarbonCredit } from "@/hooks";
import { carbonCreditSchema, type CarbonCreditFormData } from "@/lib/validations";
import { DEFAULTS, VERIFICATION_STANDARDS, CREDIT_TYPES } from "@/lib/constants";

interface CarbonCreditFormProps {
  onSuccess?: () => void;
}

export function CarbonCreditForm({ onSuccess }: CarbonCreditFormProps) {
  const createMutation = useCreateCarbonCredit();

  const form = useForm<CarbonCreditFormData>({
    resolver: zodResolver(carbonCreditSchema),
    defaultValues: {
      projectName: "",
      creditType: "renewable_energy",
      pricePerTon: DEFAULTS.CARBON_PRICE_PER_TON,
      availableTons: DEFAULTS.AVAILABLE_TONS,
      vintageYear: new Date().getFullYear(),
      verificationStandard: "VCS",
      location: "",
      projectDescription: "",
    },
  });

  const onSubmit = async (data: CarbonCreditFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Carbon credit created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create carbon credit");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Project Information Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-100">
            <GlobeEuropeAfricaIcon className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Project Information</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="projectName" className="text-gray-700">Project Name *</Label>
            <Input
              id="projectName"
              placeholder="e.g., North Sea Wind Farm"
              className="border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
              {...form.register("projectName")}
            />
            {form.formState.errors.projectName && (
              <p className="text-sm text-red-500">{form.formState.errors.projectName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditType" className="text-gray-700">Credit Type</Label>
            <Select
              value={form.watch("creditType")}
              onValueChange={(v) => form.setValue("creditType", v)}
            >
              <SelectTrigger className="border-gray-200 focus:border-emerald-300 focus:ring-emerald-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CREDIT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vintageYear" className="text-gray-700">Vintage Year</Label>
            <Input
              id="vintageYear"
              type="number"
              min={2000}
              max={2100}
              className="border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
              {...form.register("vintageYear", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Verification & Location Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100">
            <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Verification & Location</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="verificationStandard" className="text-gray-700">Verification Standard</Label>
            <Select
              value={form.watch("verificationStandard")}
              onValueChange={(v) => form.setValue("verificationStandard", v)}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-300 focus:ring-blue-200">
                <SelectValue placeholder="Select standard" />
              </SelectTrigger>
              <SelectContent>
                {VERIFICATION_STANDARDS.map((std) => (
                  <SelectItem key={std.value} value={std.value}>
                    {std.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700">Location/Region</Label>
            <Input
              id="location"
              placeholder="e.g., Zeeland, Netherlands"
              className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              {...form.register("location")}
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-100">
            <CurrencyEuroIcon className="h-4 w-4 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Pricing & Availability</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pricePerTon" className="text-gray-700">Price per Ton (EUR) *</Label>
            <Input
              id="pricePerTon"
              type="number"
              step="0.01"
              min={0}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("pricePerTon", { valueAsNumber: true })}
            />
            {form.formState.errors.pricePerTon && (
              <p className="text-sm text-red-500">{form.formState.errors.pricePerTon.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableTons" className="text-gray-700">Available Tons *</Label>
            <Input
              id="availableTons"
              type="number"
              min={1}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("availableTons", { valueAsNumber: true })}
            />
            {form.formState.errors.availableTons && (
              <p className="text-sm text-red-500">{form.formState.errors.availableTons.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100">
            <DocumentTextIcon className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Description</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectDescription" className="text-gray-700">Project Description</Label>
          <Input
            id="projectDescription"
            placeholder="Brief description of the carbon credit project"
            className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            {...form.register("projectDescription")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25"
        >
          {createMutation.isPending ? (
            <>
              <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Carbon Credit"
          )}
        </Button>
      </div>
    </form>
  );
}
