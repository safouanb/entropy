
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

interface SqlNullString {
    String: string;
    Valid: boolean;
}

interface Assessment {
    id: number;
    thermal_load_min_kw: number;
    thermal_load_max_kw: number;
    scenario_results?: SqlNullString;
}

export async function GET() {
    try {
        // Fetch real assessments from backend
        const response = await fetch(`${BACKEND_URL}/api/v1/assessments`);
        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const { assessments = [] }: { assessments: Assessment[] } = await response.json();

        // Calculate real analytics from assessment data
        let totalHeatPotentialMWh = 0;
        let totalCO2Savings = 0;
        let paybackPeriods: number[] = [];

        assessments.forEach(assessment => {
            // Calculate heat potential from thermal load (assuming average 6000 hours/year)
            const avgThermalLoadKW = (assessment.thermal_load_min_kw + assessment.thermal_load_max_kw) / 2;
            const heatPotentialMWhYear = (avgThermalLoadKW * 6000) / 1000; // Convert to MWh/year
            totalHeatPotentialMWh += heatPotentialMWhYear;

            // Parse scenario results for CO2 and payback data
            if (assessment.scenario_results?.Valid && assessment.scenario_results.String) {
                try {
                    const scenarios = JSON.parse(assessment.scenario_results.String);
                    scenarios.forEach((scenario: any) => {
                        if (scenario.co2AvoidedMinKgYear && scenario.co2AvoidedMinKgYear > 0) {
                            totalCO2Savings += scenario.co2AvoidedMinKgYear;
                        }
                        if (scenario.paybackMinYears && scenario.paybackMinYears > 0 && scenario.paybackMinYears < 100) {
                            paybackPeriods.push(scenario.paybackMinYears);
                        }
                    });
                } catch (e) {
                    console.warn('Failed to parse scenario results:', e);
                }
            }
        });

        // Calculate averages and format values
        const totalHeatTWh = totalHeatPotentialMWh / 1000000; // Convert to TWh
        const totalCO2kt = Math.abs(totalCO2Savings) / 1000000; // Convert to kt, take absolute value
        const avgPayback = paybackPeriods.length > 0
            ? paybackPeriods.reduce((a, b) => a + b, 0) / paybackPeriods.length
            : 0;

        const stats = [
            {
                label: "Total Heat Potential",
                value: totalHeatTWh > 0 ? `${totalHeatTWh.toFixed(2)} TWh/a` : "No data"
            },
            {
                label: "Carbon Savings",
                value: totalCO2kt > 0 ? `${totalCO2kt.toFixed(0)} kt` : "Calculating..."
            },
            {
                label: "Avg. Payback",
                value: avgPayback > 0 ? `${avgPayback.toFixed(1)} Years` : "Analysis pending"
            },
            {
                label: "Active Projects",
                value: assessments.length.toString()
            },
        ];

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        // Return fallback data on error
        const fallbackStats = [
            { label: "Total Heat Potential", value: "Service unavailable" },
            { label: "Carbon Savings", value: "Service unavailable" },
            { label: "Avg. Payback", value: "Service unavailable" },
            { label: "Active Projects", value: "0" },
        ];
        return NextResponse.json(fallbackStats);
    }
}
