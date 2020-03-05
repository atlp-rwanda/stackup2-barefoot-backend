import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.MY_KEY);

const sendMail = async (toEmail, link) => {
  const message = {
    to: `${toEmail}`,
    from: `${process.env.MY_EMAIL}`,
    subject: 'Confirm email',
    text: `Thank you for signin up on Barefoot Nomad, Confirm your email by clicking to the link below\n\n Click Here: ${link}`
  };

  const sendIt = await sgMail.send(message, (error, result) => {
    if (error) {
      console.error('Error', error);
    } else {
      console.log('Email Sent');
      console.log(result);
    }
  });

  return sendIt;
};

export default sendMail;
