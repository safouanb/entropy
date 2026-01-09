"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="project_name">Project Name *</Label>
          <Input
            id="project_name"
            placeholder="e.g., California Solar Farm Credits"
            {...form.register("project_name")}
          />
          {form.formState.errors.project_name && (
            <p className="text-sm text-red-500">{form.formState.errors.project_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="credit_type">Credit Type</Label>
          <Select
            value={form.watch("credit_type")}
            onValueChange={(v) => form.setValue("credit_type", v)}
          >
            <SelectTrigger>
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
          <Label htmlFor="verification_standard">Verification Standard</Label>
          <Select
            value={form.watch("verification_standard")}
            onValueChange={(v) => form.setValue("verification_standard", v)}
          >
            <SelectTrigger>
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
          <Label htmlFor="price_per_ton">Price per Ton (USD) *</Label>
          <Input
            id="price_per_ton"
            type="number"
            step="0.01"
            min={0}
            {...form.register("price_per_ton", { valueAsNumber: true })}
          />
          {form.formState.errors.price_per_ton && (
            <p className="text-sm text-red-500">{form.formState.errors.price_per_ton.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="available_tons">Available Tons *</Label>
          <Input
            id="available_tons"
            type="number"
            min={1}
            {...form.register("available_tons", { valueAsNumber: true })}
          />
          {form.formState.errors.available_tons && (
            <p className="text-sm text-red-500">{form.formState.errors.available_tons.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vintage_year">Vintage Year</Label>
          <Input
            id="vintage_year"
            type="number"
            min={2000}
            max={2100}
            {...form.register("vintage_year", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location/Region</Label>
          <Input
            id="location"
            placeholder="e.g., California, USA"
            {...form.register("location")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="project_description">Description</Label>
          <Input
            id="project_description"
            placeholder="Brief description of the carbon credit project"
            {...form.register("project_description")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={createMutation.isPending}>
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
