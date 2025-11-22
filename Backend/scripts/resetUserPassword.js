require('dotenv').config();
const { connectDB, sequelize } = require('../config/database');
const { User } = require('../models');

const resetPassword = async () => {
  try {
    await connectDB();
    
    const email = 'omkarbandikatte2602@gmail.com';
    const newPassword = 'password123';
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      await sequelize.close();
      process.exit(1);
    }
    
    console.log(`Resetting password for: ${email}`);
    console.log('Using User.update() which triggers beforeUpdate hook...');
    
    // Use update method which triggers the beforeUpdate hook
    await user.update({ password: newPassword });
    
    console.log('✅ Password reset successfully!');
    console.log(`\nLogin credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    
    // Verify it works
    const updatedUser = await User.findOne({ where: { email } });
    const isMatch = await updatedUser.comparePassword(newPassword);
    console.log(`\nVerification: Password match = ${isMatch}`);
    
    if (isMatch) {
      console.log('✅ Login should work now!');
    } else {
      console.log('❌ Still not working. There might be an issue with the User model hooks.');
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
};

resetPassword();

