/* ==========================================================================
   src/services/email.service.js
   Email dispatch service using Nodemailer.
   Sends verification, password reset, and welcome transactional emails.
   ========================================================================== */

import { Resend } from 'resend';
import env from '../config/env.js';
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
  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    
    if (error) {
      console.error('❌ Email dispatch failed:', error.message);
      return null;
    }

    console.log(`✉️  Email sent: ${data.id} to ${to}`);
    return data;
  } catch (error) {
    console.error('❌ Email dispatch failed:', error.message);
    // Do not throw the error to prevent blocking request cycles
    // in case of third-party email provider failures.
    return null;
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
