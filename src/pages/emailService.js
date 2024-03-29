// emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'svelu107@gmail.com', // Your email address
    pass: 'Sakthimala0810' // Your email password or app password
  }
});

const sendApprovalEmail = async (recipientEmail, innerSubject, innerText) => {
  try {
    const mailOptions = {
      from: 'svelu107@gmail.com',
      to: recipientEmail,
      subject: innerSubject,   //'Account Approved'
      text: innerText// 'Your account has been approved. You can now access your account.'
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendApprovalEmail;
