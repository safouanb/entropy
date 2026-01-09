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
        latitude: DEFAULTS.DEFAULT_LATITUDE,
        longitude: DEFAULTS.DEFAULT_LONGITUDE,
      },
      address: "",
      dcType: "enterprise",
      totalItLoadKw: 1000,
      pue: DEFAULTS.PUE,
      utilizationPercent: DEFAULTS.UTILIZATION_PERCENT,
      coolingType: "air_cooled",
      energySource: "grid",
      renewablePercent: DEFAULTS.RENEWABLE_PERCENT,
      electricityCostKwh: DEFAULTS.ELECTRICITY_COST_KWH,
      operatingHoursYear: DEFAULTS.OPERATING_HOURS_YEAR,
      heatRecoveryEnabled: false,
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
      <div className="p-5 rounded-xl border border-gray-200 bg-white">
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
              placeholder="e.g., Amsterdam Data Center 1"
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
              placeholder="e.g., Science Park 404, Amsterdam"
              className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              {...form.register("address")}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white">
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
      <div className="p-5 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100">
            <Cpu className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Technical Specifications</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dcType" className="text-gray-700">Data Center Type</Label>
            <Select
              value={form.watch("dcType")}
              onValueChange={(v) => form.setValue("dcType", v)}
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
            <Label htmlFor="totalItLoadKw" className="text-gray-700">Total IT Load (kW) *</Label>
            <Input
              id="totalItLoadKw"
              type="number"
              min={1}
              className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              {...form.register("totalItLoadKw", { valueAsNumber: true })}
            />
            {form.formState.errors.totalItLoadKw && (
              <p className="text-sm text-red-500">{form.formState.errors.totalItLoadKw.message}</p>
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
            <Label htmlFor="coolingType" className="text-gray-700">Cooling Type</Label>
            <Select
              value={form.watch("coolingType")}
              onValueChange={(v) => form.setValue("coolingType", v)}
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
      <div className="p-5 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-100">
            <Settings className="h-4 w-4 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Operational Parameters</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="utilizationPercent" className="text-gray-700">Utilization (%)</Label>
            <Input
              id="utilizationPercent"
              type="number"
              min={0}
              max={100}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("utilizationPercent", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operatingHoursYear" className="text-gray-700">Operating Hours/Year</Label>
            <Input
              id="operatingHoursYear"
              type="number"
              min={1}
              max={8760}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("operatingHoursYear", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="energySource" className="text-gray-700">Energy Source</Label>
            <Select
              value={form.watch("energySource")}
              onValueChange={(v) => form.setValue("energySource", v)}
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
            <Label htmlFor="renewablePercent" className="text-gray-700">Renewable (%)</Label>
            <Input
              id="renewablePercent"
              type="number"
              min={0}
              max={100}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("renewablePercent", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricityCostKwh" className="text-gray-700">Electricity Cost (€/kWh)</Label>
            <Input
              id="electricityCostKwh"
              type="number"
              step="0.01"
              min={0}
              className="border-gray-200 focus:border-amber-300 focus:ring-amber-200"
              {...form.register("electricityCostKwh", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25"
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
