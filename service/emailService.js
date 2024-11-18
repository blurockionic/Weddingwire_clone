import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";


const sendVerificationEmail = async (email,userId) => {

console.log(email,userId,process.env.BASE_URL +" verified");
try {
    const verificationToken = jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: process.env.EMAIL_EXP });

    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Verify Your Email",
        html: `
          <p>Hello,</p>
          <p>Please verify your email using the link below:</p>
          <a href="${process.env.BASE_URL}/api/v1/users//verify-email?token=${verificationToken}">Verify Email</a>
          <p>This link will expire in 10 minutes.</p>
          <p>Regards,<br>Your App Team</p>
        `,
      };
    
    
      await transporter.sendMail(mailOptions);
      return{verificationToken}

} catch (error) {

    throw new CustomError('Failed to send verification email', 500); 
}
}

export default sendVerificationEmail;