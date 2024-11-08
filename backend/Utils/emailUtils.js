import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token, jwt, user_id) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider here
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:5173/verify-email?token=${token}&jtoken=${jwt}&id=${user_id}`;

  const mailOptions = {
    from: 'Tasty Trails',
    to: email,
    subject: 'Welcome to Tasty Trails! Please Verify Your Account',
    text: `Hello foodie! 🍲 To start your delicious journey with Tasty Trails, please verify your account by clicking the following link: ${verificationLink}.\n\nBon Appétit!\n- The Tasty Trails Team`,
  };

  await transporter.sendMail(mailOptions);
};


