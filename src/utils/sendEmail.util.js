/* eslint-disable require-jsdoc */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import mailGen from 'mailgen';
import { verifyMessage } from './emailMessages';
import emailHelper from './emailHelper.util';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default class EmailSender {
  static sendNotificationEmail = async (reciever, name, link, customMessage, emailSubject) => {
    const mailGenerator = new mailGen(emailHelper);

    const generateEmail = async () => ({
      body: {
        name,
        intro: customMessage.intro,
        action: {
          instructions: customMessage.instruction,
          button: {
            color: '#309043',
            text: customMessage.text,
            link
          }
        },
        outro: customMessage.outro
      }
    });

    const email = await generateEmail();
    const template = await mailGenerator.generate(email);
    const message = {
      to: `${reciever}`,
      from: `${process.env.BAREFOOT_GMAIL_ACCOUNT}`,
      subject: emailSubject,
      html: template
    };

    await sgMail.send(message);
  };
}
