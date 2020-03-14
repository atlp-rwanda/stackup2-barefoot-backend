import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import Mailgen from 'mailgen';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Barefoot Nomad',
    link: '#'
  }
});
/**
   * @param {string} name - The name of receiver.
   * @param {string} intro - The introduction for email.
   * @param {string} instructions - The instructions for email.
   * @param {string} buttonText - The text within a button.
   * @param {string} link - The link for the reset password form.
   * @returns {object} response json object
   * @description send reset password email
   */
const generateEmail = async (name, intro, instructions, buttonText, link) => ({
  body: {
    name,
    intro,
    action: {
      instructions,
      button: {
        color: '#C02006',
        text: buttonText,
        link
      }
    }
  }
});
/**
   * @param {string} email - The name of receiver.
   * @param {object} template - The template for email.
   * @returns {object} message json object
   * @description generate the message for the email
   */
const generateMessage = async (email, template) => ({
  to: email,
  from: process.env.BAREFOOT_GMAIL_ACCOUNT,
  subject: 'Reset password',
  text: 'hello',
  html: template,
});
/**
   * @param {object} data details for receiver of the email
   * @param {string} name - The name of receiver.
   * @param {string} intro - The introduction for email.
   * @param {string} instructions - The instructions for email.
   * @param {string} buttonText - The text within a button.
   * @param {string} link - The link for the reset password form.
   * @returns {object} response json object
   * @description send reset password email
   */
const sendMail = async (data, name, intro, instructions, buttonText, link) => {
  const email = await generateEmail(name, intro, instructions, buttonText, link);
  const template = mailGenerator.generate(email);
  const message = await generateMessage(data, template);
  await sgMail.send(message);
};
export default sendMail;
