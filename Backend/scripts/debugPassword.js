require('dotenv').config();
const { connectDB, sequelize } = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const debugPassword = async () => {
  try {
    await connectDB();
    
    const user = await User.findOne({ where: { email: 'omkarbandikatte2602@gmail.com' } });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    
    console.log('User found:');
    console.log('Email:', user.email);
    console.log('Password hash:', user.password);
    console.log('Password hash length:', user.password.length);
    console.log('Password hash type:', typeof user.password);
    
    const testPassword = 'password123';
    console.log('\nTesting password:', testPassword);
    
    // Test 1: Using comparePassword method
    try {
      const result1 = await user.comparePassword(testPassword);
      console.log('comparePassword result:', result1);
    } catch (err) {
      console.log('comparePassword error:', err.message);
    }
    
    // Test 2: Direct bcrypt compare
    try {
      const result2 = await bcrypt.compare(testPassword, user.password);
      console.log('Direct bcrypt.compare result:', result2);
    } catch (err) {
      console.log('Direct bcrypt.compare error:', err.message);
    }
    
    // Test 3: Create new hash and compare
    try {
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('New hash:', newHash);
      const result3 = await bcrypt.compare(testPassword, newHash);
      console.log('New hash comparison result:', result3);
    } catch (err) {
      console.log('New hash error:', err.message);
    }
    
    // Test 4: Check if password has extra characters
    console.log('\nPassword hash bytes:', Buffer.from(user.password).toString('hex').substring(0, 100));
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await sequelize.close();
    process.exit(1);
  }
};

debugPassword();

