import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import { logger } from '../src/utils/logger.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminEmail = 'admin@daringachievers.com';
    const adminPassword = 'admin123'; // Change this in production
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      logger.info('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      email: adminEmail,
      password: adminPassword,
      name: 'Mwatha Njoroge',
      role: 'admin',
      phone: '254786780780',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_books', 'view_analytics']
    });
    
    await admin.save();
    
    logger.info('Admin user created successfully:', {
      email: adminEmail,
      name: admin.name,
      role: admin.role
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('\n⚠️  Please change the password after first login!');
    
  } catch (error) {
    logger.error('Error creating admin user:', error);
    console.error('❌ Failed to create admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();