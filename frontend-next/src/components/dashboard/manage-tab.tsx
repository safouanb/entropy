"use client";

import { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  ServerIcon,
  GlobeEuropeAfricaIcon,
  BoltIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataCenters, useCarbonCredits, useDeleteDataCenter, useDeleteCarbonCredit } from "@/hooks";
import { DataCenterForm } from "@/components/forms/data-center-form";
import { CarbonCreditForm } from "@/components/forms/carbon-credit-form";

export function ManageTab() {
  const [dcDialogOpen, setDcDialogOpen] = useState(false);
  const [ccDialogOpen, setCcDialogOpen] = useState(false);

  const { data: dataCenters, isLoading: loadingDcs } = useDataCenters();
  const { data: carbonCredits, isLoading: loadingCcs } = useCarbonCredits();
  const deleteDcMutation = useDeleteDataCenter();
  const deleteCcMutation = useDeleteCarbonCredit();

  const handleDeleteDc = async (id: number) => {
    if (!confirm("Are you sure you want to delete this data center?")) return;
    try {
      await deleteDcMutation.mutateAsync(id);
      toast.success("Data center deleted");
    } catch {
      toast.error("Failed to delete data center");
    }
  };

  const handleDeleteCc = async (id: number) => {
    if (!confirm("Are you sure you want to delete this carbon credit?")) return;
    try {
      await deleteCcMutation.mutateAsync(id);
      toast.success("Carbon credit deleted");
    } catch {
      toast.error("Failed to delete carbon credit");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Data Centers Section */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/25">
                <ServerIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Centers</h3>
                <p className="text-sm text-gray-500">Manage your facilities</p>
              </div>
            </div>
            <Dialog open={dcDialogOpen} onOpenChange={setDcDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/20">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <BuildingOffice2Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    Add Data Center
                  </DialogTitle>
                </DialogHeader>
                <DataCenterForm onSuccess={() => setDcDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="p-4">
          {loadingDcs ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : dataCenters?.items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <ServerIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-1">No data centers yet</p>
              <p className="text-sm text-gray-400">Add one to get started</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {dataCenters?.items?.map((dc) => (
                <li
                  key={dc.id}
                  className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <BuildingOffice2Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dc.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                          <BoltIcon className="h-3.5 w-3.5" />
                          {dc.totalItLoadKw} kW
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">
                          PUE: {dc.pue || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    onClick={() => handleDeleteDc(dc.id)}
                    disabled={deleteDcMutation.isPending}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Carbon Credits Section */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
                <GlobeEuropeAfricaIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Carbon Credits</h3>
                <p className="text-sm text-gray-500">Manage offset programs</p>
              </div>
            </div>
            <Dialog open={ccDialogOpen} onOpenChange={setCcDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <GlobeEuropeAfricaIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    Add Carbon Credit
                  </DialogTitle>
                </DialogHeader>
                <CarbonCreditForm onSuccess={() => setCcDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="p-4">
          {loadingCcs ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : carbonCredits?.items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <GlobeEuropeAfricaIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-1">No carbon credits yet</p>
              <p className="text-sm text-gray-400">Add one to include in predictions</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {carbonCredits?.items?.map((cc) => (
                <li
                  key={cc.id}
                  className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                      <GlobeEuropeAfricaIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cc.projectName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                          <CurrencyDollarIcon className="h-3.5 w-3.5" />
                          ${cc.pricePerTon}/ton
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-emerald-600 font-medium">
                          {cc.availableTons} tons available
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    onClick={() => handleDeleteCc(cc.id)}
                    disabled={deleteCcMutation.isPending}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
