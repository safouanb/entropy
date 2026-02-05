import { NextResponse } from 'next/server';
import { predictionService } from '@/lib/backend-client';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch real data from backend
        // listActivityStream expects {limit}, pass {limit: 10}
        const [stats, activity] = await Promise.all([
            predictionService.getDashboardStats(),
            predictionService.listActivityStream(10)
        ]);

        return NextResponse.json({
            complianceRate: stats.complianceRate,
            activeSites: stats.activeSites,
            annualSavings: stats.annualSavings,
            totalActivities: stats.totalActivities,
            activityStream: activity.activities || []
        });
    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
