/* ==========================================================================
   src/services/email.service.js
   Email dispatch service using Nodemailer.
   Sends verification, password reset, and welcome transactional emails.
   ========================================================================== */

import { Resend } from 'resend';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import {
  emailVerificationTemplate,
  welcomeTemplate,
  forgotPasswordTemplate,
  passwordChangedTemplate,
  orderConfirmationTemplate,
} from '../utils/emailTemplates.js';

// Setup Resend client
const resend = new Resend(env.RESEND_API_KEY);

/**
 * Base email sending utility.
 *
 * @param {string} to      - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html    - HTML content of the email
 */
export const sendMail = async (to, subject, html) => {
  console.log(`\n================= EMAIL DISPATCH LOG =================`);
  console.log(`To: ${to}`);
  console.log(`From: ${env.EMAIL_FROM}`);
  console.log(`Subject: ${subject}`);
  // Extracting URL from HTML if present (rudimentary regex for logging)
  const urlMatch = html.match(/href="([^"]+)"/);
  if (urlMatch) {
    console.log(`Action URL: ${urlMatch[1]}`);
  }

  try {
    const response = await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    
    if (response.error) {
      console.error('❌ Resend API Error:', JSON.stringify(response.error, null, 2));
      throw new ApiError(500, `Email dispatch failed: ${response.error.message}`);
    }

    console.log(`✅ Full Resend Response:`, JSON.stringify(response.data, null, 2));
    console.log(`======================================================\n`);
    return response.data;
  } catch (error) {
    console.error('❌ Unexpected Email Exception:', error);
    console.log(`======================================================\n`);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Email dispatch failed: ${error.message}`);
  }
};

/**
 * Sends email verification token.
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  const { subject, html } = emailVerificationTemplate({ name, verificationUrl });
  return sendMail(email, subject, html);
};

/**
 * Sends welcome email after verification success.
 */
export const sendWelcomeEmail = async (email, name) => {
  const { subject, html } = welcomeTemplate({ name });
  return sendMail(email, subject, html);
};

/**
 * Sends forgot password reset URL.
 */
export const sendForgotPasswordEmail = async (email, name, token) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  const { subject, html } = forgotPasswordTemplate({ name, resetUrl });
  return sendMail(email, subject, html);
};

/**
 * Sends password changed confirmation security alert.
 */
export const sendPasswordChangedEmail = async (email, name) => {
  const { subject, html } = passwordChangedTemplate({ name });
  return sendMail(email, subject, html);
};

/**
 * Sends order confirmation.
 */
export const sendOrderConfirmationEmail = async (email, name, orderDetails) => {
  const { subject, html } = orderConfirmationTemplate({
    name,
    orderId: orderDetails.orderId,
    items: orderDetails.items,
    total: orderDetails.total,
    address: orderDetails.shippingAddress,
    deliveryMethod: orderDetails.deliveryMethod,
  });
  return sendMail(email, subject, html);
};
