/* ==========================================================================
   src/utils/emailTemplates.js
   HTML email template functions for all transactional emails.
   Returns complete HTML strings — no external template engine needed.

   Each function accepts a data object and returns { subject, html }.
   ========================================================================== */

import env from '../config/env.js';

/* --------------------------------------------------------------------------
   Shared layout wrapper — consistent header/footer across all emails
   -------------------------------------------------------------------------- */
const layout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MobiMart</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0a0a0a;padding:28px 40px;text-align:center;">
              <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:2px;">MOBI<span style="color:#C5A880;">MART</span></span>
              <p style="margin:4px 0 0;font-size:11px;color:#888;letter-spacing:3px;text-transform:uppercase;">Premium Smartphones</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f7;padding:24px 40px;border-top:1px solid #eeeeea;">
              <p style="margin:0;font-size:12px;color:#999;text-align:center;line-height:1.6;">
                © ${new Date().getFullYear()} MobiMart. All rights reserved.<br/>
                You received this email because you have an account at MobiMart.<br/>
                <a href="${env.FRONTEND_URL}" style="color:#C5A880;text-decoration:none;">Visit MobiMart</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/* --------------------------------------------------------------------------
   Button component
   -------------------------------------------------------------------------- */
const button = (text, url) => `
<div style="text-align:center;margin:32px 0;">
  <a href="${url}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:0.5px;">
    ${text}
  </a>
</div>`;

/* --------------------------------------------------------------------------
   Heading component
   -------------------------------------------------------------------------- */
const heading = (text) =>
  `<h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0a0a0a;">${text}</h1>`;

const subtext = (text) =>
  `<p style="margin:0 0 20px;font-size:14px;color:#666;line-height:1.6;">${text}</p>`;

/* ============================================================
   Template 1 — Email Verification
   ============================================================ */
export const emailVerificationTemplate = ({ name, verificationUrl }) => ({
  subject: 'Verify your MobiMart email address',
  html: layout(`
    ${heading(`Welcome to MobiMart, ${name}! 👋`)}
    ${subtext('Thank you for creating an account. We are thrilled to have you on board.')}
    ${subtext('To complete your registration and unlock all features, please verify your email address. This link will expire in <strong>24 hours</strong>.')}
    
    ${button('Verify Email Address', verificationUrl)}
    
    <div style="margin: 30px 0; padding: 20px; background: #faf9f6; border: 1px dashed #dcdcdc; border-radius: 8px; text-align: left; word-break: break-all;">
      <p style="margin: 0 0 8px; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase;">Fallback Link</p>
      <p style="margin: 0; font-size: 13px; color: #888;">If the button doesn't work, copy and paste this URL into your browser:</p>
      <a href="${verificationUrl}" style="font-size: 13px; color: #C5A880; text-decoration: none;">${verificationUrl}</a>
    </div>

    <p style="font-size:12px;color:#aaa;text-align:center;margin-top:24px;">
      Need help? Reply to this email or contact our <a href="${env.FRONTEND_URL}/support" style="color:#C5A880;text-decoration:none;">support team</a>.<br/>
      If you didn't create a MobiMart account, you can safely ignore this email.
    </p>
  `),
});

/* ============================================================
   Template 2 — Welcome (after email verified)
   ============================================================ */
export const welcomeTemplate = ({ name }) => ({
  subject: 'Your MobiMart account is ready!',
  html: layout(`
    ${heading('Email Verified! ✅')}
    ${subtext(`Hi <strong>${name}</strong>, your email address has been successfully verified.`)}
    ${subtext('You can now shop for premium and certified refurbished smartphones on MobiMart.')}
    ${button('Start Shopping', `${env.FRONTEND_URL}/store`)}
  `),
});

/* ============================================================
   Template 3 — Forgot Password / Reset Link
   ============================================================ */
export const forgotPasswordTemplate = ({ name, resetUrl }) => ({
  subject: 'Reset your MobiMart password',
  html: layout(`
    ${heading('Reset Your Password 🔐')}
    ${subtext(`Hi <strong>${name}</strong>, we received a request to reset your MobiMart account password.`)}
    ${subtext('Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.')}
    ${button('Reset Password', resetUrl)}
    <p style="font-size:12px;color:#aaa;text-align:center;margin-top:24px;">
      If you didn't request a password reset, please ignore this email.<br/>
      Your password will not be changed.
    </p>
  `),
});

/* ============================================================
   Template 4 — Password Changed Confirmation
   ============================================================ */
export const passwordChangedTemplate = ({ name }) => ({
  subject: 'Your MobiMart password was changed',
  html: layout(`
    ${heading('Password Changed ✅')}
    ${subtext(`Hi <strong>${name}</strong>, your MobiMart account password was successfully changed.`)}
    ${subtext('You have been logged out from all other devices for security.')}
    <div style="background:#fff8f0;border:1px solid #f5deba;border-radius:12px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0;font-size:13px;color:#b35900;">
        ⚠️ If you did not make this change, please <a href="${env.FRONTEND_URL}/forgot-password" style="color:#b35900;font-weight:700;">reset your password immediately</a> and contact our support team.
      </p>
    </div>
    ${button('Go to MobiMart', env.FRONTEND_URL)}
  `),
});

/* ============================================================
   Template 5 — Order Confirmation
   ============================================================ */
export const orderConfirmationTemplate = ({ name, orderId, items, total, address, deliveryMethod }) => {
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
        <p style="margin:0;font-size:14px;font-weight:700;color:#0a0a0a;">${item.productName}</p>
        <p style="margin:2px 0 0;font-size:12px;color:#888;">${item.selectedStorage} · ${item.selectedColor} · Qty: ${item.quantity}</p>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-size:14px;font-weight:700;color:#0a0a0a;">
        ₹${item.priceAtPurchase.toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  return {
    subject: `Order Confirmed — ${orderId} | MobiMart`,
    html: layout(`
      ${heading('Order Confirmed! 🎉')}
      ${subtext(`Hi <strong>${name}</strong>, thank you for your order. We've received your order and it's being processed.`)}

      <div style="background:#f9f9f7;border-radius:12px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
        <p style="margin:0;font-size:16px;font-weight:800;color:#0a0a0a;">${orderId}</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
        ${itemRows}
        <tr>
          <td style="padding:16px 0 0;font-size:16px;font-weight:800;color:#0a0a0a;">Total Paid</td>
          <td style="padding:16px 0 0;text-align:right;font-size:16px;font-weight:800;color:#0a0a0a;">₹${total.toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <div style="background:#f0f8f4;border:1px solid #c3e6cb;border-radius:12px;padding:16px 20px;margin:20px 0;">
        <p style="margin:0 0 4px;font-size:12px;color:#2d7a4f;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Delivering To</p>
        <p style="margin:0;font-size:13px;color:#333;line-height:1.6;">
          ${address.name} · ${address.phone}<br/>
          ${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}<br/>
          ${address.city}, ${address.state} - ${address.pinCode}
        </p>
      </div>

      ${button('View Order', `${env.FRONTEND_URL}/dashboard`)}
    `),
  };
};
