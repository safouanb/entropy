"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Building2, MapPin, Cpu, Settings } from "lucide-react";
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
      {/* Basic Information Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Basic Information</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., SF Data Center 1"
              className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700">Address</Label>
            <Input
              id="address"
              placeholder="e.g., 123 Tech Blvd, San Francisco"
              className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              {...form.register("address")}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-100">
            <MapPin className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Location</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude" className="text-gray-700">Latitude *</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              className="border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
              {...form.register("location.latitude", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude" className="text-gray-700">Longitude *</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              className="border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
              {...form.register("location.longitude", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100">
            <Cpu className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Technical Specifications</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dc_type" className="text-gray-700">Data Center Type</Label>
            <Select
              value={form.watch("dc_type")}
              onValueChange={(v) => form.setValue("dc_type", v)}
            >
              <SelectTrigger className="border-gray-200 focus:border-purple-300 focus:ring-purple-200">
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
            <Label htmlFor="total_it_load_kw" className="text-gray-700">Total IT Load (kW) *</Label>
            <Input
              id="total_it_load_kw"
              type="number"
              min={1}
              className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              {...form.register("total_it_load_kw", { valueAsNumber: true })}
            />
            {form.formState.errors.total_it_load_kw && (
              <p className="text-sm text-red-500">{form.formState.errors.total_it_load_kw.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pue" className="text-gray-700">PUE (1.0 - 3.0)</Label>
            <Input
              id="pue"
              type="number"
              step="0.1"
              min={1}
              max={3}
              className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              {...form.register("pue", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cooling_type" className="text-gray-700">Cooling Type</Label>
            <Select
              value={form.watch("cooling_type")}
              onValueChange={(v) => form.setValue("cooling_type", v)}
            >
              <SelectTrigger className="border-gray-200 focus:border-purple-300 focus:ring-purple-200">
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

      {/* Operational Parameters Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-100">
            <Settings className="h-4 w-4 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Operational Parameters</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="utilization_percent" className="text-gray-700">Utilization (%)</Label>
            <Input
              id="utilization_percent"
              type="number"
              min={0}
              max={100}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("utilization_percent", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operating_hours_year" className="text-gray-700">Operating Hours/Year</Label>
            <Input
              id="operating_hours_year"
              type="number"
              min={1}
              max={8760}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("operating_hours_year", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="energy_source" className="text-gray-700">Energy Source</Label>
            <Select
              value={form.watch("energy_source")}
              onValueChange={(v) => form.setValue("energy_source", v)}
            >
              <SelectTrigger className="border-gray-200 focus:border-amber-300 focus:ring-amber-200">
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
            <Label htmlFor="renewable_percent" className="text-gray-700">Renewable (%)</Label>
            <Input
              id="renewable_percent"
              type="number"
              min={0}
              max={100}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("renewable_percent", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricity_cost_kwh" className="text-gray-700">Electricity Cost ($/kWh)</Label>
            <Input
              id="electricity_cost_kwh"
              type="number"
              step="0.01"
              min={0}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("electricity_cost_kwh", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/25"
        >
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
