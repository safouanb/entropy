"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground mt-1">Deep dive into thermal potential and grid performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Heat Potentail", value: "2.4 TWh/a" },
                    { label: "Carbon Savings", value: "850 kt" },
                    { label: "Avg. Payback", value: "4.2 Years" },
                    { label: "Grid Density", value: "High" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-sidebar border-white/5">
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="h-[400px] rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center dashed-border">
                <div className="text-center">
                    <ArrowTrendingUpIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">Interactive Charts</h3>
                    <p className="text-sm text-muted-foreground">Connect your data warehouse to enable deep analytics.</p>
                </div>
            </div>
        </div>
    );
}
