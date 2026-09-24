import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, early_access } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Please enter an email address" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Missing GOOGLE_SHEET_WEBHOOK_URL in environment");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        email: trimmedEmail,
        early_access: Boolean(early_access),
      }),
      redirect: "follow",
    });

    const responseText = await response.text();

    // Check if Google returned an access/login error
    if (responseText.includes("You need access") || responseText.includes("accounts.google.com")) {
      console.error("Google Apps Script permission error. Ensure 'Who has access' is set to 'Anyone'.");
      return NextResponse.json(
        { error: "Google Sheet permission error: 'Who has access' must be set to 'Anyone'." },
        { status: 502 }
      );
    }

    try {
      const data = JSON.parse(responseText);
      if (data.status === "error") {
        console.error("Google Apps Script execution error:", data.message);
        return NextResponse.json({ error: data.message || "Failed to record signup" }, { status: 500 });
      }
    } catch {
      // If it returned non-JSON but succeeded without access error
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to record signup" }, { status: 502 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Subscribe route error:", err);
    return NextResponse.json({ error: "Unable to process signup. Please try again." }, { status: 500 });
  }
}
