import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Validate ID is a number
        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid assessment ID" }, { status: 400 });
        }

        const res = await fetch(`${BACKEND_URL}/api/v1/assessments/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            if (res.status === 404) {
                return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
            }
            const errorText = await res.text();
            console.error("Backend error:", errorText);
            return NextResponse.json({ error: "Failed to fetch assessment" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Assessment fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const action = url.searchParams.get('action');

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid assessment ID" }, { status: 400 });
        }

        let endpoint = `${BACKEND_URL}/api/v1/assessments/${id}`;

        // Handle specific actions
        if (action === 'finalize') {
            endpoint += '/finalize';
        } else if (action === 'recalculate') {
            endpoint += '/recalculate';
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const body = await request.json().catch(() => ({}));

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Backend error:", errorText);
            return NextResponse.json({ error: `Failed to ${action} assessment` }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Assessment action error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}