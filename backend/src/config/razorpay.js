/* ==========================================================================
   src/config/razorpay.js
   Razorpay SDK initialization.
   Exports a configured Razorpay client instance using env credentials.
   Returns null if keys are missing (allows graceful degradation in dev).
   ========================================================================== */

import Razorpay from 'razorpay';
import env from './env.js';

let razorpay = null;

if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export default razorpay;
