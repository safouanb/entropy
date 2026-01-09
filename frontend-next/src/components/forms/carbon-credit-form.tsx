"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Leaf, DollarSign, Shield, FileText } from "lucide-react";
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
      project_name: "",
      credit_type: "renewable_energy",
      price_per_ton: DEFAULTS.CARBON_PRICE_PER_TON,
      available_tons: DEFAULTS.AVAILABLE_TONS,
      vintage_year: new Date().getFullYear(),
      verification_standard: "VCS",
      location: "",
      project_description: "",
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
      <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-100">
            <Leaf className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Project Information</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="project_name" className="text-gray-700">Project Name *</Label>
            <Input
              id="project_name"
              placeholder="e.g., California Solar Farm Credits"
              className="border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
              {...form.register("project_name")}
            />
            {form.formState.errors.project_name && (
              <p className="text-sm text-red-500">{form.formState.errors.project_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="credit_type" className="text-gray-700">Credit Type</Label>
            <Select
              value={form.watch("credit_type")}
              onValueChange={(v) => form.setValue("credit_type", v)}
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
            <Label htmlFor="vintage_year" className="text-gray-700">Vintage Year</Label>
            <Input
              id="vintage_year"
              type="number"
              min={2000}
              max={2100}
              className="border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
              {...form.register("vintage_year", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Verification & Location Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Verification & Location</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="verification_standard" className="text-gray-700">Verification Standard</Label>
            <Select
              value={form.watch("verification_standard")}
              onValueChange={(v) => form.setValue("verification_standard", v)}
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
              placeholder="e.g., California, USA"
              className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              {...form.register("location")}
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-100">
            <DollarSign className="h-4 w-4 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Pricing & Availability</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price_per_ton" className="text-gray-700">Price per Ton (USD) *</Label>
            <Input
              id="price_per_ton"
              type="number"
              step="0.01"
              min={0}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("price_per_ton", { valueAsNumber: true })}
            />
            {form.formState.errors.price_per_ton && (
              <p className="text-sm text-red-500">{form.formState.errors.price_per_ton.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="available_tons" className="text-gray-700">Available Tons *</Label>
            <Input
              id="available_tons"
              type="number"
              min={1}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("available_tons", { valueAsNumber: true })}
            />
            {form.formState.errors.available_tons && (
              <p className="text-sm text-red-500">{form.formState.errors.available_tons.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100">
            <FileText className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Description</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="project_description" className="text-gray-700">Project Description</Label>
          <Input
            id="project_description"
            placeholder="Brief description of the carbon credit project"
            className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            {...form.register("project_description")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
