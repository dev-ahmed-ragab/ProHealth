import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ahmedfortest9@gmail.com',
    pass: 'ouot hvbl okfz cjzu'
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  }
});

export default async function sendEmail({ to, subject, html }) {
  if (!to || !subject || !html) {
    throw new Error('Missing required email parameters');
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'Medical System'}" <${'ahmedfortest9@gmail.com'}>`,
      to,
      subject,
      html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High'
      }
    });

    return info;
  } catch (err) {
    console.error('فشل في إرسال البريد الإلكتروني:');
    console.error('رسالة الخطأ:', err.message);
    console.error('تفاصيل الخطأ:', {
      to,
      subject,
      emailConfig: {
        host: transporter.options.host,
        port: transporter.options.port,
        secure: transporter.options.secure,
        user: 'ahmedfortest9@gmail.com'
      },
      stack: err.stack
    });
    throw new Error('فشل في إرسال البريد الإلكتروني: ' + (err.message || 'خطأ غير معروف'))
  }
}