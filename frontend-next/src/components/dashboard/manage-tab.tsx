"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Data Centers</CardTitle>
            <CardDescription>Manage your data center configurations</CardDescription>
          </div>
          <Dialog open={dcDialogOpen} onOpenChange={setDcDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Data Center</DialogTitle>
              </DialogHeader>
              <DataCenterForm onSuccess={() => setDcDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loadingDcs ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : dataCenters?.items?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data centers yet. Add one to get started.
            </p>
          ) : (
            <ul className="space-y-2">
              {dataCenters?.items?.map((dc) => (
                <li
                  key={dc.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{dc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {dc.total_it_load_kw} kW | PUE: {dc.pue || "N/A"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDc(dc.id)}
                    disabled={deleteDcMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Carbon Credits</CardTitle>
            <CardDescription>Manage carbon credit programs</CardDescription>
          </div>
          <Dialog open={ccDialogOpen} onOpenChange={setCcDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Carbon Credit</DialogTitle>
              </DialogHeader>
              <CarbonCreditForm onSuccess={() => setCcDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loadingCcs ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : carbonCredits?.items?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No carbon credits yet. Add one to include in predictions.
            </p>
          ) : (
            <ul className="space-y-2">
              {carbonCredits?.items?.map((cc) => (
                <li
                  key={cc.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{cc.project_name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${cc.price_per_ton}/ton | {cc.available_tons} tons available
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCc(cc.id)}
                    disabled={deleteCcMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
