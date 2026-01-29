
import { NextResponse } from 'next/server';

const kpis = {
    globalRegions: 3,
    complianceHealth: 94,
    financialImpact: 2.4 // M
};

const activityStream = [
    { time: "10 min ago", user: "System", action: "Automatic crawl of Frankfurt_DC_04 regulations updated.", type: "crawling" },
    { time: "2 hours ago", user: "Admin", action: "Approved new conceptual design for Munich Alpha.", type: "approval" },
    { time: "5 hours ago", user: "System", action: "Energy price forecast updated from ENTSO-E.", type: "market" },
    { time: "Yesterday", user: "User_Demo", action: "Created new assessment: Berlin Edge Node.", type: "creation" },
];

export async function GET() {
    await new Promise(resolve => setTimeout(resolve, 600));
    return NextResponse.json({ kpis, activityStream });
}
