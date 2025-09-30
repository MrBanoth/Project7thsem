export const runtime = "nodejs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { to, body } = await request.json()

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_FROM_NUMBER

    if (!accountSid || !authToken || !from) {
      // Demo mode: no Twilio configured, pretend success
      return NextResponse.json({ success: true, simulated: true })
    }

    const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64")
    const form = new URLSearchParams()
    form.set("To", to)
    form.set("From", from)
    form.set("Body", body)

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Twilio SMS error:", text)
      return NextResponse.json({ success: false, error: text }, { status: 500 })
    }

    const json = await res.json()
    return NextResponse.json({ success: true, sid: json.sid })
  } catch (err: any) {
    console.error("/api/sms failure:", err)
    return NextResponse.json({ success: false, error: String(err?.message || err) }, { status: 500 })
  }
}


