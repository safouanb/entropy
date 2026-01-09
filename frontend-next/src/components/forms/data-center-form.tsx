"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDataCenter } from "@/hooks";
import { dataCenterSchema, type DataCenterFormData } from "@/lib/validations";
import { DEFAULTS, DC_TYPES, COOLING_TYPES, ENERGY_SOURCES } from "@/lib/constants";

interface DataCenterFormProps {
  onSuccess?: () => void;
}

export function DataCenterForm({ onSuccess }: DataCenterFormProps) {
  const createMutation = useCreateDataCenter();

  const form = useForm<DataCenterFormData>({
    resolver: zodResolver(dataCenterSchema),
    defaultValues: {
      name: "",
      location: {
        latitude: DEFAULTS.SF_LATITUDE,
        longitude: DEFAULTS.SF_LONGITUDE,
      },
      address: "",
      dc_type: "enterprise",
      total_it_load_kw: 1000,
      pue: DEFAULTS.PUE,
      utilization_percent: DEFAULTS.UTILIZATION_PERCENT,
      cooling_type: "air_cooled",
      energy_source: "grid",
      renewable_percent: DEFAULTS.RENEWABLE_PERCENT,
      electricity_cost_kwh: DEFAULTS.ELECTRICITY_COST_KWH,
      operating_hours_year: DEFAULTS.OPERATING_HOURS_YEAR,
      heat_recovery_enabled: false,
    },
  });

  const onSubmit = async (data: DataCenterFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Data center created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create data center");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., SF Data Center 1"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="e.g., 123 Tech Blvd, San Francisco"
              {...form.register("address")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude *</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              {...form.register("location.latitude", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude *</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              {...form.register("location.longitude", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-3">Technical Specifications</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dc_type">Data Center Type</Label>
            <Select
              value={form.watch("dc_type")}
              onValueChange={(v) => form.setValue("dc_type", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {DC_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_it_load_kw">Total IT Load (kW) *</Label>
            <Input
              id="total_it_load_kw"
              type="number"
              min={1}
              {...form.register("total_it_load_kw", { valueAsNumber: true })}
            />
            {form.formState.errors.total_it_load_kw && (
              <p className="text-sm text-red-500">{form.formState.errors.total_it_load_kw.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pue">PUE (1.0 - 3.0)</Label>
            <Input
              id="pue"
              type="number"
              step="0.1"
              min={1}
              max={3}
              {...form.register("pue", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cooling_type">Cooling Type</Label>
            <Select
              value={form.watch("cooling_type")}
              onValueChange={(v) => form.setValue("cooling_type", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cooling type" />
              </SelectTrigger>
              <SelectContent>
                {COOLING_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-3">Operational Parameters</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="utilization_percent">Utilization (%)</Label>
            <Input
              id="utilization_percent"
              type="number"
              min={0}
              max={100}
              {...form.register("utilization_percent", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operating_hours_year">Operating Hours/Year</Label>
            <Input
              id="operating_hours_year"
              type="number"
              min={1}
              max={8760}
              {...form.register("operating_hours_year", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="energy_source">Energy Source</Label>
            <Select
              value={form.watch("energy_source")}
              onValueChange={(v) => form.setValue("energy_source", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select energy source" />
              </SelectTrigger>
              <SelectContent>
                {ENERGY_SOURCES.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewable_percent">Renewable (%)</Label>
            <Input
              id="renewable_percent"
              type="number"
              min={0}
              max={100}
              {...form.register("renewable_percent", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricity_cost_kwh">Electricity Cost ($/kWh)</Label>
            <Input
              id="electricity_cost_kwh"
              type="number"
              step="0.01"
              min={0}
              {...form.register("electricity_cost_kwh", { valueAsNumber: true })}
            />
          </div>
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
            "Create Data Center"
          )}
        </Button>
      </div>
    </form>
  );
}
