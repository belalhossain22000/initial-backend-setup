import nodemailer from "nodemailer";


const emailSender = async (subject: string, email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "fbelalhossain2072@gmail.com",
      pass: "lszc hjyv kfqf dtif",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Test School" <fbelalhossain2072@gmail.com>',
    to: email,
    subject: `${subject}`,
    html,
  });

  console.log("Message sent: %s", info.messageId);
};

export default emailSender;
