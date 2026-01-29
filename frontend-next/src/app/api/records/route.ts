
import { NextResponse } from 'next/server';

const records = [
    { id: "REC-2024-001", name: "Frankfurt DC Expansion", status: "Compliant", wasteHeat: "2.4 MW", date: "2024-10-12", region: "Hesse" },
    { id: "REC-2024-002", name: "Munich Hyperscale Alpha", status: "Review", wasteHeat: "15.0 MW", date: "2024-10-15", region: "Bavaria" },
    { id: "REC-2024-003", name: "Berlin Edge Node", status: "Non-Compliant", wasteHeat: "0.8 MW", date: "2024-10-18", region: "Berlin" },
    { id: "REC-2024-004", name: "Hamburg Port Colo", status: "Compliant", wasteHeat: "5.2 MW", date: "2024-10-20", region: "Hamburg" },
    { id: "REC-2024-005", name: "Stuttgart High Perf", status: "Pending", wasteHeat: "3.1 MW", date: "2024-10-22", region: "Baden-Württemberg" },
    { id: "REC-2024-006", name: "Dusseldorf Rhine Colo", status: "Compliant", wasteHeat: "4.5 MW", date: "2024-10-25", region: "NRW" },
];

export async function GET() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json(records);
}
