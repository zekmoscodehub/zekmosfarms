const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.json());

app.post('/send-contact-form', (req, res) => {
  // extract the form data from the request body
  const { name, email, message } = req.body;

  // create a transporter object using your email provider's SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'your_zoho_email_address',
      pass: 'your_zoho_email_password'
    }
  });
  // define the email message to send
  const emailMessage = {
    from: 'your_website_contact_form@yourdomain.com',
    to: 'contact@yourdomain.com',
    subject: 'New contact form submission',
    html: `<p>You have received a new contact form submission:</p>
           <ul>
             <li>Name: ${name}</li>
             <li>Email: ${email}</li>
             <li>Message: ${message}</li>
           </ul
  }
  const nodemailer = require('nodemailer');

// create a transporter object using your email provider's SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@zekmosfarms.org',
    pass: 'document2printer1'
  }
});

// define the email message to send
const message = {
  from: 'your_website_contact_form@zekmosfarms.org',
  to: 'info@yourdomain.com',
  subject: 'New contact form submission',
  html: '<p>You have received a new contact form submission:</p>' +
        '<ul>' +
        '<li>Name: John Doe</li>' +
        '<li>Email: john@example.com</li>' +
        '<li>Message: Hello, world!</li>' +
        '</ul>'
};

// send the email
transporter.sendMail(message, (err, info) => {
  if (err) {
    console.error('Error sending email:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});
