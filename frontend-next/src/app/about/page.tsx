"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Leaf, Building2, Users } from "lucide-react";
import { useAnalytics } from "@/hooks";
import { formatNumber } from "@/lib/constants";

export default function AboutPage() {
  const { data: analytics } = useAnalytics();

  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About PyRecycleHeat</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transforming waste heat from data centers into sustainable urban heating solutions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <StatCard
          icon={Zap}
          label="Energy Efficiency"
          value="85%"
          description="Average heat recovery rate"
        />
        <StatCard
          icon={Building2}
          label="Data Centers"
          value={formatNumber(analytics?.totalDataCenters || 0)}
          description="Active in system"
        />
        <StatCard
          icon={Leaf}
          label="CO2 Reduction"
          value="40%"
          description="Average emissions reduction"
        />
        <StatCard
          icon={Users}
          label="Predictions"
          value={formatNumber(analytics?.totalPredictions || 0)}
          description="Analyses completed"
        />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Data centers consume approximately 1-2% of global electricity, with 30-40% of that
            energy being released as waste heat. PyRecycleHeat bridges the gap between this
            untapped resource and urban heating needs.
          </p>
          <p>
            Our platform provides comprehensive feasibility analysis, financial modeling, and
            carbon accounting to help infrastructure investors, data center operators, and
            city planners make informed decisions about heat recovery projects.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                1
              </Badge>
              <div>
                <p className="font-medium">Add Your Data Center</p>
                <p className="text-sm text-muted-foreground">
                  Enter specifications including IT load, PUE, and location
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                2
              </Badge>
              <div>
                <p className="font-medium">Configure Carbon Credits</p>
                <p className="text-sm text-muted-foreground">
                  Optionally add carbon credit programs for enhanced analysis
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                3
              </Badge>
              <div>
                <p className="font-medium">Run Predictions</p>
                <p className="text-sm text-muted-foreground">
                  Calculate NPV, IRR, payback period, and environmental impact
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                4
              </Badge>
              <div>
                <p className="font-medium">Make Informed Decisions</p>
                <p className="text-sm text-muted-foreground">
                  Use investment grade ratings to evaluate project viability
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureItem title="Financial Modeling" description="NPV, IRR, and payback period calculations with sensitivity analysis" />
            <FeatureItem title="Energy Analysis" description="Waste heat recovery potential based on PUE and utilization" />
            <FeatureItem title="Carbon Accounting" description="CO2 reduction estimates and carbon credit integration" />
            <FeatureItem title="Geospatial Analysis" description="Distance-based efficiency calculations and heat sink matching" />
            <FeatureItem title="Investment Grading" description="A-D grade system for quick project viability assessment" />
            <FeatureItem title="Export & History" description="Save and export predictions for reporting and comparison" />
          </div>
        </CardContent>
      </Card>
    </div >
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Icon className="h-8 w-8 text-emerald-600 mb-2" />
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
