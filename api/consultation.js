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
    
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, error: "Missing email" });
    }

    const { email, businessName } = payload;

    const html = `
      <div style="background:#0A0A0C; padding:40px; font-family:sans-serif; color:#fff;">
        <h2 style="color:#C6A15B;">New Consultation Request</h2>
        <div style="background:#161618; padding:20px; border-radius:8px; margin:20px 0; border: 1px solid #333;">
          <ul style="color:#ddd; line-height:1.6; list-style:none; padding:0;">
            <li style="margin-bottom:10px;"><strong>Client Name/Business:</strong> ${businessName || 'Not provided'}</li>
            <li><strong>Email:</strong> <a href="mailto:${email}" style="color:#C6A15B; text-decoration:none;">${email}</a></li>
          </ul>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: "Mirai Stack Discovery <system@mail.miraistack.co.za>",
      // TODO: Change this to forms@miraistack.co.za once the alias is created
      to: "support@miraistack.co.za",
      subject: `Consultation Request: ${businessName || email}`,
      html: html,
    });

    return res.status(200).json({ success: true, status: "completed" });
  } catch (err) {
    console.error("Consultation API Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
