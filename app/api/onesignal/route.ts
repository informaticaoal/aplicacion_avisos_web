import { NextResponse } from "next/server";

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_KEY = process.env.ONESIGNAL_REST_KEY;

export async function POST(req: Request) {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_KEY) {
    return NextResponse.json(
      { error: "OneSignal config missing" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { heading, content, urgency } = body;

  if (!heading || !content) {
    return NextResponse.json(
      { error: "heading and content are required" },
      { status: 400 }
    );
  }

  const response = await fetch("https://api.onesignal.com/notifications?c=push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Key ${ONESIGNAL_REST_KEY}`,
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      target_channel: "push",
      headings: { en: heading },
      contents: { en: content },
      included_segments: ["All Subscriptions"],
      data: {
        type: "aviso",
        urgency: urgency ?? "normal",
      },
    }),
  });

  const data = await response.json();
  console.log("[OneSignal response]", JSON.stringify(data));
  return NextResponse.json(data, { status: response.status });
}
