require('dotenv').config();
const { connectDB, sequelize } = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const fixPasswords = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    // Get all users
    const users = await User.findAll();
    console.log(`\nFound ${users.length} users`);
    
    if (users.length === 0) {
      console.log('No users found. Please run: npm run seed');
      await sequelize.close();
      process.exit(0);
    }
    
    // Fix passwords for all users
    console.log('\nFixing passwords...');
    for (const user of users) {
      // Check if password is already hashed (starts with $2b$)
      if (user.password && !user.password.startsWith('$2b$')) {
        console.log(`Hashing password for: ${user.email}`);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
      } else if (user.password && user.password.startsWith('$2b$')) {
        // Password is already hashed, but might be wrong - reset to password123
        console.log(`Resetting password for: ${user.email}`);
        user.password = await bcrypt.hash('password123', 10);
        await user.save();
      } else {
        // No password, set default
        console.log(`Setting default password for: ${user.email}`);
        user.password = await bcrypt.hash('password123', 10);
        await user.save();
      }
    }
    
    console.log('\n✅ All passwords fixed!');
    console.log('\nDefault password for all users: password123');
    console.log('\nUsers:');
    const updatedUsers = await User.findAll();
    updatedUsers.forEach(u => {
      console.log(`  - ${u.email} (${u.name})`);
    });
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
};

fixPasswords();

