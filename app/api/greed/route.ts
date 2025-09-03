import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const { data } = await axios.get("https://api.alternative.me/fng/?limit=1");
    const item = Array.isArray(data?.data) ? data.data[0] : null;
    if (!item)
      return NextResponse.json({
        value: null,
        classification: "Unknown",
        timestamp: new Date().toISOString(),
      });
    return NextResponse.json({
      value: Number(item.value),
      classification: item.value_classification,
      timestamp: new Date(Number(item.timestamp) * 1000).toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        value: null,
        classification: "Unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
}
