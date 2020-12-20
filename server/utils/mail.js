const nodemailer = require('nodemailer');

module.exports.sendEmail = (mailOptions, callback) => {
    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.MAILPORT,
        // secure: process.env.SECURE,
        // requireTLS: process.env.REQUIRETLS,
        auth: {
            user: process.env.SENDER,
            pass: process.env.PASSWD
        }
    });

    transporter.sendMail(mailOptions, callback);
    transporter.close();
}

module.exports.mailBody = (url) => {
    return "<div style='height: 100%;width: 100%;background-color: #005368;text-align: center;'>" +
        "<img style='width: 1px; height: 1px; z-index: -9' src='" + url + "'>" +
        "<h2 style='color:white'> Hello Mr Wassim</h2><br>" +
        "<div style='height: 50px;background-color: #B3F983;width: 250px;font-size: 20px;text-align: center;margin: auto;border-radius: 5px;'>" +
        "<a style='background-color: #B3F983;text-decoration: none;color: white;height: 100%;line-height: 45px;'" +
        " target='_blank' href='http://localhost:4200/validate/'>Activate your account</a></div></div>";
}