import nodemailer from 'nodemailer';

export const handleSendMail = async ({ subject, text, email }) => {
  const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_GMAIL_ACCOUNT,
      pass: process.env.USER_GMAIL_PASSWORD,
    },
  });

  const mailDetails = {
    from: process.env.USER_GMAIL_ACCOUNT,
    to: email,
    subject,
    text,
  };

  await mailTransporter.sendMail(mailDetails);
};
