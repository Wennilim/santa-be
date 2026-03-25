export const receiveOTP = (otp: string) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#1a3a1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a3a1a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.3);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#c0392b;padding:40px 32px 32px;">
              <p style="margin:0;font-size:48px;letter-spacing:8px;">🎅🎄🎁</p>
              <h1 style="margin:16px 0 0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:1px;text-shadow:0 2px 4px rgba(0,0,0,0.2);">ATOZ Secret Santa</h1>
              <p style="margin:8px 0 0;color:#ffd7d7;font-size:15px;">✨ The most wonderful time of the year ✨</p>
            </td>
          </tr>

          <!-- Snowflake divider -->
          <tr>
            <td align="center" style="background-color:#2d5a27;padding:10px;font-size:18px;letter-spacing:12px;color:#ffffff;">
              ❄️ ⭐ ❄️ ⭐ ❄️
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 16px;color:#2c3e50;font-size:17px;line-height:1.6;">Ho Ho Ho! 🎅</p>
              <p style="margin:0 0 24px;color:#2c3e50;font-size:16px;line-height:1.7;">
               Looks like you need a little help getting back into your account—no worries, we’ve got you covered! 🎁
              </p>
              

          <!-- OTP Section -->
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:8px 0 8px;">
      <p style="margin:0 0 12px;color:#2c3e50;font-size:15px;">
        Use this One-Time Password (OTP) to reset your password:
      </p>

      <!-- OTP BOX -->
      <div style="
        display:inline-block;
        background:linear-gradient(135deg,#fdf2f2,#fdecea);
        border:2px dashed #e74c3c;
        padding:16px 40px;
        border-radius:12px;
        font-size:28px;
        font-weight:800;
        letter-spacing:6px;
        color:#c0392b;
        box-shadow:0 4px 12px rgba(0,0,0,0.08);
      ">
        ${otp}
      </div>
    </td>
  </tr>

  <!-- Expiry -->
  <tr>
    <td align="center" style="padding:16px 0 24px;">
      <p style="margin:0;color:#7f8c8d;font-size:14px;">
        ⏳ This code will expire in 10 minutes
      </p>
    </td>
  </tr>
</table>

         
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f4f6f8;padding:24px 32px;border-top:1px solid #e8ecf0;">
              <p style="margin:0 0 4px;color:#95a5a6;font-size:13px;">If you didn't create an account, please ignore this email.</p>
              <p style="margin:0;color:#bdc3c7;font-size:12px;">© ${new Date().getFullYear()} ATOZ Secret Santa 🎄</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
