import * as nodemailer from 'nodemailer';

export const handleSendMail = async ({ subject, text, email }) => {
  const mailTransporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.USER_GMAIL_ACCOUNT,
      pass: process.env.USER_GMAIL_PASSWORD,
    },
    secure: true,
  });

  const mailDetails = {
    from: process.env.USER_GMAIL_ACCOUNT,
    to: email,
    subject,
    text,
  };

  await mailTransporter.sendMail(mailDetails);
};
