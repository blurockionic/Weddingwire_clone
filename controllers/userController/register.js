import CustomError from "../../utils/CustomError.js";
import sendVerificationEmail from "../../service/emailService.js";
import z from "zod";
import bcrypt from "bcryptjs";
import { userSchema } from "../../validation schema/user.schema.js";
import { PrismaClient } from "../../prisma/generated/postgres/index.js";
const prisma = new PrismaClient();

// Helper function to create email content
const createEmailContent = (token) => ({
  subject: "Weed-Clone Email Verification",
  text: `Click on the link below to verify your email: ${process.env.BASE_URL}/api/v1/users/verify-email?token=${token}`,
  html: `
    <p>Hello,</p>
    <p>Thank you for registering. Please verify your email using the link below:</p>
    <a href="${process.env.BASE_URL}/api/v1/users/verify-email?token=${token}">Verify Email</a>
    <p>This link will expire in 10 minutes.</p>
    <p>Regards,<br>Your App Team</p>
  `,
});

const userRegistration = async (req, res, next) => {
  try {
    // Validate user input using Zod schema
    const validatedData = userSchema.parse(req.body);

    // Check if the email already exists in the database
    const existingUser = await prisma.User.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        // Email exists and is already verified
        return res
          .status(400)
          .json({ message: "Email already exists and is verified." });
      } else {
        // Email exists but is not verified, resend the verification email
       
        await sendVerificationEmail(existingUser.email, existingUser.user_id, createEmailContent);
        return res.status(200).json({
          message:
            "Email already exists but not verified. Verification email resent.",
        });
      }
    }

    // Hash the password before storing it in the database
    const saltRounds = 10; // Adjust based on your security/performance balance
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Create a new user in the database
    const newUser = await prisma.User.create({
      data: {
        email: validatedData.email,
        password_hash: hashedPassword,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        phone_number: validatedData.phone_number,
        role: validatedData.role,
        wedding_date: validatedData.wedding_date,
        wedding_location: validatedData.wedding_location,
      },
    });

    // Send verification email for the newly registered user
   
    await sendVerificationEmail(newUser.email, newUser.user_id, createEmailContent);

    // Exclude sensitive fields before sending the response
    const { password_hash, resetPasswordToken, resetPasswordExpire, updated_at, created_at, ...userResponse } = newUser;

    res.status(201).json({
      message: "User registered successfully. Verification email sent.",
      user: userResponse,
    });
  } catch (error) {
    console.error(`Error Type: ${error.constructor.name}, Message: ${error.message}, Stack: ${error.stack}`);

    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    next(new CustomError("An error occurred during registration.", 500));
  }
};

export default userRegistration;