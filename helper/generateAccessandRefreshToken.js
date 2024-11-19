import jwt from 'jsonwebtoken';
import CustomError from '../utils/CustomError.js'; // Ensure this is correctly imported

class GenerateAccessandRefreshToken {
    
  // Method to generate the access token
  static generateAccessToken(user) {
    try {
      const { user_id, email, first_name, last_name, role } = user;

      return jwt.sign(
        {
          user_id,
          email,
          first_name,
          last_name,
          role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXP,
        }
      );
    } catch (error) {
      console.error('Error generating access token:', error);
      throw new CustomError('Failed to generate access token.', 500);
    }
  }

  // Method to generate the refresh token
  static generateRefreshToken(user) {
    try {
      const { user_id } = user;

      return jwt.sign(
        { user_id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXP,
        }
      );
    } catch (error) {
      console.error('Error generating refresh token:', error);
      throw new CustomError('Failed to generate refresh token.', 500);
    }
  }
}

export default GenerateAccessandRefreshToken;