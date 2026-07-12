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

    // 1. Basic Validation
    if (!payload || !payload.service || !payload.answers || !payload.client) {
      return res.status(400).json({ success: false, error: "Invalid payload structure" });
    }

    const { referenceId, service, client, answers, scoring } = payload;

    // 2. Format Answers for Internal Email
    const formattedAnswers = Object.entries(answers)
      .map(([key, val]) => `<li><strong>${key}:</strong> ${Array.isArray(val) ? val.join(", ") : val}</li>`)
      .join("");

    // 3. Build Email Templates
    const internalHtml = `
      <div style="background:#0A0A0C; padding:40px; font-family:sans-serif; color:#fff;">
        <h2 style="color:#C6A15B;">New Submission: ${client.businessName || client.contactName}</h2>
        <p><strong>Service:</strong> ${service}</p>
        
        <div style="background:#161618; padding:20px; border-radius:8px; margin:20px 0; border: 1px solid #333;">
          <h3 style="color:#C6A15B; margin-top:0;">Client Details</h3>
          <ul style="color:#ddd; line-height:1.6;">
            <li><strong>Name:</strong> ${client.contactName}</li>
            <li><strong>Email:</strong> ${client.email}</li>
            <li><strong>Business:</strong> ${client.businessName || 'N/A'}</li>
            <li><strong>Industry:</strong> ${client.industry || 'N/A'}</li>
            <li><strong>Phone:</strong> ${client.phone || 'N/A'}</li>
          </ul>
        </div>

        <div style="background:#161618; padding:20px; border-radius:8px; margin:20px 0; border: 1px solid #333;">
          <h3 style="color:#C6A15B; margin-top:0;">Scoring & Recommendation</h3>
          <ul style="color:#ddd; line-height:1.6;">
            <li><strong>Raw Score:</strong> ${scoring.rawScore}</li>
            <li><strong>Recommended Tier:</strong> ${scoring.tierDetails?.name || 'N/A'}</li>
            <li><strong>Consultation:</strong> ${scoring.tierDetails?.consult || 'N/A'}</li>
          </ul>
        </div>

        <div style="background:#161618; padding:20px; border-radius:8px; margin:20px 0; border: 1px solid #333;">
          <h3 style="color:#C6A15B; margin-top:0;">Raw Answers</h3>
          <ul style="color:#ddd; line-height:1.6;">
            ${formattedAnswers}
          </ul>
        </div>
      </div>
    `;

    // 4. Send Internal Email via Resend
    // NOTE: 'to' field is currently hardcoded to 'support@miraistack.co.za' for testing.
    // RESTORE to 'team@miraistack.co.za' before production launch.
    await resend.emails.send({
      from: "Mirai Stack Discovery <system@mail.miraistack.co.za>",
      to: "support@miraistack.co.za", // Restore to: "team@miraistack.co.za"
      subject: `🔔 New Submission: ${client.businessName || client.contactName} [${referenceId}]`,
      html: internalHtml,
    });

    // 5. Return Success
    return res.status(200).json({ success: true, referenceId, status: "completed" });
  } catch (err) {
    console.error("Submission Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
