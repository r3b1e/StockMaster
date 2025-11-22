require('dotenv').config();
const { connectDB } = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const testLogin = async () => {
  try {
    await connectDB();
    
    // Check if users exist
    const users = await User.findAll();
    console.log(`\nFound ${users.length} users in database:`);
    users.forEach(u => {
      console.log(`- ${u.email} (${u.name})`);
      console.log(`  Password hash: ${u.password.substring(0, 20)}...`);
    });
    
    if (users.length === 0) {
      console.log('\n❌ No users found! Please run: npm run seed');
      process.exit(1);
    }
    
    // Test password comparison
    const testUser = users[0];
    console.log(`\nTesting login for: ${testUser.email}`);
    console.log(`Password in DB: ${testUser.password.substring(0, 20)}...`);
    
    const testPassword = 'password123';
    const isMatch = await testUser.comparePassword(testPassword);
    console.log(`Password match: ${isMatch}`);
    
    // Also test with bcrypt directly
    const directMatch = await bcrypt.compare(testPassword, testUser.password);
    console.log(`Direct bcrypt match: ${directMatch}`);
    
    if (!isMatch && !directMatch) {
      console.log('\n❌ Password comparison failed!');
      console.log('This might mean passwords were not hashed during seed.');
      console.log('Solution: Re-run the seed script with the updated version.');
    } else {
      console.log('\n✅ Password comparison works!');
    }
    
    await require('../config/database').sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testLogin();

