/* eslint-disable import/no-extraneous-dependencies */
import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert as htmlToText } from 'html-to-text';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.filename = user.name.split(' ')[0];
    this.url = url;
    this.from = `Piyush Nashikkar <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      // service: 'Gmail',
      host: process.env.EMAIL_HOST,
      post: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //Activate in gmail "less secure app" option
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the TripNGo Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your Password reset token is valid for only 10 Minutes',
    );
  }
}

// const sendEmail = async (options) => {
// 1) Create a trasnporter
// const transporter = nodemailer.createTransport({
//   // service: 'Gmail',
//   host: process.env.EMAIL_HOST,
//   post: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   //Activate in gmail "less secure app" option
// });
// 2) Define the email options
// const mailOptions = {
//   from: 'Piyush Nashikkar <piyushnashikkar2004@gmail.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
// };
// 3) Actually send the email.
// await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
