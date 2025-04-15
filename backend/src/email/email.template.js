export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: black; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: black;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 5 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const FORGOT_PASSWORD_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 30px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p style="font-size: 15px; color: #555;">
          Hello, <br><br>
          We received a request to reset your password. Click the button below to set a new password.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{RESET_LINK}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #777;">
          If you didn’t request a password reset, you can safely ignore this email. This link will expire in 30 minutes.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 13px; color: #999;">If the button doesn’t work, copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; font-size: 13px; color: #555;">{RESET_LINK}</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const EXAM_ENROLLMENT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exam Enrollment Details</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      color: #333;
    }
    .details {
      margin-top: 20px;
    }
    .details p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
    }
    .highlight {
      color: #111;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 13px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>📚 Exam Enrollment Successful!</h1>
    </div>

    <p>You have been successfully enrolled for the following exam:</p>

    <div class="details">
      <p><strong>Exam Title:</strong> {examTitle}</p>
      <p><strong>Exam Date:</strong> {examDate}</p>
      <p><strong>Exam Time:</strong> {examTime}</p>
      <p><strong>Enrollment ID:</strong> <span class="highlight">{examId}</span></p>
      <p><strong>Password:</strong> <span class="highlight">{examPassword}</span></p>
    </div>

    <p>Please use the above credentials to log in and start your exam on the scheduled date and time.</p>

    <p>Good luck! 🍀</p>

  </div>
</body>
</html>
`;