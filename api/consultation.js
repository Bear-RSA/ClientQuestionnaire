const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  // Set CORS headers on all responses
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const payload = req.body;
    
    if (!payload || !payload.email || !payload.name) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const { name, email } = payload;
    const textBody = `${name} (${email}) would like to set a consultation meeting. Please contact them on this email.`;

    await resend.emails.send({
      from: "system@mail.miraistack.co.za",
      to: "support@miraistack.co.za",
      subject: `Consultation Request: ${name}`,
      text: textBody,
    });

    return res.status(200).json({ success: true, status: "completed" });
  } catch (err) {
    console.error("Consultation API Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
