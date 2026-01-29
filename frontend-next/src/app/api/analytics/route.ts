
import { NextResponse } from 'next/server';

const stats = [
  { label: "Total Heat Potential", value: "2.4 TWh/a" },
  { label: "Carbon Savings", value: "850 kt" },
  { label: "Avg. Payback", value: "4.2 Years" },
  { label: "Grid Density", value: "High" },
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return NextResponse.json(stats);
}
