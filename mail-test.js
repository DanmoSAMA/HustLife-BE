const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transport = nodemailer.createTransport(
  smtpTransport({
    host: "mail.alumni.hust.edu.cn",
    port: 465,
    secureConnection: true,
    auth: {
      user: "danmoits@hust.edu.cn",
      pass: "qnqrfuansxuwbbge",
    },
  })
);

const mailOptions = {
  from: 'danmoits@hust.edu.cn',
  to: "danmoits@hust.edu.cn",
  subject: "测试邮件",
  html: "<p> 一封用nodejs的nodemailer发送的测试邮件。</p>",
};

transport.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Message sent: " + info.response);
  }
});
