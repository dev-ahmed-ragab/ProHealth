import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      'Email is not configured. Set EMAIL_USER and EMAIL_PASS environment variables.'
    );
  }

  const port = Number(process.env.EMAIL_PORT || 587);

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
  });

  return transporter;
};

export default async function sendEmail({ to, subject, html }) {
  if (!to || !subject || !html) {
    throw new Error('Missing required email parameters');
  }

  const info = await getTransporter().sendMail({
    from: `"${process.env.APP_NAME || 'ProHealth'}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return info;
}
