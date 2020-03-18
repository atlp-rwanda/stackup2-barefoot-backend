
/* eslint-disable require-jsdoc */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import mailGen from 'mailgen';
import emailBody from '../utils/bodyMessage.utils';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailGenerator = new mailGen({
  theme: 'default',
  product: {
    name: 'Barefoot Nomad',
    link: '#'
  }
});

const appSendEmail = async (
  toEmail,
  link,
  name,
  intro,
  instructions,
  text,
  outro,
  subject,
  color) => {
  const generateEmail = async () => emailBody(name, intro, instructions, color, text, outro, link);
  
  const email = await generateEmail();
  const template = await mailGenerator.generate(email);
  const message = {
    to: `${toEmail}`,
    from: `${process.env.BAREFOOT_GMAIL_ACCOUNT}`,
    subject,
    html: template
  };

  await sgMail.send(message);
};

export default appSendEmail;
