
/* eslint-disable require-jsdoc */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import mailGen from 'mailgen';
import { verifyMessage } from '../utils/emailMessages';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default class EmailSender {
  static sendSignUpVerificationLink = async (toEmail, link, name) => {
    const mailGenerator = new mailGen({
      theme: 'default',
      product: {
        name: 'Barefoot Nomad',
        link: '#'
      }
    });

    const generateEmail = async () => ({
      body: {
        name,
        intro: verifyMessage.intro,
        action: {
          instructions: verifyMessage.instructions,
          button: {
            color: '#309043',
            text: verifyMessage.text,
            link
          }
        },
        outro: verifyMessage.outro
      }
    });

    const email = await generateEmail();
    const template = await mailGenerator.generate(email);
    const message = {
      to: `${toEmail}`,
      from: `${process.env.BAREFOOT_GMAIL_ACCOUNT}`,
      subject: 'Verification email',
      html: template
    };

    await sgMail.send(message);
  };
}
