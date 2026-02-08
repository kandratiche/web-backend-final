const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.EMAIL_API_KEY
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'mailgun') {
    return nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_API_KEY
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'postmark') {
    return nodemailer.createTransport({
      host: 'smtp.postmarkapp.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_API_KEY,
        pass: process.env.EMAIL_API_KEY
      }
    });
  }
  return null;
};

const sendEmail = async (options) => {
  try {
    let transporter = createTransporter();

    if (!transporter) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Learning Platform'} <${process.env.EMAIL_FROM || 'noreply@example.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === 'development' && !createTransporter()) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
