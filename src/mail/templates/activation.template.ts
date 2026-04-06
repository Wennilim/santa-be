export function activationEmailTemplate(url: string): string {
  return `
<!DOCTYPE html>
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
              <h1 style="margin:16px 0 0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:1px;text-shadow:0 2px 4px rgba(0,0,0,0.2);">Santa Workshop</h1>
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
                Welcome to the ATOZ Secret Santa family! You're just one step away from joining the fun.
                Please click the button below to activate your account and start spreading the holiday cheer! 🎉
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${url}" style="display:inline-block;background:#c0392b;color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:50px;font-size:17px;font-weight:700;letter-spacing:0.5px;box-shadow:0 4px 16px rgba(192,57,43,0.4);">
                      🎁 Activate My Account
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f4f6f8;padding:24px 32px;border-top:1px solid #e8ecf0;">
              <p style="margin:0 0 4px;color:#95a5a6;font-size:13px;">If you didn't create an account, please ignore this email.</p>
              <p style="margin:0;color:#bdc3c7;font-size:12px;">© ${new Date().getFullYear()} Santa Workshop 🎄</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
