import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use relative path for backend API when deployed (when DIAGNOSTICS_API_URL is localhost)
    // This allows Next.js rewrites to proxy the requests to the sidecar container
    const diagnosticsApiUrlEnv =
      process.env.DIAGNOSTICS_API_URL || "http://localhost:8000";
    const diagnosticsApiUrl = diagnosticsApiUrlEnv.includes("localhost")
      ? "/api/backend"
      : diagnosticsApiUrlEnv;

    const config = {
      diagnosticsApiUrl: diagnosticsApiUrl,
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
