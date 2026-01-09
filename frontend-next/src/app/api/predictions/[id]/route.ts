import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const response = await predictionService.getPredictionResult(parseInt(id));
    return NextResponse.json(response.prediction_result);
  } catch (error) {
    if (error instanceof BackendError) {
      const status = error.code === "not_found" ? 404 : 500;
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to fetch prediction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    await predictionService.deletePredictionResult(parseInt(id));
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
      { code: "internal", message: "Failed to delete prediction" },
      { status: 500 }
    );
  }
}
