const router = require("express").Router();
const nodemailer = require('nodemailer');



router.post('/send', async (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ message: 'Missing required fields: to, subject, or body' });
  }

  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'ashantharuka20001@gmail.com', 
        pass: 'hycp izow pbvb xsmp', 
      },
    });

    const mailOptions = {
      from: 'ashantharuka20001@gmail.com', 
      to,
      subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;
