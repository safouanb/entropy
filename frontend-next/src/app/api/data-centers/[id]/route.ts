import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const response = await predictionService.getDataCenter(parseInt(id));
    return NextResponse.json(response.dataCenter);
  } catch (error) {
    if (error instanceof BackendError) {
      const status = error.code === "not_found" ? 404 : 500;
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to fetch data center" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await predictionService.updateDataCenter(parseInt(id), body);
    return NextResponse.json(response.dataCenter);
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to update data center" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    await predictionService.deleteDataCenter(parseInt(id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof BackendError) {
      const status = error.code === "not_found" ? 404 : 500;
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to delete data center" },
      { status: 500 }
    );
  }
}
