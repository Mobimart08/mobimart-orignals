/* ==========================================================================
   src/database/seed/admin.seed.js
   Seeds a super_admin user into the database using credentials from .env.
   Run with: npm run seed:admin
   ========================================================================== */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../models/User.model.js';
import { ROLES } from '../../constants/roles.js';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be defined in the .env file.');
  process.exit(1);
}
const ADMIN_NAME = 'MobiMart Admin';

async function seedAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      // Update role to super_admin if needed
      if (existingAdmin.role !== ROLES.SUPER_ADMIN) {
        existingAdmin.role = ROLES.SUPER_ADMIN;
        existingAdmin.isEmailVerified = true;
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log('✅ Updated existing user to super_admin role.');
      } else {
        console.log('   No changes needed.');
      }
    } else {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

      // Use raw collection insert to avoid Mongoose default phone:null
      // which conflicts with the sparse unique index on phone
      const db = mongoose.connection.db;
      const result = await db.collection('users').insertOne({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: ROLES.SUPER_ADMIN,
        isEmailVerified: true,
        isActive: true,
        // phone intentionally omitted — sparse index ignores missing fields
        fcmTokens: [],
        recentlyViewed: [],
        searchHistory: [],
        smsOptIn: false,
        avatar: null,
        avatarPublicId: null,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Admin user created successfully!');
      console.log(`   Name:  ${ADMIN_NAME}`);
      console.log(`   Email: ${ADMIN_EMAIL.toLowerCase()}`);
      console.log(`   Role:  ${ROLES.SUPER_ADMIN}`);
      console.log(`   ID:    ${result.insertedId}`);
    }
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedAdmin();
