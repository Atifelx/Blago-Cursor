import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create transporter for sending emails
export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Blago AI - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Blago AI</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for signing up with Blago AI! To complete your registration, 
              please use the verification code below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #1f2937; color: white; padding: 20px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                ${verificationCode}
              </div>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Enter this code in the verification form to complete your account setup.
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                <strong>What's next?</strong><br>
                • Verify your email to activate your account<br>
                • Start your 14-day free trial<br>
                • Access all premium AI writing tools<br>
                • Upgrade anytime for unlimited access
              </p>
            </div>
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              This verification code will expire in 10 minutes. If you didn't create an account with Blago AI, 
              please ignore this email.
            </p>
          </div>
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2024 Blago AI. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};
