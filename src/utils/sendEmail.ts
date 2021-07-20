import nodemailer from 'nodemailer';
import colors from 'colors';
import Mail from 'nodemailer/lib/mailer';
interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}
// Method for sending emails
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const port: number = (process.env.SMTP_PORT as unknown) as number;

  // Create reusable transporter object using the default SMTP transport
  const transporter: Mail = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,

    auth: {
      user: process.env.SMTP_LOGIN,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Message template
  const message = {
    from: `${process.env.FROM_NAME}, <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log(colors.red.bold(`Message sent:${info.messageId}`));
};
