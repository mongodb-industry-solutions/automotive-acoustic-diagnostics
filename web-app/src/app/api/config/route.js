import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = {
      diagnosticsApiUrl: process.env.DIAGNOSTICS_API_URL || "http://localhost:8000",
      chartsBaseUrl: process.env.CHARTS_BASE_URL || "",
      chartsDashboardId: process.env.CHARTS_DASHBOARD_ID || "",
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error getting config:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

