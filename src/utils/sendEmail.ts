import nodemailer from 'nodemailer';
interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}
// Method for sending emails
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const port = (process.env.SMTP_PORT as unknown) as number;

  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,

    auth: {
      user: process.env.SMTP_EMAIL,
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

  console.log('Message sent: %s', info.messageId);
};
