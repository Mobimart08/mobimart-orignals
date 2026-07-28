import cron from 'node-cron';
import Token from '../models/Token.model.js';
import Coupon from '../models/Coupon.model.js';
import { logger } from '../utils/logger.js';

export const startCronJobs = () => {
  // Run every night at midnight to clean up expired refresh tokens
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('[CRON] Starting cleanup of expired tokens...');
      const result = await Token.deleteMany({ expiresAt: { $lt: new Date() } });
      logger.info(`[CRON] Cleaned up ${result.deletedCount} expired tokens.`);
    } catch (error) {
      logger.error(`[CRON] Error cleaning up tokens: ${error.message}`);
    }
  });

  // Run every hour to check and deactivate expired coupons
  cron.schedule('0 * * * *', async () => {
    try {
      logger.info('[CRON] Checking for expired coupons...');
      const result = await Coupon.updateMany(
        { endDate: { $lt: new Date() }, isActive: true },
        { isActive: false }
      );
      if (result.modifiedCount > 0) {
        logger.info(`[CRON] Deactivated ${result.modifiedCount} expired coupons.`);
      }
    } catch (error) {
      logger.error(`[CRON] Error deactivating coupons: ${error.message}`);
    }
  });

  logger.info('🕰️ Scheduled Jobs initialized.');
};
